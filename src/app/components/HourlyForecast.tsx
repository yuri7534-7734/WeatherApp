import React from 'react';
import { CloudRain, CloudSnow, CloudDrizzle, Moon } from 'lucide-react';
import styles from './HourlyForecast.module.css';

interface HourForecast {
  time: string;
  temperature: number;
  icon: string;
}

interface HourlyForecastProps {
  forecasts: HourForecast[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecasts }) => {
  const getWeatherIcon = (iconCode: string) => {
    const hour = parseInt(iconCode.split('-')[1] || '12');
    const isNight = hour >= 18 || hour < 6;
    
    if (iconCode.includes('01')) {
      return isNight ? <Moon size={28} strokeWidth={1.5} /> : <CloudDrizzle size={28} strokeWidth={1.5} />;
    }
    if (iconCode.includes('02')) {
      return isNight ? <Moon size={28} strokeWidth={1.5} /> : <CloudRain size={28} strokeWidth={1.5} />;
    }
    if (iconCode.includes('03') || iconCode.includes('04')) return <CloudRain size={28} strokeWidth={1.5} />;
    if (iconCode.includes('09')) return <CloudDrizzle size={28} strokeWidth={1.5} />;
    if (iconCode.includes('10')) return <CloudRain size={28} strokeWidth={1.5} />;
    return isNight ? <Moon size={28} strokeWidth={1.5} /> : <CloudDrizzle size={28} strokeWidth={1.5} />;
  };

  const maxTemp = Math.max(...forecasts.map(f => f.temperature));
  const minTemp = Math.min(...forecasts.map(f => f.temperature));
  const range = maxTemp - minTemp || 1;

  return (
    <div className={styles.hourlyForecast}>
      <div className={styles.header}>
        <span className={styles.title}>시간별</span>
        <span className={styles.viewAll}>72 시간 ›</span>
      </div>
      
      <div className={styles.chartArea}>
        <svg className={styles.chart} viewBox="0 0 300 80" preserveAspectRatio="none">
          <polyline
            points={forecasts
              .map((f, i) => {
                const x = (i / (forecasts.length - 1)) * 300;
                const y = 70 - ((f.temperature - minTemp) / range) * 60;
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
          />
          {forecasts.map((f, i) => {
            const x = (i / (forecasts.length - 1)) * 300;
            const y = 70 - ((f.temperature - minTemp) / range) * 60;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3" fill="white" />
                <text
                  x={x}
                  y={y - 8}
                  fill="white"
                  fontSize="10"
                  textAnchor="middle"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  {Math.round(f.temperature)}°
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.hourlyItems}>
        {forecasts.map((forecast, index) => (
          <div key={index} className={styles.hourItem}>
            <div className={styles.hour}>{forecast.time}</div>
            <div className={styles.hourIcon}>{getWeatherIcon(forecast.icon)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};