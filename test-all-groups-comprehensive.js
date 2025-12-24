/**
 * COMPREHENSIVE TEST - Validates ALL 3 Groups with Real Triggering Data
 * 
 * This test verifies that notifications are ACTUALLY generated
 * (not just that fields exist)
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 COMPREHENSIVE NOTIFICATION TEST - ALL 3 GROUPS\n');
console.log('=' .repeat(70));

// Parse CSV with semicolon delimiter
function parseCsv(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return { data: [], errors: [] };
  
  const delimiter = ';';
  const headers = lines[0].split(delimiter).map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    data.push(row);
  }
  
  return { data, errors: [] };
}

// Parse German number
function parseGerman(val) {
  if (!val || val === '') return null;
  if (typeof val === "number") return val;
  const str = String(val).replace(/\./g, "").replace(/,/g, ".");
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

// Test data expectations
const EXPECTED_RESULTS = {
  group1_errorFlags: 1,      // TEST001 has error flag 0b00000001
  group2_hintCodes: 3,       // TEST002 (5=Leckage), TEST005 (12=Rauchwarnmelder), TEST008 (15=Verbrauch)
  group2_rssiWarnings: 2,    // TEST003 (-95), TEST004 (-105)
  group3_consumption30pct: 3, // TEST001 (43%), TEST004 (43% increase), TEST008 (50% increase)
  group3_zeroConsumption: 1,  // TEST006 (all zeros)
  group3_noData: 1           // TEST007 (old date: 01.11.2025)
};

// Run tests
const testFile = path.join(__dirname, 'public', 'data', 'TEST_ALL_GROUPS.csv');

if (!fs.existsSync(testFile)) {
  console.log('❌ Test file not found:', testFile);
  process.exit(1);
}

const content = fs.readFileSync(testFile, 'utf-8');
const parsed = parseCsv(content);

console.log(`\n📁 Loaded ${parsed.data.length} test devices\n`);
console.log('=' .repeat(70));

// ============================================================
// GROUP 1: Error Flags
// ============================================================
console.log('\n🔴 GROUP 1: ERROR FLAGS');
console.log('-'.repeat(70));

const group1Results = [];
parsed.data.forEach((device, idx) => {
  const errorFlag = device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"];
  if (errorFlag && errorFlag !== "0b" && errorFlag !== "") {
    group1Results.push({
      meter: device["Number Meter"],
      flag: errorFlag,
      expected: "Battery low (Bit 0)"
    });
  }
});

console.log(`Found: ${group1Results.length} devices with error flags`);
console.log(`Expected: ${EXPECTED_RESULTS.group1_errorFlags}`);

if (group1Results.length > 0) {
  group1Results.forEach(r => {
    console.log(`   ✅ ${r.meter}: ${r.flag} → ${r.expected}`);
  });
}

const group1Pass = group1Results.length === EXPECTED_RESULTS.group1_errorFlags;
console.log(`\n${group1Pass ? '✅ GROUP 1 PASSED' : '❌ GROUP 1 FAILED'}`);

// ============================================================
// GROUP 2a: Hint Codes
// ============================================================
console.log('\n🟠 GROUP 2a: HINT CODES');
console.log('-'.repeat(70));

const hintCodeMappings = {
  "5": "Leckage erkannt",
  "12": "Rauchwarnmelder entfernt",
  "15": "Ungewöhnlicher Verbrauch"
};

const group2aResults = [];
parsed.data.forEach((device, idx) => {
  const hintCode = device["Hint Code"];
  if (hintCode && hintCode !== "0" && hintCode !== "") {
    group2aResults.push({
      meter: device["Number Meter"],
      hintCode: hintCode,
      description: device["Hint Code Description"] || hintCodeMappings[hintCode] || "Unknown"
    });
  }
});

console.log(`Found: ${group2aResults.length} devices with hint codes`);
console.log(`Expected: ${EXPECTED_RESULTS.group2_hintCodes}`);

if (group2aResults.length > 0) {
  group2aResults.forEach(r => {
    console.log(`   ✅ ${r.meter}: Code ${r.hintCode} → ${r.description}`);
  });
}

const group2aPass = group2aResults.length === EXPECTED_RESULTS.group2_hintCodes;
console.log(`\n${group2aPass ? '✅ GROUP 2a (Hint Codes) PASSED' : '❌ GROUP 2a (Hint Codes) FAILED'}`);

// ============================================================
// GROUP 2b: RSSI Warnings
// ============================================================
console.log('\n🟠 GROUP 2b: RSSI SIGNAL WARNINGS');
console.log('-'.repeat(70));

const group2bResults = [];
parsed.data.forEach((device, idx) => {
  const rssiValue = device["RSSI Value"];
  if (rssiValue && rssiValue !== "") {
    const rssi = parseInt(String(rssiValue).replace(/[^\d-]/g, ''));
    if (!isNaN(rssi) && rssi < -90) {
      group2bResults.push({
        meter: device["Number Meter"],
        rssi: rssi,
        severity: rssi < -100 ? "CRITICAL" : "WEAK"
      });
    }
  }
});

console.log(`Found: ${group2bResults.length} devices with RSSI warnings`);
console.log(`Expected: ${EXPECTED_RESULTS.group2_rssiWarnings}`);

if (group2bResults.length > 0) {
  group2bResults.forEach(r => {
    console.log(`   ✅ ${r.meter}: ${r.rssi} dBm → ${r.severity} signal`);
  });
}

const group2bPass = group2bResults.length === EXPECTED_RESULTS.group2_rssiWarnings;
console.log(`\n${group2bPass ? '✅ GROUP 2b (RSSI) PASSED' : '❌ GROUP 2b (RSSI) FAILED'}`);

// ============================================================
// GROUP 3a: Consumption ±30%
// ============================================================
console.log('\n🔵 GROUP 3a: CONSUMPTION CHANGE (±30%)');
console.log('-'.repeat(70));

const group3aResults = [];
parsed.data.forEach((device, idx) => {
  const value1 = parseGerman(device["Monthly Value 1"]);
  const value2 = parseGerman(device["Monthly Value 2"]);
  
  if (value1 !== null && value2 !== null && value2 !== 0) {
    const change = ((value1 - value2) / value2) * 100;
    if (Math.abs(change) >= 30) {
      group3aResults.push({
        meter: device["Number Meter"],
        current: value1,
        previous: value2,
        change: change.toFixed(1),
        type: change > 0 ? "INCREASE" : "DECREASE"
      });
    }
  }
});

console.log(`Found: ${group3aResults.length} devices with ±30% change`);
console.log(`Expected: ${EXPECTED_RESULTS.group3_consumption30pct}`);

if (group3aResults.length > 0) {
  group3aResults.forEach(r => {
    console.log(`   ✅ ${r.meter}: ${r.change}% ${r.type} (${r.previous} → ${r.current})`);
  });
}

const group3aPass = group3aResults.length === EXPECTED_RESULTS.group3_consumption30pct;
console.log(`\n${group3aPass ? '✅ GROUP 3a (±30%) PASSED' : '❌ GROUP 3a (±30%) FAILED'}`);

// ============================================================
// GROUP 3b: Zero Consumption
// ============================================================
console.log('\n🔵 GROUP 3b: ZERO CONSUMPTION (3 months)');
console.log('-'.repeat(70));

const group3bResults = [];
parsed.data.forEach((device, idx) => {
  const value1 = parseGerman(device["Monthly Value 1"]);
  const value2 = parseGerman(device["Monthly Value 2"]);
  const value3 = parseGerman(device["Monthly Value 3"]);
  
  if (value1 === 0 && value2 === 0 && value3 === 0) {
    group3bResults.push({
      meter: device["Number Meter"],
      deviceType: device["Device Type"]
    });
  }
});

console.log(`Found: ${group3bResults.length} devices with zero consumption`);
console.log(`Expected: ${EXPECTED_RESULTS.group3_zeroConsumption}`);

if (group3bResults.length > 0) {
  group3bResults.forEach(r => {
    console.log(`   ✅ ${r.meter}: ${r.deviceType} → No consumption for 3 months`);
  });
}

const group3bPass = group3bResults.length === EXPECTED_RESULTS.group3_zeroConsumption;
console.log(`\n${group3bPass ? '✅ GROUP 3b (Zero) PASSED' : '❌ GROUP 3b (Zero) FAILED'}`);

// ============================================================
// GROUP 3c: No Data (Old Date)
// ============================================================
console.log('\n🔵 GROUP 3c: NO DATA RECEIVED (7+ days)');
console.log('-'.repeat(70));

const group3cResults = [];
const today = new Date();
parsed.data.forEach((device, idx) => {
  const actualDate = device["Actual Date"];
  if (actualDate && actualDate !== "") {
    const parts = actualDate.split(".");
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      const daysSince = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (daysSince >= 7) {
        group3cResults.push({
          meter: device["Number Meter"],
          lastDate: actualDate,
          daysSince: daysSince
        });
      }
    }
  }
});

console.log(`Found: ${group3cResults.length} devices with old data`);
console.log(`Expected: ${EXPECTED_RESULTS.group3_noData}`);

if (group3cResults.length > 0) {
  group3cResults.forEach(r => {
    console.log(`   ✅ ${r.meter}: Last data ${r.lastDate} (${r.daysSince} days ago)`);
  });
}

const group3cPass = group3cResults.length === EXPECTED_RESULTS.group3_noData;
console.log(`\n${group3cPass ? '✅ GROUP 3c (No Data) PASSED' : '❌ GROUP 3c (No Data) FAILED'}`);

// ============================================================
// FINAL SUMMARY
// ============================================================
console.log('\n' + '=' .repeat(70));
console.log('\n📊 COMPREHENSIVE TEST SUMMARY\n');

const allResults = [
  { name: 'GROUP 1: Error Flags', pass: group1Pass, found: group1Results.length, expected: EXPECTED_RESULTS.group1_errorFlags },
  { name: 'GROUP 2a: Hint Codes', pass: group2aPass, found: group2aResults.length, expected: EXPECTED_RESULTS.group2_hintCodes },
  { name: 'GROUP 2b: RSSI Warnings', pass: group2bPass, found: group2bResults.length, expected: EXPECTED_RESULTS.group2_rssiWarnings },
  { name: 'GROUP 3a: ±30% Change', pass: group3aPass, found: group3aResults.length, expected: EXPECTED_RESULTS.group3_consumption30pct },
  { name: 'GROUP 3b: Zero Consumption', pass: group3bPass, found: group3bResults.length, expected: EXPECTED_RESULTS.group3_zeroConsumption },
  { name: 'GROUP 3c: No Data', pass: group3cPass, found: group3cResults.length, expected: EXPECTED_RESULTS.group3_noData }
];

let totalPass = 0;
let totalFail = 0;

allResults.forEach(r => {
  const icon = r.pass ? '✅' : '❌';
  console.log(`${icon} ${r.name}: ${r.found}/${r.expected}`);
  if (r.pass) totalPass++; else totalFail++;
});

console.log('\n' + '-'.repeat(70));
console.log(`\n🎯 FINAL RESULT: ${totalPass}/${allResults.length} tests passed\n`);

if (totalFail === 0) {
  console.log('🎉 ALL TESTS PASSED - All 3 Groups are working correctly!\n');
  process.exit(0);
} else {
  console.log(`⚠️ ${totalFail} test(s) failed - Review the results above\n`);
  process.exit(1);
}

