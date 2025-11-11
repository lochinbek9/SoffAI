import React from 'react';
import { Section, FilterOptions } from '../types';
import { SECTION_FILTERS } from '../constants';

interface SectionFiltersProps {
    activeSection: Section;
    options: FilterOptions;
    setOptions: (options: FilterOptions) => void;
}

const SectionFilters: React.FC<SectionFiltersProps> = ({ activeSection, options, setOptions }) => {
    const filters = SECTION_FILTERS[activeSection];

    if (!filters || filters.length === 0) {
        return null;
    }

    const handleOptionChange = (id: string, value: string | number) => {
        setOptions({
            ...options,
            [id]: value,
        });
    };

    return (
        <div className="bg-gray-900/50 border border-gray-700 backdrop-blur-sm rounded-xl p-3 flex flex-wrap items-center gap-x-6 gap-y-3">
            {filters.map((filter) => (
                <div key={filter.id} className="flex items-center gap-3 text-sm">
                     <div className="text-gray-400">{filter.icon}</div>
                     <label className="font-medium text-gray-300">{filter.label}:</label>
                    {filter.type === 'slider' && (
                        <div className="flex items-center gap-2">
                             <input
                                type="range"
                                min={filter.min}
                                max={filter.max}
                                value={(options[filter.id] as number) || filter.defaultValue}
                                onChange={(e) => handleOptionChange(filter.id, parseInt(e.target.value))}
                                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#87e64b]"
                            />
                            <span className="text-white font-mono bg-gray-700/50 rounded-md px-2 py-0.5 text-xs">
                                {options[filter.id] || filter.defaultValue}
                            </span>
                        </div>
                    )}
                    {filter.type === 'buttons' && (
                        <div className="flex items-center gap-2 bg-gray-800/60 p-1 rounded-md">
                            {filter.options.map((opt: string) => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionChange(filter.id, opt)}
                                    className={`px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                                        options[filter.id] === opt
                                            ? 'bg-[#87e64b] text-black font-bold'
                                            : 'bg-transparent text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SectionFilters;
