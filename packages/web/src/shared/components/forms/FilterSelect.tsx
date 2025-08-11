import React from 'react';

export interface FilterOption<T = string> {
  value: T;
  label: string;
}

interface FilterSelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: FilterOption<T>[];
  label?: string;
  placeholder?: string;
  className?: string;
}

function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  label,
  placeholder = "Select option",
  className = ""
}: FilterSelectProps<T>) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor="filter-select" className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        id="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterSelect;