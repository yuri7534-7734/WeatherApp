import React from 'react';
import { Wind, CloudRain, CloudSnow, CloudDrizzle, CloudLightning } from 'lucide-react';
import styles from './CurrentWeather.module.css';

interface CurrentWeatherProps {
  temperature: number;
  condition: string;
  highTemp: number;
  lowTemp: number;
  windSpeed: number;
  icon: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  temperature,
  condition,
  highTemp,
  lowTemp,
  windSpeed,
  icon,
}) => {
  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <CloudDrizzle size={80} strokeWidth={1.5} />;
    if (iconCode.includes('02')) return <CloudRain size={80} strokeWidth={1.5} />;
    if (iconCode.includes('03') || iconCode.includes('04')) return <CloudRain size={80} strokeWidth={1.5} />;
    if (iconCode.includes('09')) return <CloudDrizzle size={80} strokeWidth={1.5} />;
    if (iconCode.includes('10')) return <CloudRain size={80} strokeWidth={1.5} />;
    if (iconCode.includes('11')) return <CloudLightning size={80} strokeWidth={1.5} />;
    if (iconCode.includes('13')) return <CloudSnow size={80} strokeWidth={1.5} />;
    return <CloudDrizzle size={80} strokeWidth={1.5} />;
  };

  return (
    <>
      <div className={styles.currentWeather}>
        <div className={styles.weatherIcon}>{getWeatherIcon(icon)}</div>
        <h1 className={styles.temperature}>{Math.round(temperature)}°</h1>
        <p className={styles.condition}>{condition}</p>
        <div className={styles.details}>
          <span className={styles.detail}>↓{Math.round(lowTemp)}°</span>
          <span className={styles.detail}>↑{Math.round(highTemp)}°</span>
          <span className={styles.detail}>
            <Wind size={14} strokeWidth={1.5} />
            {windSpeed.toFixed(1)} km/h
          </span>
        </div>
      </div>
      <div className={styles.aqiSection}>AQI 89 보통</div>
    </>
  );
};