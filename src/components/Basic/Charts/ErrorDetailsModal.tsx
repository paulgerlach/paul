"use client";

import { useState, useEffect } from "react";
import { MeterReadingType } from "@/api";
import { alert_triangle, heater, pipe_water, keys } from "@/static/icons";
import Image from "next/image";
import { getDevicesWithErrors, groupErrorsBySeverity, groupErrorsByDeviceType, ErrorInterpretation } from "@/utils/errorFlagInterpreter";
import { StaticImageData } from "next/image";

interface ErrorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedData?: {
    data: MeterReadingType[];
    errors?: { row: number; error: string; rawRow: any }[];
  };
}

export default function ErrorDetailsModal({ isOpen, onClose, parsedData }: ErrorDetailsModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !parsedData) return null;

  const getErrorDetails = () => {
    const details: Array<{
      type: string;
      icon: StaticImageData;
      items: Array<{
        title: string;
        description: string;
        deviceId: string;
        deviceType: string;
        manufacturer?: string;
        severity?: string;
      }>;
    }> = [];

    // Get devices with error flags
    const deviceErrors = getDevicesWithErrors(parsedData);
    
    if (deviceErrors.length === 0) {
      return details; // No errors to display
    }

    // Group errors by severity
    const errorsBySeverity = groupErrorsBySeverity(deviceErrors);
    
    // Critical errors
    if (errorsBySeverity.critical.length > 0) {
      details.push({
        type: "Kritische Fehler",
        icon: alert_triangle,
        items: errorsBySeverity.critical.map(error => ({
          title: `Gerät ${error.deviceId}`,
          description: error.errors.join(", "),
          deviceId: error.deviceId,
          deviceType: error.deviceType,
          manufacturer: error.manufacturer,
          severity: error.severity
        }))
      });
    }

    // High severity errors
    if (errorsBySeverity.high.length > 0) {
      details.push({
        type: "Wichtige Fehler",
        icon: alert_triangle,
        items: errorsBySeverity.high.map(error => ({
          title: `Gerät ${error.deviceId}`,
          description: error.errors.join(", "),
          deviceId: error.deviceId,
          deviceType: error.deviceType,
          manufacturer: error.manufacturer,
          severity: error.severity
        }))
      });
    }

    // Medium severity errors
    if (errorsBySeverity.medium.length > 0) {
      details.push({
        type: "Wartungshinweise",
        icon: keys,
        items: errorsBySeverity.medium.map(error => ({
          title: `Gerät ${error.deviceId}`,
          description: error.errors.join(", "),
          deviceId: error.deviceId,
          deviceType: error.deviceType,
          manufacturer: error.manufacturer,
          severity: error.severity
        }))
      });
    }

    // Low severity errors
    if (errorsBySeverity.low.length > 0) {
      details.push({
        type: "Geringfügige Probleme",
        icon: keys,
        items: errorsBySeverity.low.map(error => ({
          title: `Gerät ${error.deviceId}`,
          description: error.errors.join(", "),
          deviceId: error.deviceId,
          deviceType: error.deviceType,
          manufacturer: error.manufacturer,
          severity: error.severity
        }))
      });
    }

    // Group by device type for additional organization
    const errorsByDeviceType = groupErrorsByDeviceType(deviceErrors);
    
    if (errorsByDeviceType.Heat && errorsByDeviceType.Heat.length > 0) {
      details.push({
        type: "Wärmezähler Details",
        icon: heater,
        items: errorsByDeviceType.Heat.map(error => ({
          title: `Wärmezähler ${error.deviceId}`,
          description: error.errors.join(", "),
          deviceId: error.deviceId,
          deviceType: error.deviceType,
          manufacturer: error.manufacturer,
          severity: error.severity
        }))
      });
    }

    if (errorsByDeviceType.Water && errorsByDeviceType.Water.length > 0) {
      details.push({
        type: "Wasserzähler Details",
        icon: pipe_water,
        items: errorsByDeviceType.Water.map(error => ({
          title: `Wasserzähler ${error.deviceId}`,
          description: error.errors.join(", "),
          deviceId: error.deviceId,
          deviceType: error.deviceType,
          manufacturer: error.manufacturer,
          severity: error.severity
        }))
      });
    }

    if (errorsByDeviceType.WWater && errorsByDeviceType.WWater.length > 0) {
      details.push({
        type: "Warmwasserzähler Details",
        icon: pipe_water,
        items: errorsByDeviceType.WWater.map(error => ({
          title: `Warmwasserzähler ${error.deviceId}`,
          description: error.errors.join(", "),
          deviceId: error.deviceId,
          deviceType: error.deviceType,
          manufacturer: error.manufacturer,
          severity: error.severity
        }))
      });
    }

    return details;
  };

  const errorDetails = getErrorDetails();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detaillierte Fehleranalyse</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {errorDetails.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Keine Fehler gefunden. Alle Daten wurden erfolgreich verarbeitet.</p>
            </div>
          ) : (
            errorDetails.map((errorGroup, groupIndex) => (
              <div key={groupIndex} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Image
                    width={20}
                    height={20}
                    src={errorGroup.icon}
                    alt={errorGroup.type}
                    className="w-5 h-5"
                  />
                  <h3 className="font-semibold text-lg">{errorGroup.type}</h3>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {errorGroup.items.length}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {errorGroup.items.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="bg-gray-50 p-3 rounded border-l-4 border-red-400">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <div className="text-xs text-gray-500 ml-4">
                          <div>Type: {item.deviceType}</div>
                          <div>ID: {item.deviceId}</div>
                          {item.manufacturer && <div>Hersteller: {item.manufacturer}</div>}
                          {item.severity && (
                            <div className={`mt-1 px-2 py-1 rounded text-xs ${
                              item.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              item.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {item.severity === 'critical' ? 'Kritisch' :
                               item.severity === 'high' ? 'Hoch' :
                               item.severity === 'medium' ? 'Mittel' : 'Niedrig'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
