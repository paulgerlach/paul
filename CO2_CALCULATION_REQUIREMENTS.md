# CO2 Calculation Requirements & Findings

**Prepared for:** Product Manager
**Reference PDF:** Group 26089222.pdf (Heizkostenabrechnung sample, page 5 — "CO₂-Kostenaufteilung")
**Date:** 2026-03-05

---

## 1. Background

The **CO2-Kostenaufteilungsgesetz (CO2KostAufG)** requires landlords to share the CO2 levy
embedded in energy bills with tenants. The share depends on how carbon-efficient the building
is: less efficient buildings shift more cost to the landlord. The law applies to all
residential and commercial tenancies with central heating.

---

## 2. Full Calculation Logic (from PDF)

### Step 1 — CO2 quantity from energy consumption

```
CO2 (kg) = Energy (kWh) × Emission factor (kg CO₂/kWh)
```

Emission factors by energy carrier:

| Energy carrier | Factor (kg CO₂/kWh) |
|---|---|
| Nah-/Fernwärme (district heating) | 0.2101 |
| Gas (Erdgas) | 0.202 |
| Öl (heating oil) | 0.266 |

**Reference building example:**
> 761,123 kWh × 0.2101 = **159,911.9 kg CO₂**

---

### Step 2 — Emission intensity per m²

```
Emission intensity (kg CO₂/m²/a) = Total CO₂ (kg) / Total living space (m²)
```

**Reference building example:**
> 159,911.9 / 11,196.4 m² = **14.3 kg CO₂/m²/a**

---

### Step 3 — Tier selection (CO2KostAufG §4)

Match the emission intensity to the statutory tier table to determine the tenant/landlord split:

| Emission intensity (kg CO₂/m²/a) | Tenant share | Landlord share |
|---|---|---|
| < 12 | 100% | 0% |
| 12 bis < 17 | 90% | 10% |
| 17 bis < 22 | 80% | 20% |
| 22 bis < 27 | 70% | 30% |
| 27 bis < 32 | 60% | 40% |
| 32 bis < 37 | 50% | 50% |
| 37 bis < 42 | 40% | 60% |
| 42 bis < 47 | 30% | 70% |
| 47 bis < 52 | 20% | 80% |
| ≥ 52 | 5% | 95% |

**Reference building example:**
> 14.3 kg CO₂/m²/a → tier **"12 bis < 17"** → **Tenant: 90%, Landlord: 10%**

---

### Step 4 — CO2 costs in EUR ⚠️ MISSING INPUT

```
CO2 cost (€) = CO₂ (t) × CO₂ price (€/t)
             = (CO₂ kg / 1000) × CO₂ price per tonne
```

**Reference building example (from PDF):**
> Total CO₂: 159,911.9 kg = 159.9 t
> CO₂ cost: **14,318.13 €**
> Implied CO₂ price: 14,318.13 / 159.9 ≈ **89.54 €/t**

The PDF also shows a worked reference calculation for one invoice entry:
> CO₂ quantity: 116,404.8 kg = 116.4 t
> CO₂ cost: 5,964.04 €
> Effective price: 5,964.04 / 116.4 = **51.24 €/t**

> ⚠️ **Open question:** See Section 4 below.

---

### Step 5 — Building-level cost split

```
Building tenant cost  = Total CO₂ cost (€) × tenant tier %
Building landlord cost = Total CO₂ cost (€) × landlord tier %
```

**Reference building example:**
> 14,318.13 × 90% = **12,886.32 € (tenant)**
> 14,318.13 × 10% =  **1,431.81 € (landlord)**

---

### Step 6 — Unit-level allocation

```
Space share        = unit living space (m²) / total building living space (m²)
Unit tenant cost   = building tenant cost × space share
Unit landlord cost = building landlord cost × space share
```

**Reference building example (for one apartment):**
> Space share ≈ unit m² / 11,196.4
> Unit tenant cost:  **126.60 €**
> Unit landlord cost: **14.08 €**
> Unit total:        **140.68 €**

---

## 3. What the Code Already Implements Correctly ✅

| Component | Status | Code location |
|---|---|---|
| Emission factors (Fernwärme 0.2101, Gas 0.202, Öl 0.266) | ✅ Correct | `constants.ts:130–138` |
| CO₂ kg = kWh × emission factor | ✅ Correct | `co2.ts:38–39` |
| Emission intensity per m² | ✅ Correct | `co2.ts:53–56` |
| CO2KostAufG tier table (all 10 tiers) | ✅ Correct | `constants.ts:116–127` |
| Tier selection logic (≥ min && < max) | ✅ Correct | `co2.ts:58–60` |
| Unit cost formula structure (building cost × tier% × space share) | ✅ Correct | `co2.ts:83–89` |
| kWh parsed from invoice notes field | ✅ Working | `costs.ts:77–88` |

