import { checkWeather } from "../src/weather.mjs";
import dotenv from 'dotenv';

dotenv.config();
export default async function header(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await checkWeather();
    res.status(200).json({ message: 'Weather check completed!' });
  } catch (error) {
    console.error('Error in checkWeather:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}