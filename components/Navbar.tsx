import React, { useState, useEffect, useRef } from 'react';
import { Section } from '../types';
import { NAV_ITEMS } from '../constants';
import { SparklesIcon, UserIcon, ChevronDownIcon } from './icons';

interface NavbarProps {
    activeSection: Section;
    setActiveSection: (section: Section) => void;
    onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection, onAuthClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelectSection = (section: Section) => {
        setActiveSection(section);
        setIsDropdownOpen(false);
    };

    const activeItem = NAV_ITEMS.find(item => item.id === activeSection);

    return (

            <header className="absolute top-0 left-0 right-0 z-30 bg-black/30 backdrop-blur-sm p-4 md:p-6 border-b border-white/10">
                <nav className="container mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-6">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold flex items-center cursor-pointer">
                                   <img src="./img/logo.jpeg" width={70} height={70} alt="" className="rounded-full" />
                                    <SparklesIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#87e64b] ml-1 md:ml-2" />
                                </h1>
                            </div>
                            {/* Dropdown Menu */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm md:text-base lg:text-lg font-medium transition-all duration-300 bg-gray-800/70 hover:bg-gray-700/90 text-white"
                                >
                                    {activeItem?.icon && React.cloneElement(activeItem.icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
                                    <span>{activeSection}</span>
                                    <ChevronDownIcon className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute top-full mt-2 w-56 md:w-64 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                        <ul className="p-2">
                                            {NAV_ITEMS.map((item) => (
                                                <li key={item.id}>
                                                    <button
                                                        onClick={() => handleSelectSection(item.id)}
                                                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeSection === item.id
                                                            ? 'bg-[#87e64b] text-black'
                                                            : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                                                            }`}>
                                                        {item.icon}
                                                        <span>{item.label}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                onClick={onAuthClick}
                                className="bg-[#87e64b] text-black px-3 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-1.5 md:gap-2"
                            >
                                Kirish
                            </button>

                        </div>
                    </div>
                </nav>
            </header>
    
    );
};

export default Navbar;