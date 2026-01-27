import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import databaseService from '../services/databaseService.js';

class FirmwareRequestHandler {
  constructor() {
    this.name = 'fw';
    this.isUrgent = true; // 🚨 MUST respond within 5 seconds!
    
    // Configuration
    this.FIRMWARE_DIR = process.env.FIRMWARE_DIR || './firmware';
    this.CHUNK_SIZE = 512; // ComStar specification
    this.MAX_RETRY_ATTEMPTS = 3;
    
    // Cache for open file handles (performance optimization)
    this.fileHandles = new Map();
    this.fileInfoCache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
    
    // Track download progress
    this.downloadProgress = new Map();
    
    // Initialize
    this.ensureFirmwareDirectory();
  }
  
  async ensureFirmwareDirectory() {
    try {
      await fs.mkdir(this.FIRMWARE_DIR, { recursive: true });
      logger.info(`Firmware directory: ${this.FIRMWARE_DIR}`);
      
      // Create subdirectories
      await fs.mkdir(path.join(this.FIRMWARE_DIR, 'upload'), { recursive: true });
      await fs.mkdir(path.join(this.FIRMWARE_DIR, 'active'), { recursive: true });
      await fs.mkdir(path.join(this.FIRMWARE_DIR, 'archive'), { recursive: true });
      
    } catch (error) {
      logger.error(`Failed to create firmware directory: ${error.message}`);
      throw error;
    }
  }
  
  async handle({ gatewayEui, data, messageNumber }) {
    const startTime = Date.now();
    const requestId = `${gatewayEui}-${messageNumber}`;
    
    logger.info({
      gatewayEui,
      messageNumber,
      firmwareFile: data.f,
      chunk: data.c,
      requestId
    }, '🚨 Processing firmware request');
    
    try {
      // Validate request
      this.validateRequest(data);
      
      const { f: firmwareFile, c: chunkNumber } = data;
      
      // Security: Sanitize filename
      const safeFilename = this.sanitizeFilename(firmwareFile);
      
      // Verify gateway is authorized for this firmware
      await this.verifyAuthorization(gatewayEui, safeFilename);
      
      // Get firmware metadata from database
      const firmware = await this.getFirmwareMetadata(safeFilename);
      
      if (!firmware) {
        throw new Error(`Firmware not found: ${safeFilename}`);
      }
      
      // Validate chunk number
      if (chunkNumber < 0 || chunkNumber >= firmware.total_chunks) {
        throw new Error(`Invalid chunk number: ${chunkNumber} (max: ${firmware.total_chunks - 1})`);
      }
      
      // Check if firmware is compatible with gateway
      if (!this.isCompatible(firmware, gatewayEui)) {
        throw new Error(`Firmware ${safeFilename} not compatible with gateway ${gatewayEui}`);
      }
      
      // Read chunk from file system
      const chunk = await this.readFirmwareChunk(safeFilename, chunkNumber);
      
      // Verify chunk integrity
      this.verifyChunkIntegrity(chunk, chunkNumber, firmware);
      
      // Track download progress
      await this.trackDownloadProgress(gatewayEui, safeFilename, chunkNumber, firmware.total_chunks);
      
      // Build response
      const response = this.buildChunkResponse(
        messageNumber,
        chunkNumber,
        firmware.total_chunks,
        chunk
      );
      
      const processingTime = Date.now() - startTime;
      
      // Log success
      logger.info({
        gatewayEui,
        firmwareFile: safeFilename,
        chunkNumber,
        totalChunks: firmware.total_chunks,
        chunkSize: chunk.data.length,
        processingTime,
        requestId
      }, '✅ Firmware chunk delivered');
      
      // Performance monitoring
      if (processingTime > 4000) {
        logger.warn({
          gatewayEui,
          processingTime,
          requestId
        }, '⚠️ Firmware response close to 5-second limit');
      }
      
      // Update download stats in database
      await this.updateDownloadStats(gatewayEui, safeFilename, chunkNumber, true);
      
      return response;
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      logger.error({
        gatewayEui,
        error: error.message,
        processingTime,
        firmwareFile: data.f,
        chunk: data.c,
        requestId
      }, '❌ Firmware request failed');
      
      // Update download stats (failure)
      if (data.f) {
        await this.updateDownloadStats(gatewayEui, data.f, data.c, false, error.message);
      }
      
      // Return error response that gateway can handle
      return this.createErrorResponse(messageNumber, error);
    } finally {
      // Cleanup
      this.cleanupOldHandles();
    }
  }
  
