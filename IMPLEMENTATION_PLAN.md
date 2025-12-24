# 🎯 Notification Groups 2 & 3 Implementation Plan

## 📋 Overview
Implementing 3 major improvements to the notification system:
1. GROUP 2: Hint Code & RSSI parsing
2. GROUP 3: Consumption analysis & alerts
3. UI Fix: Three-dot button centering

---

## 🟡 GROUP 2: Hint Code & RSSI (1 hour)

### Task 1: Add Hint Code & RSSI to Type Definition
**File:** `src/api/index.ts`
**Changes:**
```typescript
export type MeterReadingType = {
  // ... existing fields ...
  "Hint Code"?: string | number;
  "Hint Code Description"?: string;
  "RSSI Value"?: string | number;
  "Status Byte"?: string;
  // Monthly data for GROUP 3
  "Monthly Date 1"?: string;
  "Monthly Value 1"?: string | number;
  "Monthly Unit 1"?: string;
  // ... Monthly 2-15 ...
}
```

### Task 2: Create Hint Code Interpreter
**File:** `src/utils/hintCodeInterpreter.ts` (NEW)
**Logic:**
- Parse hint codes (5 = Leakage, 12 = Smoke detector, etc.)
- Map to notification types
- Determine severity
- Generate proper icons

### Task 3: Add RSSI Checker
**File:** `src/utils/rssiChecker.ts` (NEW)
**Logic:**
- Check if RSSI < -90 dBm (weak signal)
- Generate low signal warnings

### Task 4: Integrate into NotificationsChart
**File:** `src/components/Basic/Charts/NotificationsChart.tsx`
**Changes:**
- Import new utilities
- Add hint code checking to `generateDynamicNotifications()`
- Add RSSI checking
- Merge with existing error flag notifications

---

## 🔵 GROUP 3: Consumption Analysis (3 hours)

### Task 5: Create Consumption Analyzer
**File:** `src/utils/consumptionAnalyzer.ts` (NEW)
**Functions:**
```typescript
- calculateConsumptionChange(device): number | null
  // Compare Monthly Value 1 vs Monthly Value 2
  // Return percentage change

- detectConsumptionAnomaly(device): NotificationType | null
  // Check for ±30% change
  // Return notification object

- detectZeroConsumption(device): boolean
  // Check if last 3 months = 0

- detectNoData(device): number | null
  // Check days since last reading
  // Return days or null
```

### Task 6: Add Monthly Data Parsing
**File:** `src/utils/consumptionAnalyzer.ts`
**Logic:**
- Parse German date format ("31.07.2025")
- Parse German number format ("1,234" → 1.234)
- Handle missing data gracefully

### Task 7: Integrate Consumption Alerts
**File:** `src/components/Basic/Charts/NotificationsChart.tsx`
**Changes:**
- Import `consumptionAnalyzer`
- Add consumption checking loop
- Generate notifications for:
  - ±30% changes
  - Zero consumption (3+ months)
  - No data received (7+ days)

---

## 🎨 UI Fix: Three-Dot Button Centering (15 min)

### Task 8: Center Three-Dot Button
**File:** `src/components/Basic/Charts/NotificationsChart.tsx`
**Change:**
```typescript
// Line 582: Change from
<div className="mt-1">

// To
<div className="flex items-center">
```

---

## 📊 Implementation Order

### Phase 1: Type Definitions (10 min)
1. Update `MeterReadingType` in `src/api/index.ts`
2. Add Hint Code, RSSI, Monthly fields

### Phase 2: GROUP 2 Implementation (50 min)
1. Create `hintCodeInterpreter.ts` (20 min)
2. Create `rssiChecker.ts` (10 min)
3. Integrate into `NotificationsChart.tsx` (20 min)

### Phase 3: GROUP 3 Implementation (2h 45min)
1. Create `consumptionAnalyzer.ts` (1h 30min)
   - Percentage change calculation
   - Zero consumption detection
   - No data detection
   - German date/number parsing
2. Integrate into `NotificationsChart.tsx` (1h 15min)
   - Loop through devices
   - Generate consumption notifications
   - Merge with other notifications
   - Handle edge cases

### Phase 4: UI Fix (15 min)
1. Update three-dot button alignment
2. Test responsiveness

### Phase 5: Testing (30 min)
1. Create test CSV with:
   - Hint codes
   - Low RSSI values
   - Consumption spikes
   - Zero consumption
   - Old dates
2. Verify all notification types appear
3. Test edge cases

---

## 🎯 Success Criteria

### GROUP 2:
- [ ] Hint Code 5 → Leakage notification
- [ ] Hint Code 12 → Smoke detector notification
- [ ] RSSI < -90 → Low signal warning
- [ ] Status byte changes detected

### GROUP 3:
- [ ] 30%+ increase → Verbrauchsanstieg
- [ ] 30%+ decrease → Verbrauchsrückgang
- [ ] 3 months zero → Blockade warning
- [ ] 7+ days no data → "Keine Daten" alert

### UI:
- [ ] Three-dot button vertically centered
- [ ] Works on mobile/desktop

---

## 📁 Files to Create/Modify

### New Files:
1. `src/utils/hintCodeInterpreter.ts`
2. `src/utils/rssiChecker.ts`
3. `src/utils/consumptionAnalyzer.ts`
4. `TEST_GROUP2_DATA.csv`
5. `TEST_GROUP3_DATA.csv`

### Modified Files:
1. `src/api/index.ts` (type definitions)
2. `src/components/Basic/Charts/NotificationsChart.tsx` (integration)
3. `src/utils/errorFlagInterpreter.ts` (minor exports)

---

## 🚀 Let's Start!









