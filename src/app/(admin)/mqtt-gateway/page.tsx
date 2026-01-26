import Breadcrumb from '@/components/Admin/Breadcrumb/Breadcrumb';
import ContentWrapper from '@/components/Admin/ContentWrapper/ContentWrapper';
import { ROUTE_DASHBOARD } from '@/routes/routes';
import React from 'react'

export default function MQTTGatewayManagement() {
  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={ROUTE_DASHBOARD}
        title="Gateway Management"
      />
      <ContentWrapper className="gap-14 max-medium:gap-6 grid grid-cols-2 max-medium:grid-cols-1">
        <p>MQTTGatewayManagement</p>
      </ContentWrapper>
    </div>
  );
}
