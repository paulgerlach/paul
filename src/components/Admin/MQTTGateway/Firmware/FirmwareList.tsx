import { FirmwareVersion } from '@/types';
import React from 'react'


interface FirmwareListProps {
  firmwareVersions: FirmwareVersion[];
  isLoading: boolean;
  error: Error | null;
}

export default function FirmwareList({
  firmwareVersions,
  isLoading,
  error,
}: FirmwareListProps) {
  if (isLoading) return <div>Loading firmware versions...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <div className="space-y-4">
        {firmwareVersions?.length === 0 ? (
          <p className="text-gray-500">No firmware versions uploaded yet.</p>
        ) : (
          firmwareVersions.map((version: FirmwareVersion) => (
            <div
              key={version.id}
              className="p-4 bg-white rounded-lg shadow border"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Version:</strong> {version.version}
                  </p>
                  <p>
                    <strong>Type:</strong> {version.type}
                  </p>
                  <p>
                    <strong>Device Model:</strong> {version.device_model}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Size:</strong>{" "}
                    {(version.size_bytes / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <strong>Uploaded:</strong>{" "}
                    {new Date(
                      version.uploaded_at || version.created_at,
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {version.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              {version.description && (
                <div className="mt-2">
                  <p>
                    <strong>Description:</strong> {version.description}
                  </p>
                </div>
              )}
              {version.release_notes && (
                <div className="mt-2">
                  <p>
                    <strong>Release Notes:</strong> {version.release_notes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
