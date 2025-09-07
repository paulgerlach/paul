'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import ContentWrapper from '@/components/Admin/ContentWrapper/ContentWrapper';
import { useChartStore } from '@/store/useChartStore';
import { MeterReadingType } from '@/api';
import { parseGermanDate } from '@/utils';
import ChartCardSkeleton from '@/components/Basic/ui/ChartCardSkeleton';

const WaterChart = dynamic(
  () => import('@/components/Basic/Charts/WaterChart'),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const ElectricityChart = dynamic(
  () => import('@/components/Basic/Charts/ElectricityChart'),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const GaugeChart = dynamic(
  () => import('@/components/Basic/Charts/GaugeChart'),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const HeatingCosts = dynamic(
  () => import('@/components/Basic/Charts/HeatingCosts'),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const NotificationsChart = dynamic(
  () => import('@/components/Basic/Charts/NotificationsChart'),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const EinsparungChart = dynamic(
  () => import('@/components/Basic/Charts/EinsparungChart'),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

interface DashboardChartsProps {
  parsedData: {
    data: MeterReadingType[];
    errors?: any[];
  };
}

export default function DashboardCharts({ parsedData }: DashboardChartsProps) {
  const { startDate, endDate } = useChartStore();

  // Use useMemo to recalculate filtered data when dependencies change
  const selectedData = useMemo(() => {
    if (!parsedData?.data) return [];

    let filtered = parsedData.data
      .filter((item) => item['Device Type'] !== 'Device Type')
      .filter((item) => item.ID); // Only items with valid IDs

    console.log(
      'filtered',
      filtered.filter((item) => item['Device Type'] === 'Elec')
    );

    // Filter by date range if both dates are set
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDateString = item['IV,0,0,0,,Date/Time'].split(' ')[0]; // Extract date part
        const itemDate = parseGermanDate(itemDateString);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Skip invalid dates
        if (!itemDate || isNaN(itemDate.getTime())) {
          return false;
        }

        const isInRange = itemDate >= start && itemDate <= end;

        return isInRange;
      });
    }

    return filtered;
  }, [parsedData?.data, startDate, endDate]);

  // Filter by device type using useMemo for performance
  const heatDevices = useMemo(
    () => selectedData?.filter((item) => item['Device Type'] === 'Heat'),
    [selectedData]
  );

  const coldWaterDevices = useMemo(
    () => selectedData?.filter((item) => item['Device Type'] === 'Water'),
    [selectedData]
  );

  const hotWaterDevices = useMemo(
    () => selectedData?.filter((item) => item['Device Type'] === 'WWater'),
    [selectedData]
  );

  // Heuristic detection for electricity meters: device type matches electricity synonyms
  const electricityDevices = useMemo(
    () =>
      selectedData?.filter((item) => {
        const type = String(item['Device Type'] || '').toLocaleLowerCase();
        return /(electric|strom|power|elec)/i.test(type);
      }) ?? [],
    [selectedData]
  );

  const isColdEmpty = (coldWaterDevices?.length || 0) === 0;
  const isHotEmpty = (hotWaterDevices?.length || 0) === 0;
  const isHeatEmpty = (heatDevices?.length || 0) === 0;
  const isElectricityEmpty = (electricityDevices?.length || 0) === 0;
  const isAllEmpty =
    (heatDevices?.length || 0) +
      (coldWaterDevices?.length || 0) +
      (hotWaterDevices?.length || 0) ===
    0;

  const forceElecDummy = process.env.NEXT_PUBLIC_ELEC_DUMMY === '1';
  const shouldShowElectricityChart = !isElectricityEmpty || forceElecDummy;

  return (
    <ContentWrapper className='grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1'>
      <div className='flex flex-col gap-3'>
        <div className='h-[312px]'>
          <WaterChart
            csvText={coldWaterDevices}
            color='#6083CC'
            title='Kaltwasser'
            chartType='cold'
            isEmpty={isColdEmpty}
            emptyTitle='Keine Daten verfügbar.'
            emptyDescription='Keine Daten für Kaltwasser im ausgewählten Zeitraum.'
          />
        </div>
        <div className='h-[271px]'>
          <WaterChart
            csvText={hotWaterDevices || []}
            color='#E74B3C'
            title='Warmwasser'
            chartType='hot'
            isEmpty={isHotEmpty}
            emptyTitle='Keine Daten verfügbar.'
            emptyDescription='Keine Daten für Warmwasser im ausgewählten Zeitraum.'
          />
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='h-[265px]'>
          {!shouldShowElectricityChart ? (
            <GaugeChart
              heatReadings={heatDevices}
              coldWaterReadings={coldWaterDevices}
              hotWaterReadings={hotWaterDevices}
              isEmpty={isAllEmpty}
              emptyTitle='Keine Daten verfügbar.'
              emptyDescription='Keine Daten im ausgewählten Zeitraum.'
            />
          ) : (
            <ElectricityChart
              electricityReadings={electricityDevices}
              isEmpty={isElectricityEmpty}
              emptyTitle='Keine Daten verfügbar.'
              emptyDescription='Keine Stromdaten im ausgewählten Zeitraum.'
            />
          )}
        </div>
        <div className='h-[318px]'>
          <HeatingCosts
            csvText={heatDevices}
            isEmpty={isHeatEmpty}
            emptyTitle='Keine Daten verfügbar.'
            emptyDescription='Keine Heizungsdaten im ausgewählten Zeitraum.'
          />
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='h-[360px]'>
          <NotificationsChart
            isEmpty={isAllEmpty}
            emptyTitle='Keine Daten verfügbar.'
            emptyDescription='Keine Daten im ausgewählten Zeitraum.'
            parsedData={parsedData}
          />
        </div>
        <div className='h-[220px]'>
          <EinsparungChart
            selectedData={selectedData}
            isEmpty={isAllEmpty}
            emptyTitle='Keine Daten verfügbar.'
            emptyDescription='Keine CO₂-Einsparungen im ausgewählten Zeitraum.'
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
