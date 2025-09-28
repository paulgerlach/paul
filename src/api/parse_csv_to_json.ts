#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

/**
 * Type definitions
 */
interface ParsedRecord {
    [key: string]: string | number;
}

interface FileResult {
    fileName: string;
    filePath: string;
    recordCount: number;
    status: 'success' | 'error';
    error?: string;
}

interface ParseMetadata {
    sourceFile?: string;
    fileName?: string;
    recordCount?: number;
    totalFiles?: number;
    totalRecords?: number;
    processedAt: string;
    sourceFolder?: string;
}

interface ParseResult {
    metadata: ParseMetadata;
    parsedData: ParsedRecord[];
    fileResults?: FileResult[];
}

interface FolderParseResult {
    fileList: string[];
    totalFiles: number;
    totalRecords: number;
    fileResults: FileResult[];
}

/**
 * Configuration constants
 */
const CONFIG = {
    DELIMITER: ';',
    ENCODING: 'utf-8' as BufferEncoding,
    INTEGER_REGEX: /^-?\d+$/,
    FLOAT_REGEX: /^-?\d+[,.]?\d*$/
} as const;

/**
 * Utility functions
 */
class Utils {
    /**
     * Convert string value to appropriate data type
     */
    static convertValue(value: string): string | number {
        if (!value || value === '') return value;

        // Check if it's an integer
        if (CONFIG.INTEGER_REGEX.test(value)) {
            return parseInt(value, 10);
        }

        // Check if it's a float (with comma or dot as decimal separator)
        if (CONFIG.FLOAT_REGEX.test(value.replace(',', '.'))) {
            try {
                const floatValue = parseFloat(value.replace(',', '.'));
                if (!isNaN(floatValue)) {
                    return floatValue;
                }
            } catch (e) {
                // Keep as string if conversion fails
            }
        }

        return value;
    }

    /**
     * Parse a single CSV record from header and data lines
     */
    static parseRecord(headerLine: string, dataLine: string): ParsedRecord {
        const headers = headerLine.split(CONFIG.DELIMITER);
        const values = dataLine.split(CONFIG.DELIMITER);
        const record: ParsedRecord = {};

        headers.forEach((header, index) => {
            if (index < values.length) {
                const cleanHeader = header.trim();
                const rawValue = values[index].trim();
                record[cleanHeader] = this.convertValue(rawValue);
            }
        });

        return record;
    }

    /**
     * Process CSV content into records
     */
    static processCSVContent(fileContent: string): ParsedRecord[] {
        const lines = fileContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line);

        const records: ParsedRecord[] = [];

        // Process lines in pairs (header, data)
        for (let i = 0; i < lines.length; i += 2) {
            if (i + 1 < lines.length) {
                const headerLine = lines[i];
                const dataLine = lines[i + 1];

                if (headerLine && dataLine) {
                    const record = this.parseRecord(headerLine, dataLine);
                    records.push(record);
                }
            }
        }

        return records;
    }
}

/**
 * File system utilities
 */
