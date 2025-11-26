import React, { useState } from 'react';
import { fetchClimatePrediction } from './services/geminiService';
import DynamicBackground from './components/DynamicBackground';
import SearchSection from './components/SearchSection';
import WeatherTabs from './components/WeatherTabs';
import { ClimateResponse, WeatherCondition } from './types';

const App: React.FC = () => {
  const [climateData, setClimateData] = useState<ClimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCondition, setCurrentCondition] = useState<WeatherCondition>(WeatherCondition.STARRY);

  const handleSearch = async (city: string, pin: string) => {
    setLoading(true);
    setError(null);
    setClimateData(null);
    
    // Reset background to default during search
    setCurrentCondition(WeatherCondition.STARRY);

    try {
      const data = await fetchClimatePrediction(city, pin);
      
      if (data) {
        setClimateData(data);
        
        // Map API string condition to Enum
        let condition = WeatherCondition.STARRY;
        const apiCondition = data.current.condition.toLowerCase();
        
        if (apiCondition.includes('rain')) condition = WeatherCondition.RAIN;
        else if (apiCondition.includes('cloud')) condition = WeatherCondition.CLOUDS;
        else if (apiCondition.includes('clear') || apiCondition.includes('sun')) condition = WeatherCondition.CLEAR;
        
        setCurrentCondition(condition);
      } else {
        setError("Could not retrieve climate data. Please verify your API Key and try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      
      {/* Dynamic Background */}
      <DynamicBackground condition={currentCondition} />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-blue-200">
            ClimateAI India
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced meteorological predictions powered by Machine Learning. 
            Select your city to view real-time analysis and next-day forecasts.
          </p>
        </div>

        {/* Search */}
        <SearchSection onSearch={handleSearch} isLoading={loading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {climateData && !loading && (
          <WeatherTabs data={climateData} />
        )}

        {/* Empty State / Initial Prompt */}
        {!climateData && !loading && !error && (
          <div className="mt-10 text-center text-white/40">
            <p>Start by typing a city name above (e.g., "New Delhi")</p>
          </div>
        )}

      </main>
      
      {/* Footer / Attribution */}
      <footer className="absolute bottom-4 w-full text-center text-white/20 text-sm pointer-events-none">
        Powered by Gemini AI • Prediction Model v2.5
      </footer>
    </div>
  );
};

export default App;