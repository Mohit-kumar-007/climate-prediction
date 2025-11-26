import React, { useState } from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  LineChart, 
  Activity, 
  Calendar 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ClimateResponse, WeatherCondition } from '../types';

interface WeatherTabsProps {
  data: ClimateResponse;
}

const WeatherTabs: React.FC<WeatherTabsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'prediction'>('current');
  const { current, prediction } = data;

  const getWeatherIcon = (condition: string, className: string = "h-12 w-12") => {
    switch (condition) {
      case WeatherCondition.RAIN: return <CloudRain className={`${className} text-blue-400`} />;
      case WeatherCondition.CLEAR: return <Sun className={`${className} text-yellow-400`} />;
      case WeatherCondition.CLOUDS: return <Wind className={`${className} text-gray-400`} />;
      default: return <Sun className={`${className} text-yellow-400`} />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
      
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'current' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="h-4 w-4" />
            Current Weather
          </button>
          <button
            onClick={() => setActiveTab('prediction')}
            className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'prediction' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LineChart className="h-4 w-4" />
            Tomorrow Outlook
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-black/30 backdrop-blur-lg rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl min-h-[400px]">
        
        {/* CURRENT TAB */}
        {activeTab === 'current' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-400 text-lg uppercase tracking-wider font-semibold">Real-Time Analysis</h3>
                <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">{current.temperature}°C</h2>
                <p className="text-xl text-blue-200 mt-1 capitalize">{current.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <Wind className="h-4 w-4" /> Wind
                  </div>
                  <span className="text-2xl font-bold text-white">{current.windSpeed} km/h</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <CloudRain className="h-4 w-4" /> Humidity
                  </div>
                  <span className="text-2xl font-bold text-white">{current.humidity}%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white/5 to-transparent rounded-full aspect-square relative border border-white/5">
              <div className="animate-bounce-slow">
                {getWeatherIcon(current.condition, "h-32 w-32")}
              </div>
              <p className="mt-4 text-gray-300 text-center">Feels like <span className="text-white font-bold">{current.feelsLike}°C</span></p>
            </div>
          </div>
        )}

        {/* PREDICTION TAB */}
        {activeTab === 'prediction' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30">Forecast Summary</span>
                  <span className="text-gray-400 text-sm flex items-center gap-1"><Calendar className="h-3 w-3"/> Tomorrow's Forecast</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Expected: {prediction.tomorrowTemp}°C</h2>
                <p className="text-gray-300 mt-2 max-w-lg">{prediction.summary}</p>
              </div>
              
              <div className="flex gap-2">
                {prediction.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated Chart */}
            <div className="h-64 w-full bg-black/20 rounded-xl p-4 border border-white/5">
              <h4 className="text-sm text-gray-400 mb-4">Hourly Temperature Projection</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prediction.hourlyForecast}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="hour" stroke="#9ca3af" tick={{fontSize: 12}} />
                  <YAxis stroke="#9ca3af" tick={{fontSize: 12}} unit="°" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#d8b4fe' }}
                  />
                  <Area type="monotone" dataKey="temp" stroke="#9333ea" fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
              <span className="text-purple-200">Precipitation Probability</span>
              <span className="text-2xl font-bold text-white">{prediction.tomorrowRainChance}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherTabs;