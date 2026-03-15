import React from 'react';
import { CloudRain, CloudSnow, CloudDrizzle, CloudLightning } from 'lucide-react';
import styles from './DailyForecast.module.css';

interface DayForecast {
  day: string;
  highTemp: number;
  lowTemp: number;
  icon: string;
}

interface DailyForecastProps {
  forecasts: DayForecast[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ forecasts }) => {
  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <CloudDrizzle size={32} strokeWidth={1.5} />;
    if (iconCode.includes('02')) return <CloudRain size={32} strokeWidth={1.5} />;
    if (iconCode.includes('03') || iconCode.includes('04')) return <CloudRain size={32} strokeWidth={1.5} />;
    if (iconCode.includes('09')) return <CloudDrizzle size={32} strokeWidth={1.5} />;
    if (iconCode.includes('10')) return <CloudRain size={32} strokeWidth={1.5} />;
    if (iconCode.includes('11')) return <CloudLightning size={32} strokeWidth={1.5} />;
    if (iconCode.includes('13')) return <CloudSnow size={32} strokeWidth={1.5} />;
    return <CloudDrizzle size={32} strokeWidth={1.5} />;
  };

  return (
    <div className={styles.dailyForecast}>
      {forecasts.slice(0, 2).map((forecast, index) => (
        <div key={index} className={styles.dayCard}>
          <div className={styles.dayLabel}>{forecast.day}</div>
          <div className={styles.dayTemp}>
            <span className={styles.tempText}>
              {Math.round(forecast.highTemp)}° / {Math.round(forecast.lowTemp)}°
            </span>
            <span className={styles.weatherIconSmall}>{getWeatherIcon(forecast.icon)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};