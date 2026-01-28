import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

export default function FirmwareUpload() {
  const queryClient = useQueryClient();
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        "/api/mqtt-gateway/firmware-versions/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setUploadStatus("Firmware uploaded successfully!");
      setIsFormVisible(false); // Hide form after successful upload
      queryClient.invalidateQueries({ queryKey: ["firmware-versions"] });
      // Reset form
      const form = document.getElementById(
        "firmware-upload-form",
      ) as HTMLFormElement;
      if (form) form.reset();
      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(""), 3000);
    },
    onError: (error: Error) => {
      setUploadStatus(`Upload failed: ${error.message}`);
    },
  });

  const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setUploadStatus("Uploading...");
    uploadMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setUploadStatus("");
    // Reset form
    const form = document.getElementById(
      "firmware-upload-form",
    ) as HTMLFormElement;
    if (form) form.reset();
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow relative">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold"></h4>
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-green text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Upload Firmware
          </button>
        )}
      </div>

      {isFormVisible && (
        <>
          <form
            id="firmware-upload-form"
            onSubmit={handleUpload}
            className="space-y-4 relative"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Firmware File *
              </label>
              <input
                title="file"
                type="file"
                name="file"
                required
                accept=".bin,.hex,.elf,.img"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: .bin, .hex, .elf, .img
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Version *
                </label>
                <input
                  type="text"
                  name="version"
                  required
                  placeholder="e.g., 1.2.3"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  title="type"
                  name="type"
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="boot">Boot</option>
                  <option value="modem">Modem</option>
                  <option value="application">Application</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Device Model *
              </label>
              <input
                type="text"
                name="deviceModel"
                required
                placeholder="e.g., ESP32-WROOM-32"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Release Notes
              </label>
              <textarea
                name="releaseNotes"
                rows={3}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional release notes"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploadMutation.isPending}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Firmware"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            {uploadStatus && (
              <p
                className={`text-sm text-center ${
                  uploadStatus.includes("failed") ||
                  uploadStatus.includes("Error")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {uploadStatus}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}