class FileUtils {
    /**
     * Get list of CSV files in a directory
     */
    static getCSVFilesInFolder(folderPath: string): string[] {
        try {
            const files = fs.readdirSync(folderPath);
            const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));
            return csvFiles.map(file => path.join(folderPath, file));
        } catch (error) {
            throw new Error(`Error reading folder: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Write JSON data to file
     */
    static writeJSONFile(filePath: string, data: any): void {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), CONFIG.ENCODING);
        } catch (error) {
            throw new Error(`Error writing JSON file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Read CSV file content
     */
    static readCSVFile(filePath: string): string {
        try {
            return fs.readFileSync(filePath, CONFIG.ENCODING);
        } catch (error) {
            throw new Error(`Error reading CSV file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * CSV Parser class for handling single and multiple file operations
 */
class CSVParser {
    /**
     * Parse CSV data from Google Drive URL and return JSON data
     */
    static async parseCSVFromURL(url: string, fileName: string): Promise<ParseResult> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV from URL: ${response.statusText}`);
            }

            const csvContent = await response.text();
            const parsedData = Utils.processCSVContent(csvContent);

            return {
                metadata: {
                    sourceFile: url,
                    fileName: fileName || 'remote-csv',
                    recordCount: parsedData.length,
                    processedAt: new Date().toISOString()
                },
                parsedData: parsedData.map(record => ({ ...record, fileName: fileName! }))
            };
        } catch (error) {
            throw new Error(`Error parsing CSV from URL ${url}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Parse CSV data from raw content string and return JSON data
     */
    static parseCSVFromContent(csvContent: string, fileName?: string): ParseResult {
        try {
            const parsedData = Utils.processCSVContent(csvContent);

            return {
                metadata: {
                    sourceFile: 'raw-content',
                    fileName: fileName || 'csv-content',
                    recordCount: parsedData.length,
                    processedAt: new Date().toISOString()
                },
                parsedData
            };
        } catch (error) {
            throw new Error(`Error parsing CSV content: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Parse a single CSV file and return JSON data
     */
    static parseCSVToJSON(csvFilePath: string): ParseResult {
        try {
            const fileContent = FileUtils.readCSVFile(csvFilePath);
            const parsedData = Utils.processCSVContent(fileContent);

            return {
                metadata: {
                    sourceFile: csvFilePath,
                    fileName: path.basename(csvFilePath),
                    recordCount: parsedData.length,
                    processedAt: new Date().toISOString()
                },
                parsedData
            };
        } catch (error) {
            throw new Error(`Error parsing CSV file ${csvFilePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Parse a single CSV file and save to JSON file
     */
    static parseCsvToJson(csvFilePath: string, jsonFilePath: string): number {
        try {
            const result = this.parseCSVToJSON(csvFilePath);
            FileUtils.writeJSONFile(jsonFilePath, result);

            console.log(`Successfully parsed ${result.parsedData.length} records from CSV to JSON`);
            console.log(`Output file: ${jsonFilePath}`);

            return result.parsedData.length;
        } catch (error) {
            throw new Error(`Error processing ${csvFilePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Parse all CSV files in a folder and combine them into a single JSON file
 */
function parseAllCSVFiles(folderPath: string, outputJsonPath: string): FolderParseResult {
    try {
        // Get all CSV files in the folder
        const csvFiles = FileUtils.getCSVFilesInFolder(folderPath);
        console.log(`📁 Found ${csvFiles.length} CSV files in folder:`);
        csvFiles.forEach((file, index) => {
            console.log(`   ${index + 1}. ${path.basename(file)}`);
        });

        const result = csvFiles.reduce<ParseResult>((acc, csvFile) => {
            try {
                const fileResult = CSVParser.parseCSVToJSON(csvFile);
                acc.parsedData.push(...fileResult.parsedData);

                // Update metadata
                acc.metadata.totalFiles = (acc.metadata.totalFiles || 0) + 1;
                acc.metadata.totalRecords = (acc.metadata.totalRecords || 0) + (fileResult.metadata.recordCount || 0);

                // Log individual file result
                const fileRes: FileResult = {
                    fileName: path.basename(csvFile),
                    filePath: csvFile,
                    recordCount: fileResult.metadata.recordCount || 0,
                    status: 'success'
                };
                if (!acc.fileResults) acc.fileResults = [];
                acc.fileResults.push(fileRes);

                console.log(`✅ Processed ${fileRes.recordCount} records from ${fileRes.fileName}`);
            } catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                console.error(`❌ Error processing file ${path.basename(csvFile)}: ${errMsg}`);

                // Log error in file results
                const fileRes: FileResult = {
                    fileName: path.basename(csvFile),
                    filePath: csvFile,
                    recordCount: 0,
                    status: 'error',
                    error: errMsg
                };
                if (!acc.fileResults) acc.fileResults = [];
                acc.fileResults.push(fileRes);
            }
            return acc;
        }, {
            metadata: {
                processedAt: new Date().toISOString(),
                totalFiles: 0,
                totalRecords: 0
            },
            parsedData: [],
            fileResults: []
        });

        // Add source folder to metadata
        result.metadata.sourceFolder = folderPath;

        FileUtils.writeJSONFile(outputJsonPath, result);

        console.log(`\n📊 Summary:`);
        console.log(`   📁 Files processed: ${result.metadata.totalFiles}`);
        console.log(`   📝 Total records: ${result.metadata.totalRecords}`);
        console.log(`   📄 Output file: ${outputJsonPath}`);

        return {
            fileList: csvFiles.map(f => path.basename(f)),
            totalFiles: result.metadata.totalFiles || 0,
            totalRecords: result.metadata.totalRecords || 0,
            fileResults: result.fileResults || []
        };

    } catch (error) {
        throw new Error(`Error processing folder: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Export for module usage
export {
    CSVParser,
    parseAllCSVFiles,
    FileUtils,
    Utils,
    CONFIG,
    type ParsedRecord,
    type FileResult,
    type ParseMetadata,
    type ParseResult,
    type FolderParseResult
};