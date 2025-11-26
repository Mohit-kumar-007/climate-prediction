import { GoogleGenAI, Type } from "@google/genai";
import { ClimateResponse } from "../types";

// Lightweight bridge to the hosted forecast model. In production this would
// call your own backend service instead of the client owning the API key.
const getForecastModel = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Forecast API key missing from environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchClimatePrediction = async (cityName: string, pinCode: string): Promise<ClimateResponse | null> => {
  const modelClient = getForecastModel();
  if (!modelClient) return null;

  const prompt = `
    You are Climate Prediction, a friendly forecasting assistant focused on cities across India.
    
    Task:
    1. Retrieve or simulate current weather for: ${cityName}, India (PIN: ${pinCode}).
    2. Project tomorrow's conditions based on typical seasonal patterns for this region.
    
    Output Requirements:
    - Provide 'Current' weather accurately.
    - Provide 'Prediction' for the next day.
    - 'condition' must be one of: 'Clear', 'Clouds', 'Rain'.
    - 'tags' should be short descriptors like "Sunny", "High Humidity", "Heavy Rain".
    - 'hourlyForecast' should be 5 data points for tomorrow.
  `;

  try {
    const response = await modelClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            current: {
              type: Type.OBJECT,
              properties: {
                temperature: { type: Type.NUMBER },
                humidity: { type: Type.NUMBER },
                windSpeed: { type: Type.NUMBER },
                condition: { type: Type.STRING, enum: ['Clear', 'Clouds', 'Rain'] },
                description: { type: Type.STRING },
                feelsLike: { type: Type.NUMBER },
              },
              required: ['temperature', 'condition', 'description', 'humidity', 'windSpeed', 'feelsLike']
            },
            prediction: {
              type: Type.OBJECT,
              properties: {
                tomorrowTemp: { type: Type.NUMBER },
                tomorrowCondition: { type: Type.STRING, enum: ['Clear', 'Clouds', 'Rain'] },
                tomorrowRainChance: { type: Type.NUMBER },
                summary: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                hourlyForecast: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      hour: { type: Type.STRING },
                      temp: { type: Type.NUMBER }
                    }
                  }
                }
              },
              required: ['tomorrowTemp', 'tomorrowCondition', 'tomorrowRainChance', 'summary', 'hourlyForecast', 'tags']
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ClimateResponse;
    }
    return null;

  } catch (error) {
    console.error("Error fetching climate prediction:", error);
    return null;
  }
};