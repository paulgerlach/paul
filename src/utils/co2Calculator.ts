import { MeterReadingType } from '@/api'

// CO₂ emission factors per kWh (kg CO₂/kWh)
// Source: German Environment Agency, 2023
export const CO2_EMISSION_FACTORS = {
  DISTRICT_HEATING: 0.2, // kg CO₂/kWh
  HEATING_OIL: 0.266,    // kg CO₂/kWh
  NATURAL_GAS: 0.202,    // kg CO₂/kWh
  ELECTRICITY_DE: 0.4,   // kg CO₂/kWh
  DEFAULT_HEATING: 0.2,  // Default to district heating
} as const

// Energy conversion factors
export const ENERGY_CONVERSION = {
  HOT_WATER_PER_M3: 55, // kWh per m³ of hot water
} as const

export interface CO2CalculationResult {
  totalCO2Saved: number // in kg
  totalCO2SavedTons: number // in tons
  breakdown: {
    heating: {
      energySaved: number // kWh
      co2Saved: number // kg
    }
    hotWater: {
      volumeSaved: number // m³
      energyEquivalent: number // kWh
      co2Saved: number // kg
    }
    coldWater: {
      volumeSaved: number // m³
      co2Saved: number // kg (minimal, mainly treatment)
    }
  }
  details: {
    deviceCount: {
      heating: number
      hotWater: number
      coldWater: number
    }
    averageSavings: {
      heatingPerDevice: number // kWh
      hotWaterPerDevice: number // m³
      coldWaterPerDevice: number // m³
    }
  }
}

/**
 * Calculate CO₂ savings based on meter readings
 * This is a simplified calculation that estimates savings based on:
 * 1. Energy consumption patterns from heat meters
 * 2. Water consumption patterns from water meters
 * 3. Assumed baseline consumption vs. current consumption
 */
export function calculateCO2Savings(
  selectedData: MeterReadingType[],
  baselineMultiplier: number = 1.2 // Assume 20% higher consumption before smart meters
): CO2CalculationResult {
  if (!selectedData || selectedData.length === 0) {
    return {
      totalCO2Saved: 0,
      totalCO2SavedTons: 0,
      breakdown: {
        heating: { energySaved: 0, co2Saved: 0 },
        hotWater: { volumeSaved: 0, energyEquivalent: 0, co2Saved: 0 },
        coldWater: { volumeSaved: 0, co2Saved: 0 },
      },
      details: {
        deviceCount: { heating: 0, hotWater: 0, coldWater: 0 },
        averageSavings: { heatingPerDevice: 0, hotWaterPerDevice: 0, coldWaterPerDevice: 0 },
      },
    }
  }

  // Separate devices by type - support both OLD and NEW Engelmann formats
  const heatDevices = selectedData.filter(item => 
    item['Device Type'] === 'Heat' || 
    item['Device Type'] === 'WMZ Rücklauf' ||
    item['Device Type'] === 'Heizkostenverteiler'
  )
  const hotWaterDevices = selectedData.filter(item => 
    item['Device Type'] === 'WWater' || 
    item['Device Type'] === 'Warmwasserzähler'
  )
  const coldWaterDevices = selectedData.filter(item => 
    item['Device Type'] === 'Water' || 
    item['Device Type'] === 'Kaltwasserzähler'
  )

  // Calculate heating energy savings
  const heatingEnergySaved = calculateHeatingEnergySavings(heatDevices, baselineMultiplier)
  const heatingCO2Saved = heatingEnergySaved * CO2_EMISSION_FACTORS.DEFAULT_HEATING

  // Calculate hot water savings
  const hotWaterVolumeSaved = calculateWaterVolumeSavings(hotWaterDevices, baselineMultiplier)
  const hotWaterEnergyEquivalent = hotWaterVolumeSaved * ENERGY_CONVERSION.HOT_WATER_PER_M3
  const hotWaterCO2Saved = hotWaterEnergyEquivalent * CO2_EMISSION_FACTORS.DEFAULT_HEATING

  // Calculate cold water savings (minimal CO₂ impact, mainly treatment)
  const coldWaterVolumeSaved = calculateWaterVolumeSavings(coldWaterDevices, baselineMultiplier)
  const coldWaterCO2Saved = coldWaterVolumeSaved * 0.1 // Minimal CO₂ factor for water treatment

  const totalCO2Saved = heatingCO2Saved + hotWaterCO2Saved + coldWaterCO2Saved
  const totalCO2SavedTons = totalCO2Saved / 1000

  // Ensure we don't return NaN values
  const safeTotalCO2Saved = isNaN(totalCO2Saved) ? 0 : totalCO2Saved
  const safeTotalCO2SavedTons = isNaN(totalCO2SavedTons) ? 0 : totalCO2SavedTons

  // Count UNIQUE devices by device ID (not total data rows)
  // selectedData may contain multiple readings per device (one per date)
  const uniqueHeatIds = new Set(
    heatDevices
      .map(d => d.ID?.toString() || d["Number Meter"]?.toString())
      .filter(Boolean)
  )
  const uniqueHotWaterIds = new Set(
    hotWaterDevices
      .map(d => d.ID?.toString() || d["Number Meter"]?.toString())
      .filter(Boolean)
  )
  const uniqueColdWaterIds = new Set(
    coldWaterDevices
      .map(d => d.ID?.toString() || d["Number Meter"]?.toString())
      .filter(Boolean)
  )

  return {
    totalCO2Saved: safeTotalCO2Saved,
    totalCO2SavedTons: safeTotalCO2SavedTons,
    breakdown: {
      heating: {
        energySaved: isNaN(heatingEnergySaved) ? 0 : heatingEnergySaved,
        co2Saved: isNaN(heatingCO2Saved) ? 0 : heatingCO2Saved,
      },
      hotWater: {
        volumeSaved: isNaN(hotWaterVolumeSaved) ? 0 : hotWaterVolumeSaved,
        energyEquivalent: isNaN(hotWaterEnergyEquivalent) ? 0 : hotWaterEnergyEquivalent,
        co2Saved: isNaN(hotWaterCO2Saved) ? 0 : hotWaterCO2Saved,
      },
      coldWater: {
        volumeSaved: isNaN(coldWaterVolumeSaved) ? 0 : coldWaterVolumeSaved,
        co2Saved: isNaN(coldWaterCO2Saved) ? 0 : coldWaterCO2Saved,
      },
    },
    details: {
      deviceCount: {
        heating: uniqueHeatIds.size,
        hotWater: uniqueHotWaterIds.size,
        coldWater: uniqueColdWaterIds.size,
      },
      averageSavings: {
        heatingPerDevice: uniqueHeatIds.size > 0 && !isNaN(heatingEnergySaved) ? heatingEnergySaved / uniqueHeatIds.size : 0,
        hotWaterPerDevice: uniqueHotWaterIds.size > 0 && !isNaN(hotWaterVolumeSaved) ? hotWaterVolumeSaved / uniqueHotWaterIds.size : 0,
        coldWaterPerDevice: uniqueColdWaterIds.size > 0 && !isNaN(coldWaterVolumeSaved) ? coldWaterVolumeSaved / uniqueColdWaterIds.size : 0,
      },
    },
  }
}

/**
 * Calculate energy savings from heat meters
 * Uses the latest energy reading and estimates baseline consumption
 */
function calculateHeatingEnergySavings(heatDevices: MeterReadingType[], baselineMultiplier: number): number {
  if (heatDevices.length === 0) return 0

  let totalCurrentEnergy = 0
  let totalBaselineEnergy = 0

  heatDevices.forEach(device => {
    // Get the latest energy reading - support both OLD format (IV,0,0,0,Wh,E) and NEW Engelmann format (Actual Energy / HCA)
    let energyReading: string | number | undefined = device['IV,0,0,0,Wh,E'] as number | undefined
    
    // If OLD format doesn't exist, try NEW Engelmann format
    if (energyReading === undefined || energyReading === null) {
      energyReading = device['Actual Energy / HCA'] as string | number | undefined
    }
    
    let currentEnergy = 0
    if (typeof energyReading === 'number') {
      currentEnergy = energyReading
      // Convert MWh to Wh if value is very small (likely MWh from Engelmann format)
      if (currentEnergy < 1 && currentEnergy > 0) {
        currentEnergy = currentEnergy * 1000000 // Convert MWh to Wh
      }
    } else if (typeof energyReading === 'string') {
      const parsed = parseFloat(energyReading.replace(',', '.'))
      if (!isNaN(parsed)) {
        currentEnergy = parsed
        // Convert MWh to Wh if value is very small
        if (currentEnergy < 1 && currentEnergy > 0) {
          currentEnergy = currentEnergy * 1000000
        }
      }
    }
    
    const baselineEnergy = currentEnergy * baselineMultiplier

    // Only add if values are valid numbers
    if (!isNaN(currentEnergy) && !isNaN(baselineEnergy)) {
      totalCurrentEnergy += currentEnergy
      totalBaselineEnergy += baselineEnergy
    }
  })

  // Convert from Wh to kWh
  const energySavedWh = totalBaselineEnergy - totalCurrentEnergy
  const result = energySavedWh / 1000 // Convert to kWh

  // Return 0 if result is NaN or negative
  return isNaN(result) || result < 0 ? 0 : result
}

/**
 * Calculate water volume savings from water meters
 * Uses the latest volume reading and estimates baseline consumption
 */
function calculateWaterVolumeSavings(waterDevices: MeterReadingType[], baselineMultiplier: number): number {
  if (waterDevices.length === 0) return 0

  let totalCurrentVolume = 0
  let totalBaselineVolume = 0

  waterDevices.forEach(device => {
    // Get the latest volume reading - support both OLD format (IV,0,0,0,m^3,Vol) and NEW Engelmann format (Actual Volume)
    let volumeReading: string | number | undefined = device['IV,0,0,0,m^3,Vol'] as number | undefined
    
    // If OLD format doesn't exist, try NEW Engelmann format
    if (volumeReading === undefined || volumeReading === null) {
      volumeReading = device['Actual Volume'] as string | number | undefined
    }
    
    let currentVolume = 0
    if (typeof volumeReading === 'number') {
      currentVolume = volumeReading
    } else if (typeof volumeReading === 'string') {
      const parsed = parseFloat(volumeReading.replace(',', '.'))
      if (!isNaN(parsed)) {
        currentVolume = parsed
      }
    }
    
    const baselineVolume = currentVolume * baselineMultiplier

    // Only add if values are valid numbers
    if (!isNaN(currentVolume) && !isNaN(baselineVolume)) {
      totalCurrentVolume += currentVolume
      totalBaselineVolume += baselineVolume
    }
  })

  const result = totalBaselineVolume - totalCurrentVolume

  // Return 0 if result is NaN or negative
  return isNaN(result) || result < 0 ? 0 : result
}

/**
 * Format CO₂ savings for display
 */
export function formatCO2Savings(co2Tons: number): string {
  // Handle NaN or invalid values
  if (isNaN(co2Tons) || co2Tons < 0) {
    return "0t CO₂"
  }

  if (co2Tons < 0.1) {
    return `${(co2Tons * 1000).toFixed(0)} kg CO₂`
  }
  return `${co2Tons.toFixed(1)}t CO₂`
}

/**
 * Get additional context for CO₂ savings (equivalent comparisons)
 */
export function getCO2Context(co2Tons: number): {
  treesEquivalent: number
  carKmEquivalent: number
  description: string
} {
  // Handle NaN or invalid values
  if (isNaN(co2Tons) || co2Tons < 0) {
    return {
      treesEquivalent: 0,
      carKmEquivalent: 0,
      description: 'Kleine Schritte führen zu großen Veränderungen.'
    }
  }

  // Approximate equivalents
  const treesEquivalent = Math.round(co2Tons * 20) // 1 ton CO₂ ≈ 20 trees
  const carKmEquivalent = Math.round(co2Tons * 5000) // 1 ton CO₂ ≈ 5000 km car travel

  let description = ''
  if (co2Tons > 10) {
    description = `Das entspricht etwa ${treesEquivalent} Bäumen oder ${carKmEquivalent.toLocaleString()} km Autofahrt.`
  } else if (co2Tons > 1) {
    description = `Das entspricht etwa ${treesEquivalent} Bäumen.`
  } else {
    description = 'Kleine Schritte führen zu großen Veränderungen.'
  }

  return {
    treesEquivalent,
    carKmEquivalent,
    description,
  }
}