---

## 4. What Is Not Yet Implemented ❌

### 4.1 CO₂ costs in EUR — CRITICAL (all monetary values are hardcoded 0)

In `co2.ts`, every monetary value is hardcoded to zero:

```typescript
// co2.ts lines 40, 79–81
const totalCost = 0;
const buildingTenantCost = 0;
const buildingLandlordCost = 0;
const buildingTotalCost = 0;
```

This means the following fields always render as **"0,00 €"** in the PDF:

- CO₂-Kosten in EUR (per invoice row)
- Building tenant cost / landlord cost / total
- **Unit tenant cost / landlord cost / total** ← the numbers that actually matter to the tenant

**Root cause:** The calculation requires a CO₂ price per tonne (€/t), which is currently not
provided anywhere in the data pipeline. The invoice `notes` field contains only kWh. The
invoice `total_amount` is the full energy cost (e.g. 124,242.47 €), not the CO₂ component.

---

### 4.2 Classification table range label units — MINOR

The tier table in the PDF shows units on every row (e.g. `12 bis < 17 kg CO₂/m²/a`).
The code omits units on all rows except the first:

| Row | Code generates | Should be |
|---|---|---|
| First (< 12) | `< 12 kg/m²/a` | `< 12 kg CO₂/m²/a` |
| Middle rows | `12 bis < 17` | `12 bis < 17 kg CO₂/m²/a` |
| Last (≥ 52) | `≥ 52` | `≥ 52 kg CO₂/m²/a` |

Code location: `co2.ts:63–68`

---

### 4.3 Mock model has wrong tier highlighted — MINOR

The test mock model (`mock-model.ts:359–369`) hardcodes:
- Highlighted tier: `"17 bis < 22"` (wrong)
- `selectedTierTenantPercent: 80` (wrong)

For its emission intensity of 14.28 kg CO₂/m²/a, the correct tier is `"12 bis < 17"` with
tenant 90% / landlord 10%.

---

## 5. Open Questions for Product Manager

### Q1 — Where does the CO₂ price per tonne (€/t) come from? ← BLOCKER

This is the single missing piece needed to implement CO₂ cost calculations. Options:

| Option | Description | Pros | Cons |
|---|---|---|---|
| **A — German BEHG statutory schedule** | Fixed price per year: 2021: 25 €/t, 2022–2023: 30 €/t, 2024: 45 €/t, 2025: 55 €/t | No data entry needed; always correct for ETS-regulated fuels | Fernwärme suppliers set their own CO₂ price; statutory rate may not match the actual invoice |
| **B — Stored on the invoice (notes or purpose field)** | User enters the CO₂ price per tonne (or CO₂ cost in EUR) when creating the fuel invoice | Reflects the actual utility bill; handles custom rates | Requires a new input field in the UI or a parsing convention for the notes field |
| **C — Stored on the heating document** | A new field `co2_price_per_tonne` on the heating bill document, set once per billing period | Simple; one value per building/year | All invoices in the same billing period share the same rate |
| **D — New separate invoice type "co2_costs"** | Add a new cost_type for CO₂ invoices so users can enter the CO₂ levy as a separate line item | Most transparent; matches how some utilities bill | Requires UI change and user education |

**The PDF's worked example implies Option B or C** — the right-side annotation shows
CO₂ cost data tied to a specific invoice entry (`116,404.8 kg → 5,964.04 €`), suggesting
the data comes per-invoice, not from a building-level config.

---

### Q2 — Should the CO₂ price apply to all kWh or only the fossil fuel fraction?

For Fernwärme (district heating), some energy may come from renewable sources. The PDF
shows a total kWh of 761,123 but the right-side example references only 116,404.8 kg CO₂
(equivalent to ~554,571 kWh). This raises the question: does the CO₂ levy apply to the
full kWh consumption, or only to the fossil fuel portion? If partial, how is the fossil
fraction specified?

---

### Q3 — How should multi-invoice billing periods be handled?

If a building has multiple fuel invoices in one billing period (e.g. quarterly billing),
should each invoice carry its own CO₂ price per tonne, or should a single rate apply
to the total?

---

## 6. Summary: What Needs to Be Decided

| # | Decision needed | Impact |
|---|---|---|
| 1 | How/where the CO₂ price (€/t) is stored or derived | Blocks all monetary CO₂ calculations |
| 2 | Whether CO₂ price applies to total kWh or fossil fraction only | Affects CO₂ kg for cost calculation |
| 3 | Single rate per billing period vs. per-invoice rate | Affects data model |

Once these are decided, the code changes are straightforward and confined to 3–4 files:
`costs.ts`, `co2.ts`, `compute.ts`, and `mock-model.ts`.
