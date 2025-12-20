import type { InferSelectModel } from "drizzle-orm";
import type { objekte, locals, contracts, contractors } from "@/db/drizzle/schema";

// Type Definitions

export type InternalProperty = InferSelectModel<typeof objekte>;
export type InternalUnit = Omit<InferSelectModel<typeof locals>, 'floor'> & {
    objekt_id: string;
    floor: string; // Ensure floor is always string, not string | null
};
export type InternalContract = InferSelectModel<typeof contracts>;
export type InternalContractor = InferSelectModel<typeof contractors>;

/**
 * BVED Reference Structure (used in multiple APIs)
 */
export interface BVEDReference {
    mscnumber: string; // 9-digit alphanumeric for billing units, alphanumeric for residential units
    pmnumber?: string; // Optional: Partner Management number
}

/**
 * BVED Address Structure
 */
export interface BVEDAddress {
    street?: string;
    zip?: string;
    city?: string;
    country?: string;
}

/**
 * BVED Property Structure (for consumption-data API)
 */
export interface BVEDProperty {
    reference: BVEDReference;
    address?: BVEDAddress;
    type?: string;
}

/**
 * BVED Residential Unit Structure (for consumption-data API)
 */
export interface BVEDResidentialUnit {
    reference: BVEDReference;
    floor?: string;
    living_space?: number;
    rooms?: number;
}

/**
 * BVED Partner Structure (for on-site-roles API)
 */
export interface BVEDPartner {
    reference: {
        pmnumber: string;
    };
    name: string; // last_name
    firstname?: string; // first_name
    additionalname?: string;
    commercial: "COMMERCIAL" | "NON_COMMERCIAL";
    email?: string;
    phonenumbers?: Array<{
        number: string;
        type: "MOBILE" | "BUSINESS" | "PRIVATE";
    }>;
}

/**
 * BVED Role Structure (for on-site-roles API)
 */
export interface BVEDRole {
    change?: "INSERT" | "UPDATE" | "DELETE";
    role: string; // e.g., "S-COR", "S-BIR", "R-TEN"
    from: string; // ISO 8601 date: "YYYY-MM-DD"
    to?: string; // ISO 8601 date: "YYYY-MM-DD" (optional)
    partner: {
        pmnumber: string;
    };
}

/**
 * BVED On-Site Roles Structure
 */
export interface BVEDOnSiteRoles {
    timestamp: string; // ISO 8601 datetime
    billingunit: {
        reference: BVEDReference;
        residentialunit: {
            reference: BVEDReference;
            roles?: BVEDRole[];
            partners?: BVEDPartner[];
        };
    };
}


// Mapping Functions

/**
 * Maps UUID to MSC number (9-digit alphanumeric)
 */
export function mapToMSCNumber(uuid: string, type: "billingunit" | "residentialunit" = "billingunit"): string {
    // For now, generate deterministic 9-digit number from UUID hash
    const hash = uuid.replace(/-/g, "").substring(0, 9);
    return hash.padStart(9, "0");
}

/**
 * Maps UUID to PM number (optional)
 */
export function mapToPMNumber(uuid: string): string | undefined {
    // For now, return undefined (optional field)
    return undefined;
}

/**
 * Transforms internal property to BVED property format
 */
export function transformPropertyToBVED(
    property: InternalProperty,
    options: { includeAddress?: boolean } = {}
): BVEDProperty {
    return {
        reference: {
            mscnumber: mapToMSCNumber(property.id, "billingunit"),
            pmnumber: mapToPMNumber(property.id),
        },
        ...(options.includeAddress && {
            address: {
                street: property.street || undefined,
                zip: property.zip || undefined,
            },
        }),
        type: property.objekt_type || undefined,
    };
}

/**
 * Transforms internal unit to BVED residential unit format
 */
export function transformUnitToBVED(unit: InternalUnit): BVEDResidentialUnit {
    return {
        reference: {
            mscnumber: mapToMSCNumber(unit.id, "residentialunit"),
            pmnumber: mapToPMNumber(unit.id),
        },
        floor: unit.floor || undefined,
        living_space: unit.living_space ? Number(unit.living_space) : undefined,
        rooms: unit.rooms ? Number(unit.rooms) : undefined,
    };
}

