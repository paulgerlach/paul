'use client';

export default function IntegrationsForm({ onClose, inputStyle, labelStyle }: { onClose: () => void, inputStyle: string, labelStyle: string }) {
  return (
    <div className="flex flex-col gap-5 mt-2">
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>API Schlüssel</label>
        <div className="flex gap-2">
            <input title="API Schlüssel" type="text" value="sk_live_51J..." readOnly className={`${inputStyle} bg-gray-50 text-gray-500`} />
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50">Kopieren</button>
        </div>
      </div>
      <div className="w-full space-y-3">
        <label className={labelStyle}>Verbundene Dienste</label>
        
        {/* Toggle Simulation */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center text-blue-600 text-xs font-bold">DATEV</div>
                <span className="text-sm font-medium text-gray-900">DATEV Export</span>
            </div>
            <div className="w-10 h-5 bg-[#7AD085] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center text-orange-600 text-xs font-bold">AWS</div>
                <span className="text-sm font-medium text-gray-900">Cloud Backup</span>
            </div>
            <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
        </div>
      </div>
      <ModalFooter onClose={onClose} />
    </div>
  );
};
