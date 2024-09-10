import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Replace with your OpenWeather API key
// const API_KEY = '74d201873bc02af6ff1c70fa6fb58d7a';

// API route to get weather data for a specific city
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);  // Send weather data back to the front-end
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});