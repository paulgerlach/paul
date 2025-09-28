#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

/**
 * Type definitions for meter reading data
 */
interface MeterReading {
    [key: string]: string | number;
}

interface ParsedFileResult {
    fileName: string;
    recordCount: number;
    data: MeterReading[];
    processedAt: string;
}

interface ParserResult {
    totalFiles: number;
    totalRecords: number;
    files: ParsedFileResult[];
    processedAt: string;
}

/**
 * Specialized parser for meter reading CSV files
 */
class MeterReadingParser {
    private static readonly DELIMITER = ';';
    private static readonly ENCODING: BufferEncoding = 'utf-8';

    /**
     * Convert string value to appropriate type (number or string)
     */
    private static convertValue(value: string): string | number {
        if (!value || value.trim() === '') {
            return '';
        }

        const trimmedValue = value.trim();

        // Handle comma decimal separator (German format)
        const normalizedValue = trimmedValue.replace(',', '.');
        
        // Check if it's a number
        if (/^-?\d+(\.\d+)?$/.test(normalizedValue)) {
            const numValue = parseFloat(normalizedValue);
            return Number.isInteger(numValue) ? parseInt(normalizedValue, 10) : numValue;
        }

        return trimmedValue;
    }

    /**
     * Parse a single CSV file
     */
    static parseCSVFile(filePath: string): ParsedFileResult {
        try {
            const fileContent = fs.readFileSync(filePath, this.ENCODING);
            const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line);

            if (lines.length === 0) {
                throw new Error('File is empty');
            }

            // Extract header and data
            const headerLine = lines[0];
            const headers = headerLine.split(this.DELIMITER).map(h => h.trim());
            
            const data: MeterReading[] = [];

            // Process data lines
            for (let i = 1; i < lines.length; i++) {
                const dataLine = lines[i];
                if (dataLine) {
                    const values = dataLine.split(this.DELIMITER);
                    
                    const record: MeterReading = {};
                    headers.forEach((header, index) => {
                        const value = values[index] || '';
                        record[header] = this.convertValue(value);
                    });
                    
                    data.push(record);
                }
            }

            return {
                fileName: path.basename(filePath),
                recordCount: data.length,
                data,
                processedAt: new Date().toISOString()
            };

        } catch (error) {
            throw new Error(`Error parsing file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Parse multiple CSV files
     */
    static parseMultipleFiles(filePaths: string[]): ParserResult {
        const files: ParsedFileResult[] = [];
        let totalRecords = 0;

        for (const filePath of filePaths) {
            try {
                const result = this.parseCSVFile(filePath);
                files.push(result);
                totalRecords += result.recordCount;
                console.log(`✅ Parsed ${result.fileName}: ${result.recordCount} records`);
            } catch (error) {
                console.error(`❌ Error parsing ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
                // Continue with other files even if one fails
            }
        }

        return {
            totalFiles: files.length,
            totalRecords,
            files,
            processedAt: new Date().toISOString()
        };
    }

    /**
     * Save parsed data to JSON file
     */
    static saveToJSON(data: ParserResult, outputPath: string): void {
        try {
            const jsonContent = JSON.stringify(data, null, 2);
            fs.writeFileSync(outputPath, jsonContent, this.ENCODING);
            console.log(`📝 Data saved to: ${outputPath}`);
        } catch (error) {
            throw new Error(`Error saving JSON file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Main execution function
 */
async function main() {
    try {
        console.log('🚀 Starting meter reading CSV parser...\n');

        // Define the 3 files to parse
        const baseDir = '/Users/saad/Desktop/paul/public/data/worringer-str-86';
        const filesToParse = [
            path.join(baseDir, 'Worringerestrasse86_20250828_new.csv'),
            path.join(baseDir, 'Worringerestrasse86_20250829 (1)_new.csv'),
            path.join(baseDir, 'Worringerestrasse86_20250827 (1)_new.csv')
        ];

        // Verify files exist
        const existingFiles = filesToParse.filter(filePath => {
            const exists = fs.existsSync(filePath);
            if (!exists) {
                console.warn(`⚠️  File not found: ${filePath}`);
            }
            return exists;
        });

        if (existingFiles.length === 0) {
            throw new Error('No valid files found to parse');
        }

        console.log(`📁 Found ${existingFiles.length} files to parse:`);
        existingFiles.forEach(file => console.log(`   - ${path.basename(file)}`));
        console.log();

        // Parse the files
        const result = MeterReadingParser.parseMultipleFiles(existingFiles);

        // Save to JSON
        const outputPath = path.join('/Users/saad/Desktop/paul/public/data', 'parsed_meter_readings.json');
        MeterReadingParser.saveToJSON(result, outputPath);

        console.log('\n📊 Summary:');
        console.log(`   Total files processed: ${result.totalFiles}`);
        console.log(`   Total records: ${result.totalRecords}`);
        console.log(`   Output file: ${outputPath}`);
        console.log('\n✅ Parsing completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

// Export for use as a module
export {
    MeterReadingParser,
    type MeterReading,
    type ParsedFileResult,
    type ParserResult
};

// Auto-run the main function
main().catch(console.error);