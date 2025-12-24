# Notifications System - Atomic Surgical Workflow
*Created: November 26, 2025*

## 🔍 **CURRENT STATE ANALYSIS**

### ✅ **What EXISTS:**
1. ✅ `NotificationsChart.tsx` component (654 lines)
2. ✅ `errorFlagInterpreter.ts` utility (error flag parsing logic)
3. ✅ `NotificationItem.tsx` component (individual notification display)
4. ✅ Error detection logic (reads `ErrorFlags(binary)` from CSV)
5. ✅ Dummy data for testing

### ❌ **What's BROKEN:**
1. ❌ Component may be using dummy data instead of real data
2. ❌ Not properly connected to dashboard data flow
3. ❌ Error detection may not be working for all device types
4. ❌ Not showing on user dashboard

---

## 🎯 **ATOMIC TASK BREAKDOWN**

### **PHASE 1: DIAGNOSIS** (30 mins)
*Goal: Understand exactly what's broken*

#### Task 1.1: Verify Current Behavior
- [ ] **1.1.1** Navigate to dashboard → Check if notifications panel shows
- [ ] **1.1.2** Check browser console for errors
- [ ] **1.1.3** Check if component receives `parsedData` prop
- [ ] **1.1.4** Verify if error flags exist in database

**SQL Test Query:**
```sql
-- Check if any devices have error flags
SELECT 
    device_type,
    device_id,
    parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' as error_flag,
    COUNT(*) as count
FROM parsed_data
WHERE parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' IS NOT NULL
    AND parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' != '0b'
    AND parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' != ''
GROUP BY device_type, device_id, error_flag
ORDER BY device_type;
```

**Expected Output:** 
- If count = 0 → No errors in data (notifications work, just no alerts)
- If count > 0 → Errors exist, check if displaying

---

### **PHASE 2: DATA FLOW VERIFICATION** (45 mins)
*Goal: Ensure NotificationsChart receives correct data*

#### Task 2.1: Check Dashboard Integration
- [ ] **2.1.1** Open `src/app/(customer)/dashboard/page.tsx`
- [ ] **2.1.2** Verify `NotificationsChart` is imported
- [ ] **2.1.3** Check if `parsedData` prop is passed
- [ ] **2.1.4** Verify `useNotificationsChartData()` hook is called

**Files to Check:**
```
src/app/(customer)/dashboard/page.tsx
src/hooks/useChartData.ts (useNotificationsChartData hook)
```

#### Task 2.2: Verify Hook Implementation
- [ ] **2.2.1** Read `useNotificationsChartData()` in `useChartData.ts`
- [ ] **2.2.2** Check if it fetches ALL device types correctly
- [ ] **2.2.3** Verify date filtering doesn't exclude error data
- [ ] **2.2.4** Add console logs to track data flow

**Key Check:**
```typescript
// In useNotificationsChartData hook - verify these device types are included
const deviceTypes = [
  'Heat', 'Water', 'WWater', 'Elec',  // OLD format
  'Stromzähler', 'Kaltwasserzähler', 'Warmwasserzähler', 
  'WMZ Rücklauf', 'Heizkostenverteiler'  // NEW format
];
```

---

### **PHASE 3: ERROR FLAG INTERPRETATION** (60 mins)
*Goal: Ensure error flags are correctly parsed and interpreted*

#### Task 3.1: Test Error Flag Parser
- [ ] **3.1.1** Create test script for `errorFlagInterpreter.ts`
- [ ] **3.1.2** Test with sample error flags: `"0b"`, `"1b"`, `"10b"`, `"100b"`
- [ ] **3.1.3** Verify severity classification works
- [ ] **3.1.4** Test manufacturer-specific mappings (EFE, DWZ)

**Test Script:**
```typescript
// test-error-interpreter.ts
import { interpretErrorFlag } from '@/utils/errorFlagInterpreter';

const testCases = [
  { flag: "0b", expected: "No errors" },
  { flag: "1b", expected: "Battery low" },
  { flag: "10b", expected: "Communication error" },
  { flag: "100b", expected: "Temperature sensor error" },
];

testCases.forEach(test => {
  const result = interpretErrorFlag({
    deviceId: "TEST123",
    deviceType: "Heat",
    manufacturer: "EFE",
    errorFlag: test.flag
  });
  console.log(`Flag: ${test.flag} → ${result.errors.join(', ')}`);
});
```

