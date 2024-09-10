import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const [presetWeather, setPresetWeather] = useState([]); // Store weather for predefined cities
  const presetCities = ['Delhi', 'Mumbai', 'London']; // Predefined cities

  // Function to handle form submission and fetch weather data for user input
  const getWeather = async (e) => {
    e.preventDefault();
    setError('');

    if (!city) {
      setError('Please enter a city name');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/weather?city=${city}`);
      setWeather(response.data);
    } catch (error) {
      setError('Could not fetch weather data. Please try again.');
    }
  };

  // Fetch weather data for preset cities when the app loads
  useEffect(() => {
    const fetchPresetWeather = async () => {
      try {
        const promises = presetCities.map(city =>
          axios.get(`http://localhost:5000/api/weather?city=${city}`)
        );
        const results = await Promise.all(promises);
        setPresetWeather(results.map(result => result.data));
      } catch (error) {
        console.log('Error fetching preset cities weather:', error);
      }
    };

    fetchPresetWeather();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Weather Checker</h1>

      {/* Form for user to enter a city */}
      <form onSubmit={getWeather} className="mb-4">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-gray-300 rounded p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Get Weather
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {/* Display the weather for user input */}
      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6">
          <h2 className="text-2xl font-bold mb-4">{weather.name}</h2>
          <p className="text-lg">Temperature: {weather.main.temp}°C</p>
          <p className="text-lg">Weather: {weather.weather[0].description}</p>
          <p className="text-lg">Humidity: {weather.main.humidity}%</p>
        </div>
      )}

      {/* Display the weather for preset cities */}
      <h2 className="text-xl font-bold mt-8 mb-4">Weather in Predefined Cities:</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presetWeather.map((cityWeather) => (
          <div key={cityWeather.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">{cityWeather.name}</h3>
            <p className="text-lg">Temperature: {cityWeather.main.temp}°C</p>
            <p className="text-lg">Weather: {cityWeather.weather[0].description}</p>
            <p className="text-lg">Humidity: {cityWeather.main.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