  validateRequest(data) {
    if (!data.f || typeof data.f !== 'string') {
      throw new Error('Missing firmware filename');
    }
    
    if (typeof data.c !== 'number' || !Number.isInteger(data.c) || data.c < 0) {
      throw new Error('Invalid chunk number');
    }
    
    // Validate filename length
    if (data.f.length > 255) {
      throw new Error('Firmware filename too long');
    }
    
    // Validate allowed extensions
    if (!data.f.match(/\.(hex|bin|elf)$/i)) {
      throw new Error('Invalid firmware file extension');
    }
    
    return true;
  }
  
  sanitizeFilename(filename) {
    // Remove path traversal attempts
    const basename = path.basename(filename);
    
    // Remove any null bytes or control characters
    const sanitized = basename.replace(/[^\x20-\x7E.]/g, '');
    
    // Additional validation
    if (sanitized !== basename) {
      logger.warn(`Sanitized filename: ${filename} -> ${sanitized}`);
    }
    
    return sanitized;
  }
  
  async verifyAuthorization(gatewayEui, firmwareFile) {
    // Check if this gateway is scheduled for this firmware update
    const query = `
      SELECT status, retry_count 
      FROM firmware_deployments 
      WHERE gateway_eui = $1 
        AND firmware_id = (
          SELECT id FROM firmware_versions WHERE filename = $2
        )
        AND status IN ('scheduled', 'downloading', 'retrying')
      ORDER BY scheduled_at DESC 
      LIMIT 1
    `;
    
    const result = await databaseService.query(query, [gatewayEui, firmwareFile]);
    
    if (result.rows.length === 0) {
      // Check if firmware is marked as "force" or "available to all"
      const firmwareQuery = `
        SELECT deployment_type, allowed_gateways 
        FROM firmware_versions 
        WHERE filename = $1
      `;
      
      const firmwareResult = await databaseService.query(firmwareQuery, [firmwareFile]);
      
      if (firmwareResult.rows.length === 0) {
        throw new Error('Firmware not found in database');
      }
      
      const firmware = firmwareResult.rows[0];
      
      if (firmware.deployment_type === 'scheduled') {
        throw new Error('Gateway not scheduled for this firmware update');
      }
      
      // For 'available' deployments, check if gateway is in allowed list
      if (firmware.allowed_gateways && firmware.allowed_gateways.length > 0) {
        if (!firmware.allowed_gateways.includes(gatewayEui)) {
          throw new Error('Gateway not authorized for this firmware');
        }
      }
    }
    
    return true;
  }
  
  async getFirmwareMetadata(filename) {
    // Check cache first
    const cached = this.fileInfoCache.get(filename);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.metadata;
    }
    
    // Get from database
    const query = `
      SELECT 
        id,
        filename,
        version,
        type,
        device_model,
        size_bytes,
        checksum_sha256,
        total_chunks,
        chunk_size,
        is_active,
        deployment_type,
        min_version,
        max_version,
        created_at
      FROM firmware_versions 
      WHERE filename = $1 
        AND is_active = true
    `;
    
    const result = await databaseService.query(query, [filename]);
    
    if (result.rows.length === 0) {
      // Check filesystem as fallback
      return await this.getFirmwareMetadataFromFS(filename);
    }
    
    const metadata = result.rows[0];
    
    // Verify file exists and matches database
    await this.verifyFirmwareFile(filename, metadata);
    
    // Cache it
    this.fileInfoCache.set(filename, {
      metadata,
      timestamp: Date.now()
    });
    