#### Task 3.2: Add Logging to NotificationsChart
- [ ] **3.2.1** Add `console.log` at line 230 to log filtered devices
- [ ] **3.2.2** Log error flag values being processed
- [ ] **3.2.3** Log final notifications array before render

**Code Addition:**
```typescript
// In NotificationsChart.tsx at line 230
console.log('[Notifications] Selected meters with errors:', {
  totalDataPoints: parsedData.data.length,
  selectedMetersCount: selectedMetersWithErrors.length,
  sampleError: selectedMetersWithErrors[0] || 'No errors found'
});
```

---

### **PHASE 4: UI/UX VERIFICATION** (30 mins)
*Goal: Ensure notifications display correctly*

#### Task 4.1: Test Empty States
- [ ] **4.1.1** Test with no data → Should show "No data uploaded"
- [ ] **4.1.2** Test with no meters selected → Should show "Please select apartments"
- [ ] **4.1.3** Test with data but no errors → Should show "All meters functioning correctly"
- [ ] **4.1.4** Test with errors → Should show error notifications

#### Task 4.2: Verify Icons & Styling
- [ ] **4.2.1** Check if icons load correctly (heater, hot_water, cold_water)
- [ ] **4.2.2** Verify severity colors (green=ok, red=critical, orange=warning)
- [ ] **4.2.3** Test notification click → Opens error details modal
- [ ] **4.2.4** Verify mobile responsiveness

---

### **PHASE 5: DATABASE SCHEMA VERIFICATION** (45 mins)
*Goal: Ensure error flags are stored correctly*

#### Task 5.1: Check Parsed Data Structure
- [ ] **5.1.1** Run SQL query to check error flag field exists
- [ ] **5.1.2** Verify field name matches component expectation
- [ ] **5.1.3** Check if all device types have error flag field
- [ ] **5.1.4** Verify error flags are preserved during CSV import

**SQL Verification:**
```sql
-- Check error flag field structure
SELECT 
    device_type,
    jsonb_object_keys(parsed_data) as field_name
FROM parsed_data
WHERE device_type IN ('Heat', 'Water', 'WWater', 'Elec')
LIMIT 10;

-- Should include: "IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"
```

#### Task 5.2: CSV Parser Verification
- [ ] **5.2.1** Check `csv-parser/index.ts` preserves error flags
- [ ] **5.2.2** Verify no field name transformation breaks error flags
- [ ] **5.2.3** Test with actual CSV containing error flags
- [ ] **5.2.4** Confirm error flags survive deduplication logic

---

### **PHASE 6: INTEGRATION FIX** (60 mins)
*Goal: Surgically fix any broken connections*

#### Task 6.1: Fix Data Prop Passing
**IF** NotificationsChart isn't receiving data:

```typescript
// Fix in dashboard/page.tsx
const { data: notificationsData } = useNotificationsChartData();

<NotificationsChart 
  parsedData={{ data: notificationsData, errors: [] }}
  isEmpty={notificationsData.length === 0}
/>
```

#### Task 6.2: Fix Hook if Broken
**IF** useNotificationsChartData has issues:

```typescript
// In useChartData.ts
export const useNotificationsChartData = (): ChartDataHookResult => {
  const { meterIds, startDate, endDate } = useChartStore();
  // ... existing code ...
  
  // CRITICAL: Ensure ALL device types are fetched
  const deviceTypes = [
    'Heat', 'Water', 'WWater', 'Elec',
    'Stromzähler', 'Kaltwasserzähler', 'Warmwasserzähler', 
    'WMZ Rücklauf', 'Heizkostenverteiler', 'Wärmemengenzähler'
  ];
  
  const chartData = await fetchChartData(meterIds, deviceTypes, startDate, endDate);
};
```

#### Task 6.3: Add Error Flag to RPC Function
**IF** database function filters out error flags:

```sql
-- Verify get_dashboard_data returns error flags
-- May need to explicitly select parsed_data column
```

---

### **PHASE 7: TESTING & VALIDATION** (45 mins)
*Goal: Confirm everything works end-to-end*

