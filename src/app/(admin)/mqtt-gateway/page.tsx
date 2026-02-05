import Loading from "@/components/Basic/Loading/Loading";
import React, { Suspense } from "react";
import GatewayContent from "./GatewayContent";

export default function MQTTGatewayManagement() {
  return (
    <Suspense fallback={<Loading/>}>
      <GatewayContent />;
    </Suspense>
  );
}
