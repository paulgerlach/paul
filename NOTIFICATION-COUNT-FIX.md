# Notification Device Count Fix

## Issue

The notification showing "480 Geräte ohne Fehler (120 Wärme, 275 Wasser, 65 Strom)" was **inaccurate**.

### Root Cause

The code was counting **total data rows** from CSV uploads, not **unique devices**.

- Since CSV files are uploaded daily, each device has multiple readings
- Example: 1 device with readings on 19 days = 19 data rows
- The notification counted all 19 rows as separate devices ❌

### What Was Happening

From the database:
- **November**: 110 Heat rows + 132 Water rows + 120 WWater rows + 65 Elec rows = 427 rows
- **October**: 16 Heat + 18 Water + 19 WWater = 53 rows  
- **Total**: ~480 data rows being counted as "devices"

But these represent only:
- **10 unique heat devices** (not 120)
- **23 unique water devices** (12 cold + 11 warm, not 275)
- **11 unique electricity devices** (not 65)
- **~44 total unique devices** (not 480)

## Fix Applied

Changed the counting logic to use JavaScript `Set` to track **unique device IDs**:

### Before:
```typescript
const totalDevices = parsedData.data.length; // Counts ALL rows
const heatDevices = parsedData.data.filter(
  (d) => d["Device Type"] === "Heat"
).length; // Counts Heat rows
```

### After:
```typescript
const uniqueDeviceIds = new Set(
  parsedData.data
    .map(d => d.ID?.toString() || d["Number Meter"]?.toString())
    .filter(Boolean)
);
const totalDevices = uniqueDeviceIds.size; // Counts UNIQUE device IDs

const uniqueHeatIds = new Set(
  parsedData.data
    .filter((d) => d["Device Type"] === "Heat")
    .map(d => d.ID?.toString() || d["Number Meter"]?.toString())
    .filter(Boolean)
);
const heatDevices = uniqueHeatIds.size; // Counts UNIQUE heat device IDs
```

## Result

Notification will now show accurate counts:
- ✅ **~44 Geräte ohne Fehler** (down from 480)
- ✅ **~10 Wärme** (down from 120)
- ✅ **~23 Wasser** (down from 275)
- ✅ **~11 Strom** (down from 65)

Numbers will match the actual physical devices installed in the building.

## Files Modified

- `src/components/Basic/Charts/NotificationsChart.tsx`
  - Line 241-261: Fixed dynamic notifications count
  - Line 311-331: Fixed general notifications count

## Testing

To verify the fix:
1. Upload CSV files for multiple days
2. Check the notification panel
3. Device count should remain constant regardless of how many days of data exist
4. Count should match the actual number of physical meters installed

## Additional Query

Created `check-actual-device-counts.sql` to verify device counts directly from the database for cross-reference.