#### Task 7.1: Create Test Error Data
- [ ] **7.1.1** Manually create CSV with error flag `"1b"` (battery low)
- [ ] **7.1.2** Upload via admin panel
- [ ] **7.1.3** Verify data appears in `parsed_data` table
- [ ] **7.1.4** Check notification appears on dashboard

#### Task 7.2: Test All Error Types
- [ ] **7.2.1** Test critical error (multiple bits set)
- [ ] **7.2.2** Test medium severity error
- [ ] **7.2.3** Test low severity error
- [ ] **7.2.4** Test multiple devices with errors

#### Task 7.3: Test User Flows
- [ ] **7.3.1** Login as test user → See notifications
- [ ] **7.3.2** Select different apartments → Notifications update
- [ ] **7.3.3** Change date range → Notifications filter correctly
- [ ] **7.3.4** Click notification → Modal shows error details

---

## 📊 **DECISION TREE**

```
START
  ↓
Is NotificationsChart visible on dashboard?
  ├─ NO → Check dashboard integration (Task 2.1)
  └─ YES → Does it show "No data uploaded"?
      ├─ YES → Check data fetching (Task 2.2)
      └─ NO → Does it show "All meters functioning correctly"?
          ├─ YES → Check if error flags exist in DB (Task 5.1)
          │        ├─ NO → Notifications working! (No errors to show)
          │        └─ YES → Check error flag parsing (Task 3.1)
          └─ NO → Are actual error notifications displaying?
              ├─ YES → ✅ SYSTEM WORKING! Test edge cases (Phase 7)
              └─ NO → Check console logs (Task 1.1.2)
```

---

## 🚨 **CRITICAL CHECKPOINTS**

### Checkpoint 1: After Phase 2
**Question:** Does NotificationsChart receive any data?
- ✅ YES → Continue to Phase 3
- ❌ NO → Fix hook integration (Task 6.2)

### Checkpoint 2: After Phase 3
**Question:** Can error flags be parsed from sample data?
- ✅ YES → Continue to Phase 4
- ❌ NO → Fix error interpreter (add manufacturer mappings)

### Checkpoint 3: After Phase 5
**Question:** Do error flags exist in database?
- ✅ YES → Continue to Phase 6
- ❌ NO → Either no errors OR CSV parser issue (check Task 5.2)

### Checkpoint 4: After Phase 6
**Question:** Do notifications display with test error data?
- ✅ YES → Proceed to Phase 7 (final testing)
- ❌ NO → Debug render logic in NotificationsChart.tsx

---

## 🔧 **QUICK FIX COMMANDS**

### Run Error Flag Check:
```sql
SELECT * FROM parsed_data 
WHERE parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' != '0b'
LIMIT 5;
```

### Test Notification Component:
```bash
# Add to browser console
console.log(document.querySelector('[data-component="notifications"]'))
```

### Force Refresh Data:
```typescript
// In dashboard, add:
const { refetch } = useNotificationsChartData();
// Call refetch() after data upload
```

---

## 📝 **COMPLETION CHECKLIST**

- [ ] Notifications panel visible on dashboard
- [ ] Shows "No errors" when all meters healthy
- [ ] Shows error notifications when devices have issues
- [ ] Error severity correctly color-coded
- [ ] Icons display correctly for each device type
- [ ] Modal opens with error details on click
- [ ] Updates when meter selection changes
- [ ] Updates when date range changes
- [ ] Works on mobile devices
- [ ] No console errors
- [ ] Tested with real error data
- [ ] Tested with multiple error types
- [ ] Documented for future maintenance

---

## ⏱️ **ESTIMATED TOTAL TIME: 5-6 hours**

**Priority Order:**
1. Phase 1 (Diagnosis) - START HERE
2. Phase 2 (Data Flow) - Core issue likely here
3. Phase 5 (Database) - Verify data exists
4. Phase 6 (Integration Fix) - Surgical fixes
5. Phase 3 (Error Parsing) - If errors exist but not parsing
6. Phase 4 & 7 (UI/Testing) - Final validation

---

## 🎯 **SUCCESS CRITERIA**

✅ **Minimum Viable Fix:**
- Notifications panel shows on dashboard
- Correctly displays "All meters OK" when no errors
- Shows error notification when error flags present

✅ **Complete Fix:**
- All error types detected and categorized
- Severity levels work correctly
- Error details modal functional
- Mobile responsive
- Real-time updates with meter/date changes










