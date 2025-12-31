# 📊 Notification Groups - Data Sources & Implementation

## 🟢 GROUP 1: ErrorFlags (✅ Already Implemented)
**Data Source:** `ErrorFlags(binary)(deviceType specific)` column  
**Implementation:** Direct bit parsing (0b00000001 = Bit 0 = Battery low)  
**Complexity:** ⭐ Simple (already done)

```typescript
// Just read and parse the binary flag
const errorFlag = device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"];
if (errorFlag !== "0b") {
  // Parse bits 0-7 → Map to error messages
}
```

---

## 🟡 GROUP 2: Hint Codes & Status (❌ Not Implemented)
**Data Source:** CSV columns (direct reading, NO calculation)

| Column | What It Tells Us | Implementation |
|--------|------------------|----------------|
| `Hint Code` | Numeric code (e.g., `5` = Leakage) | Parse integer |
| `Hint Code Description` | Text explanation | Read string |
| `Status Byte` | Device status (0x01 = OK) | Compare changes |
| `RSSI Value` | Signal strength (-90 dBm) | Check threshold |

**Complexity:** ⭐⭐ Medium (just read & interpret)

**Example:**
```typescript
// NEW Engelmann CSV format
const hintCode = device["Hint Code"]; // e.g., "5"
const hintDescription = device["Hint Code Description"]; // e.g., "Leckage erkannt"

if (hintCode === "5") {
  notification = {
    title: "Leckage erkannt",
    subtitle: hintDescription,
    severity: "critical"
  };
}
```

**Why it's similar to GROUP 1:**
- Both read DIRECTLY from CSV
- No math required
- Just conditional logic

---

## 🔵 GROUP 3: Consumption Analysis (❌ Not Implemented)
**Data Source:** CSV columns (requires CALCULATION & COMPARISON)

### Available Data in CSV:

#### **Old Format (Heat_Meter_Data.csv):**
```csv
IV,1,0,0,Wh,E  → Month 1
IV,2,0,0,Wh,E  → Month 2
IV,4,0,0,Wh,E  → Month 4
IV,6,0,0,Wh,E  → Month 6
...
```

#### **New Format (Worringerestrasse86_20250827.csv):**
```csv
Monthly Date 1, Monthly Value 1, Monthly Unit 1   → 31.07.2025, 0.000, MWh Energie
Monthly Date 2, Monthly Value 2, Monthly Unit 2   → 30.06.2025, 0.000, MWh Energie
...
Half Monthly Date 1, Half Monthly Value 1, ...    → 15.07.2025, 0.000, MWh
```

**Complexity:** ⭐⭐⭐⭐ High (requires algorithms)

### Why GROUP 3 is MUCH HARDER:

| Feature | GROUP 2 | GROUP 3 |
|---------|---------|---------|
| **Read CSV?** | ✅ Yes | ✅ Yes |
| **Parse values?** | ✅ Simple | ⚠️ Complex |
| **Calculate?** | ❌ No | ✅ **YES** |
| **Compare periods?** | ❌ No | ✅ **YES** |
| **Handle missing data?** | ❌ No | ✅ **YES** |
| **Detect trends?** | ❌ No | ✅ **YES** |

### What GROUP 3 Requires:

#### 1. **Consumption Increase/Decrease (±30%)**
```typescript
// Get last 2 months of data for this meter
const month1 = device["Monthly Value 1"]; // Current month
const month2 = device["Monthly Value 2"]; // Previous month

// Calculate percentage change
const change = ((month1 - month2) / month2) * 100;

if (Math.abs(change) >= 30) {
  notification = {
    type: change > 0 ? "Verbrauchsanstieg" : "Verbrauchsrückgang",
    subtitle: `${Math.abs(change).toFixed(0)}% ${change > 0 ? 'Anstieg' : 'Rückgang'} im Vergleich zum Vormonat`
  };
}
```

#### 2. **Leakage Detection** (Constant High Flow)
```typescript
// Check if consumption is consistently HIGH across multiple periods
const last3Months = [
  device["Monthly Value 1"],
  device["Monthly Value 2"],
  device["Monthly Value 3"]
];

// Calculate average and standard deviation
const avg = last3Months.reduce((a, b) => a + b) / 3;
const isConstantHigh = last3Months.every(val => val > avg * 1.5);

if (isConstantHigh) {
  notification = {
    type: "Leckage",
    subtitle: "Dauerhaft hoher Durchfluss - mögliche Leckage"
  };
}
```

#### 3. **No Data Received** (Missing Readings)
```typescript
// Check if actual date is too old
const actualDate = device["Actual Date"]; // "27.08.2025"
const daysSinceReading = calculateDaysSince(actualDate);

if (daysSinceReading > 7) {
  notification = {
    type: "Keine Daten",
    subtitle: `Keine Daten seit ${daysSinceReading} Tagen empfangen`
  };
}
```

#### 4. **Zero Consumption** (Possible Blockage)
```typescript
const last3Values = [
  device["Monthly Value 1"],
  device["Monthly Value 2"],
  device["Monthly Value 3"]
];

if (last3Values.every(val => val === 0)) {
  notification = {
    type: "Blockade",
    subtitle: "Kein Verbrauch seit 3 Monaten - mögliche Blockade"
  };
}
```

---

## 📋 Summary: What We Need to Implement

### GROUP 2 (Medium Effort - 1 hour)
✅ **Just read CSV columns and interpret:**
- `Hint Code` → Map to notification types
- `RSSI Value` → Check if < -90 dBm
- `Status Byte` → Detect changes

### GROUP 3 (High Effort - 3-4 hours)
✅ **Read CSV + Calculate + Compare:**
1. Parse monthly/half-monthly values
2. Calculate percentage changes
3. Detect anomalies (spikes, constant high, zero)
4. Handle missing/incomplete data
5. Compare across time periods
6. Generate smart alerts

---

## 🎯 Recommended Implementation Order:

### Phase 1: Quick Wins (1 hour)
1. GROUP 2: Hint Code parsing
2. GROUP 2: RSSI signal strength
3. UI: Three-dot button centering

### Phase 2: Advanced Analytics (3 hours)
1. GROUP 3: Consumption ±30% detection
2. GROUP 3: No data received alerts
3. GROUP 3: Zero consumption detection

### Phase 3: Machine Learning (Future)
1. GROUP 3: Anomaly detection algorithms
2. GROUP 3: Predictive maintenance
3. GROUP 3: Pattern recognition

---

## 🔍 Bottom Line:

**Same CSV? YES ✅**  
**Same complexity? NO ❌**

- GROUP 2 = Read CSV columns (easy)
- GROUP 3 = Read CSV + Math + Logic (hard)

It's like the difference between:
- **GROUP 2:** Reading a thermometer (direct reading)
- **GROUP 3:** Predicting weather patterns (analysis & trends)









