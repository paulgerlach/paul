import Loading from "@/components/Basic/Loading/Loading";
import React, { Suspense } from "react";
import AgencyManagementContent from "./AgencyManagementContent";

export default function MQTTGatewayManagement() {
  return (
    <Suspense fallback={<Loading/>}>
      <AgencyManagementContent />;
    </Suspense>
  );
}