/**
 * Transforms internal contractor to BVED partner format
 */
export function transformContractorToBVEDPartner(
    contractor: InternalContractor
): BVEDPartner {
    return {
        reference: {
            pmnumber: mapToPMNumber(contractor.id) || contractor.id.substring(0, 20), // Fallback to UUID prefix
        },
        name: contractor.last_name,
        firstname: contractor.first_name || undefined,
        commercial: "NON_COMMERCIAL", // Always NON_COMMERCIAL for residential tenants
        email: contractor.email || undefined,
        phonenumbers: contractor.phone
            ? [
                {
                    number: contractor.phone,
                    type: "MOBILE" as const, // Default to MOBILE, could be enhanced
                },
            ]
            : undefined,
    };
}

/**
 * Transforms internal contract to BVED role format
 */
export function transformContractToBVEDRole(
    contract: InternalContract,
    contractor: InternalContractor,
    change: "INSERT" | "UPDATE" | "DELETE" = "INSERT"
): BVEDRole {
    const pmnumber = mapToPMNumber(contractor.id) || contractor.id.substring(0, 20);

    return {
        change,
        role: "S-COR", // Only S-COR role is supported for EED
        from: contract.rental_start_date, // Already in ISO 8601 format
        to: contract.rental_end_date || undefined,
        partner: {
            pmnumber,
        },
    };
}

/**
 * Transforms complete unit data to BVED on-site-roles format
 */
export function transformToOnSiteRoles(
    property: InternalProperty,
    unit: InternalUnit,
    contracts: Array<InternalContract & { contractors: InternalContractor[] }>,
    timestamp?: string
): BVEDOnSiteRoles {
    const roles: BVEDRole[] = [];
    const partners: BVEDPartner[] = [];
    const partnerMap = new Map<string, BVEDPartner>();

    // Process contracts and contractors
    for (const contract of contracts) {
        for (const contractor of contract.contractors) {
            // Add partner if not already added
            if (!partnerMap.has(contractor.id)) {
                const partner = transformContractorToBVEDPartner(contractor);
                partnerMap.set(contractor.id, partner);
                partners.push(partner);
            }

            // Add role for this contract
            const role = transformContractToBVEDRole(contract, contractor, "INSERT");
            roles.push(role);
        }
    }

    return {
        timestamp: timestamp || new Date().toISOString(),
        billingunit: {
            reference: {
                mscnumber: mapToMSCNumber(property.id, "billingunit"),
                pmnumber: mapToPMNumber(property.id),
            },
            residentialunit: {
                reference: {
                    mscnumber: mapToMSCNumber(unit.id, "residentialunit"),
                    pmnumber: mapToPMNumber(unit.id),
                },
                roles: roles.length > 0 ? roles : undefined,
                partners: partners.length > 0 ? partners : undefined,
            },
        },
    };
}

/**
 * Transforms units list to BVED consumption-data format
 */
export function transformUnitsToConsumptionData(
    properties: Array<InternalProperty & { units: InternalUnit[] }>
): Array<{
    billingunit: BVEDProperty & {
        residentialunits: BVEDResidentialUnit[];
    };
}> {
    return properties.map((property) => ({
        billingunit: {
            ...transformPropertyToBVED(property, { includeAddress: true }),
            residentialunits: property.units.map(transformUnitToBVED),
        },
    }));
}

// ============================================================================
// Reverse Transformations (for incoming BVED data)
// ============================================================================

/**
 * Maps MSC number back to UUID (if mapping table exists)
 */
export function mapFromMSCNumber(mscnumber: string): string | null {
    return null;
}

/**
 * Maps PM number back to UUID (if mapping table exists)
 */
export function mapFromPMNumber(pmnumber: string): string | null {
    // TODO: Replace with actual database lookup from mapping table
    return null;
}


