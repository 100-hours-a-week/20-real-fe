interface NoticeInfoSelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export function NoticeInfoSelect({ label, value, options, onChange }: NoticeInfoSelectProps) {
  return (
    <div className="relative">
      {label && <label className="block mb-1 text-sm text-gray-700">{label}</label>}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 text-base focus:outline-none focus:ring-1 focus:border-blue-500"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">▼</div>
      </div>
    </div>
  );
}
