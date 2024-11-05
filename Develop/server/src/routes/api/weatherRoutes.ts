import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    // GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(req.body.cityName);
    
    // Save city to search history
    await HistoryService.addCity(req.body.cityName);
    
    // Send weather data as response
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    await HistoryService.removeCity(req.params.id);
    res.status(200).json({ message: 'City removed from search history' });
  } catch (error) {
    res.status(500).json({ error: 'Could not remove city from search history' });
  }
});

export default router;