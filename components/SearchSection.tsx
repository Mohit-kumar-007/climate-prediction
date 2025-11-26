
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { INDIAN_CITIES } from '../constants';
import { CityData } from '../types';

interface SearchSectionProps {
  onSearch: (city: string, pin: string) => void;
  isLoading: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, isLoading }) => {
  const [cityName, setCityName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCityName(val);
    
    if (val.length > 0) {
      const filtered = INDIAN_CITIES.filter(c => 
        c.name.toLowerCase().includes(val.toLowerCase()) || 
        c.district.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: CityData) => {
    setCityName(city.name);
    setPinCode(city.pinCode);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (cityName && pinCode) {
      onSearch(cityName, pinCode);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 z-50 relative" ref={wrapperRef}>
      <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
        
        {/* City Input with Dropdown */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-300 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-500 rounded-lg leading-5 bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:bg-black/60 focus:border-blue-500 transition-all sm:text-sm"
            placeholder="Search City or District (e.g., Mumbai)"
            value={cityName}
            onChange={handleCityChange}
            onFocus={() => cityName && setShowSuggestions(true)}
          />
          
          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar">
              <ul className="py-1">
                {suggestions.slice(0, 50).map((city, idx) => (
                  <li 
                    key={`${city.name}-${city.pinCode}-${idx}`}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-gray-200 flex justify-between"
                    onClick={() => handleSuggestionClick(city)}
                  >
                    <span>{city.name}, {city.district}</span>
                    <span className="text-gray-500 text-xs flex items-center">{city.pinCode}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* PIN Code Input */}
        <div className="relative w-full md:w-48 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-300 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-500 rounded-lg leading-5 bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:bg-black/60 focus:border-blue-500 transition-all sm:text-sm"
            placeholder="PIN Code"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading || !cityName}
          className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