    return metadata;
  }
  
  async getFirmwareMetadataFromFS(filename) {
    const filepath = path.join(this.FIRMWARE_DIR, 'active', filename);
    
    try {
      const stats = await fs.stat(filepath);
      const totalChunks = Math.ceil(stats.size / this.CHUNK_SIZE);
      
      // Calculate checksum if not too large
      let checksum = null;
      if (stats.size < 10 * 1024 * 1024) { // 10MB limit
        const fileBuffer = await fs.readFile(filepath);
        checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      }
      
      return {
        filename,
        size_bytes: stats.size,
        total_chunks: totalChunks,
        chunk_size: this.CHUNK_SIZE,
        checksum_sha256: checksum,
        device_model: 'unknown',
        type: this.detectFirmwareType(filename),
        version: this.extractVersionFromFilename(filename),
        is_active: true
      };
      
    } catch (error) {
      logger.warn(`Firmware file not found: ${filepath}`);
      return null;
    }
  }
  
  async verifyFirmwareFile(filename, metadata) {
    const filepath = path.join(this.FIRMWARE_DIR, 'active', filename);
    
    try {
      const stats = await fs.stat(filepath);
      
      // Verify size
      if (stats.size !== metadata.size_bytes) {
        logger.error({
          filename,
          db_size: metadata.size_bytes,
          fs_size: stats.size
        }, 'Firmware size mismatch');
        
        throw new Error('Firmware file size mismatch');
      }
      
      // Verify checksum if available and file is reasonable size
      if (metadata.checksum_sha256 && stats.size < 50 * 1024 * 1024) {
        const fileBuffer = await fs.readFile(filepath);
        const actualChecksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        
        if (actualChecksum !== metadata.checksum_sha256) {
          logger.error({
            filename,
            expected: metadata.checksum_sha256.substring(0, 16),
            actual: actualChecksum.substring(0, 16)
          }, 'Firmware checksum mismatch');
          
          throw new Error('Firmware checksum mismatch');
        }
      }
      
      return true;
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Firmware file not found: ${filename}`);
      }
      throw error;
    }
  }
  
  isCompatible(firmware, gatewayEui) {
    // Check if firmware is compatible with gateway model
    // This would check gateway's hardware model from database
    
    // For now, basic checks
    if (firmware.type === 'boot' && !firmware.filename.includes('boot')) {
      return false;
    }
    
    return true;
  }
  
  async readFirmwareChunk(filename, chunkNumber) {
    const filepath = path.join(this.FIRMWARE_DIR, 'active', filename);
    const startByte = chunkNumber * this.CHUNK_SIZE;
    
    // Get or create file handle
    let fileHandle = this.fileHandles.get(filepath);
    if (!fileHandle) {
      fileHandle = await fs.open(filepath, 'r');
      this.fileHandles.set(filepath, fileHandle);
      
      // Auto-close after 30 seconds of inactivity
      setTimeout(() => {
        if (this.fileHandles.has(filepath)) {
          this.fileHandles.get(filepath)?.close();
          this.fileHandles.delete(filepath);
        }
      }, 30000);
    }
    
    const buffer = Buffer.alloc(this.CHUNK_SIZE);
    const { bytesRead } = await fileHandle.read(
      buffer,
      0,
      this.CHUNK_SIZE,
      startByte
    );
    
    // Return only actual bytes read
    const chunkData = buffer.slice(0, bytesRead);
    
    return {
      data: chunkData,
      size: bytesRead,
      address: startByte,
      isLast: bytesRead < this.CHUNK_SIZE
    };
  }
  
  verifyChunkIntegrity(chunk, chunkNumber, firmware) {
    // Basic validation
    if (chunk.data.length === 0) {
      throw new Error(`Empty chunk ${chunkNumber}`);
    }
    
    // Check for corruption patterns
    const zeroCount = chunk.data.filter(byte => byte === 0).length;
    if (zeroCount === chunk.data.length) {
      logger.warn(`Chunk ${chunkNumber} is all zeros`);
    }
    
    // Verify chunk doesn't exceed file size
    const maxAddress = firmware.size_bytes;
    if (chunk.address >= maxAddress) {
      throw new Error(`Chunk address ${chunk.address} exceeds file size ${maxAddress}`);
    }
    
    return true;
  }
  
  async trackDownloadProgress(gatewayEui, firmwareFile, chunkNumber, totalChunks) {
    const progressKey = `${gatewayEui}-${firmwareFile}`;
    const now = Date.now();
    
    let progress = this.downloadProgress.get(progressKey);
    
    if (!progress) {
      progress = {
        gatewayEui,
        firmwareFile,
        startedAt: now,
        lastChunkAt: now,
        currentChunk: chunkNumber,
        totalChunks,
        chunksReceived: new Set()
      };
      this.downloadProgress.set(progressKey, progress);
    }
    
    progress.lastChunkAt = now;
    progress.currentChunk = chunkNumber;
    progress.chunksReceived.add(chunkNumber);
    
    // Clean old progress entries
    this.cleanupOldProgress();
  }
  
  async updateDownloadStats(gatewayEui, firmwareFile, chunkNumber, success, errorMessage = null) {
    const query = `
      INSERT INTO firmware_download_log (
        gateway_eui,
        firmware_filename,
        chunk_number,
        success,
        error_message,
        downloaded_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    await databaseService.query(query, [
      gatewayEui,
      firmwareFile,
      chunkNumber,
      success,
      errorMessage,
      new Date().toISOString()
    ]);
    
    // Update deployment status if this is a scheduled update
    if (success) {
      await this.updateDeploymentStatus(gatewayEui, firmwareFile, chunkNumber);
    }
  }
  
  async updateDeploymentStatus(gatewayEui, firmwareFile, chunkNumber) {
    const query = `
      UPDATE firmware_deployments 
      SET 
        current_chunk = $1,
        status = 'downloading',
        last_chunk_at = NOW(),
        retry_count = 0
      WHERE gateway_eui = $2 
        AND firmware_id = (
          SELECT id FROM firmware_versions WHERE filename = $3
        )
        AND status IN ('scheduled', 'downloading', 'retrying')
      RETURNING id
    `;
    
    await databaseService.query(query, [chunkNumber, gatewayEui, firmwareFile]);
  }
  
  buildChunkResponse(requestNumber, chunkNumber, totalChunks, chunk) {
    return {
      c: chunkNumber,
      t: totalChunks,
      a: chunk.address,
      d: chunk.data.toString('hex').toUpperCase() // Hex string, uppercase per spec
    };
  }
  
  createErrorResponse(requestNumber, error) {
    // Error codes the gateway understands
    const errorCodes = {
      'ENOENT': 'FILE_NOT_FOUND',
      'EACCES': 'ACCESS_DENIED',
      'not found': 'FIRMWARE_NOT_FOUND',
      'not authorized': 'UNAUTHORIZED',
      'not scheduled': 'NOT_SCHEDULED',
      'checksum': 'CHECKSUM_ERROR'
    };
    
    let errorCode = 'UNKNOWN_ERROR';
    for (const [pattern, code] of Object.entries(errorCodes)) {
      if (error.message.toLowerCase().includes(pattern.toLowerCase())) {
        errorCode = code;
        break;
      }
    }
    
    return {
      c: -1, // Error indicator
      t: 0,
      a: 0,
      d: `ERR:${errorCode}`
    };
  }
  
  cleanupOldHandles() {
    const now = Date.now();
    // File handles auto-close via setTimeout
  }
  
  cleanupOldProgress() {
    const now = Date.now();
    const thirtyMinutesAgo = now - (30 * 60 * 1000);
    
    for (const [key, progress] of this.downloadProgress.entries()) {
      if (progress.lastChunkAt < thirtyMinutesAgo) {
        this.downloadProgress.delete(key);
      }
    }
  }
  
  // Helper methods
  
  detectFirmwareType(filename) {
    if (filename.includes('boot') || filename.includes('mcuboot')) return 'boot';
    if (filename.includes('modem') || filename.includes('mfw')) return 'modem';
    if (filename.includes('app') || filename.includes('application')) return 'application';
    return 'unknown';
  }
  
  extractVersionFromFilename(filename) {
    const versionMatch = filename.match(/(\d+\.\d+\.\d+)/);
    return versionMatch ? versionMatch[1] : 'unknown';
  }
  
  // Admin functions
  
  async uploadFirmware(fileBuffer, originalFilename, metadata = {}) {
    // Generate safe filename
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${this.sanitizeFilename(originalFilename)}`;
    const uploadPath = path.join(this.FIRMWARE_DIR, 'upload', safeFilename);
    
    // Save file
    await fs.writeFile(uploadPath, fileBuffer);
    
    // Calculate checksum
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const totalChunks = Math.ceil(fileBuffer.length / this.CHUNK_SIZE);
    
    // Extract version if not provided
    const version = metadata.version || this.extractVersionFromFilename(originalFilename);
    const type = metadata.type || this.detectFirmwareType(originalFilename);
    
    // Store in database
    const query = `
      INSERT INTO firmware_versions (
        filename,
        original_filename,
        version,
        type,
        device_model,
        size_bytes,
        checksum_sha256,
        total_chunks,
        chunk_size,
        description,
        release_notes,
        min_version,
        max_version,
        deployment_type,
        is_active,
        uploaded_by,
        uploaded_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, filename
    `;
    
    const result = await databaseService.query(query, [
      safeFilename,
      originalFilename,
      version,
      type,
      metadata.device_model || 'nRF9160-SICA',
      fileBuffer.length,
      checksum,
      totalChunks,
      this.CHUNK_SIZE,
      metadata.description || '',
      metadata.release_notes || '',
      metadata.min_version || null,
      metadata.max_version || null,
      metadata.deployment_type || 'scheduled',
      true,
      metadata.uploaded_by || 'system',
      new Date().toISOString()
    ]);
    
    // Move to active directory
    const activePath = path.join(this.FIRMWARE_DIR, 'active', safeFilename);
    await fs.rename(uploadPath, activePath);
    
    logger.info({
      firmwareId: result.rows[0].id,
      filename: safeFilename,
      size: fileBuffer.length,
      chunks: totalChunks,
      checksum: checksum.substring(0, 16)
    }, '✅ Firmware uploaded and registered');
    
    return result.rows[0];
  }
  
  async getDownloadProgress(gatewayEui) {
    const progress = Array.from(this.downloadProgress.values())
      .filter(p => p.gatewayEui === gatewayEui);
    
    return progress.map(p => ({
      firmwareFile: p.firmwareFile,
      progress: `${((p.chunksReceived.size / p.totalChunks) * 100).toFixed(1)}%`,
      currentChunk: p.currentChunk,
      totalChunks: p.totalChunks,
      startedAt: new Date(p.startedAt),
      lastActivity: new Date(p.lastChunkAt),
      chunksReceived: p.chunksReceived.size
    }));
  }
  
  async listAvailableFirmware(gatewayEui = null) {
    let query = `
      SELECT 
        id,
        filename,
        original_filename,
        version,
        type,
        device_model,
        size_bytes,
        total_chunks,
        description,
        deployment_type,
        is_active,
        created_at
      FROM firmware_versions 
      WHERE is_active = true
    `;
    
    const params = [];
    
    if (gatewayEui) {
      query += ` AND (
        deployment_type = 'available' 
        OR id IN (
          SELECT firmware_id FROM firmware_deployments 
          WHERE gateway_eui = $1 
          AND status IN ('scheduled', 'downloading')
        )
      )`;
      params.push(gatewayEui);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const result = await databaseService.query(query, params);
    return result.rows;
  }
}

const firmwareRequestHandler = new FirmwareRequestHandler();
export default firmwareRequestHandler;