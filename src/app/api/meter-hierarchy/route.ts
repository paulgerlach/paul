import { NextRequest, NextResponse } from 'next/server';
import database from '@/db';
import { local_meters, locals, objekte, contracts, users } from '@/db/drizzle/schema';
import { eq, inArray, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // 1. Get all objects for this user (the landlord/admin)
        const userObjekte = await database
            .select({ id: objekte.id, street: objekte.street, city: objekte.zip }) // Assuming zip is used for city/zip
            .from(objekte)
            .where(eq(objekte.user_id, userId));

        if (userObjekte.length === 0) return NextResponse.json({});

        const objektIds = userObjekte.map(o => o.id);

        // 2. Get all locals for these objects
        const objektLocals = await database
            .select({
                id: locals.id,
                objekt_id: locals.objekt_id,
                floor: locals.floor,
                location: locals.house_location
            })
            .from(locals)
            .where(inArray(locals.objekt_id, objektIds));

        if (objektLocals.length === 0) return NextResponse.json({});

        const localIds = objektLocals.map(l => l.id);

        // 3. Get all meter mappings
        const meters = await database
            .select({ meter_number: local_meters.meter_number, local_id: local_meters.local_id })
            .from(local_meters)
            .where(inArray(local_meters.local_id, localIds));

        // 4. Get active contracts for these locals to find tenants
        const activeContracts = await database
            .select({
                local_id: contracts.local_id,
                user_id: contracts.user_id,
                firstName: users.first_name,
                lastName: users.last_name
            })
            .from(contracts)
            .leftJoin(users, eq(contracts.user_id, users.id))
            .where(and(inArray(contracts.local_id, localIds), eq(contracts.is_current, true)));

        // 5. Build the mapping
        const hierarchyMap: Record<string, {
            building: string,
            unit: string,
            tenant: string
        }> = {};

        const localToObjekt = objektLocals.reduce((acc, l) => {
            const objekt = userObjekte.find(o => o.id === l.objekt_id);
            acc[l.id] = {
                building: objekt?.street || 'Unbekanntes Gebäude',
                unit: `${l.floor} ${l.location || ''}`.trim()
            };
            return acc;
        }, {} as Record<string, { building: string, unit: string }>);

        const localToTenant = activeContracts.reduce((acc, c) => {
            acc[c.local_id] = `${c.firstName} ${c.lastName}`.trim();
            return acc;
        }, {} as Record<string, string>);

        meters.forEach(m => {
            if (m.meter_number && m.local_id) {
                const info = localToObjekt[m.local_id];
                if (info) {
                    hierarchyMap[m.meter_number] = {
                        building: info.building,
                        unit: info.unit,
                        tenant: localToTenant[m.local_id] || 'Leerstand'
                    };
                }
            }
        });

        return NextResponse.json(hierarchyMap);
    } catch (error) {
        console.error('Error fetching meter hierarchy:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
