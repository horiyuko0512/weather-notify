import { checkWeather } from "../src/weather.mjs";
import dotenv from 'dotenv';

dotenv.config();
export default async function handler(req, res) {
  const receivedToken = req.headers.authorization;
  const expectedToken = `Bearer ${process.env.CRON_TOKEN}`;
  if (receivedToken !== expectedToken) {
    console.error('Authorization failed', { receivedToken, expectedToken });
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