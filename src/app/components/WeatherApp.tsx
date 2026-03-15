import React, { useState, useEffect } from 'react';
import { Menu, Grid3x3, MoreVertical } from 'lucide-react';
import { CurrentWeather } from './CurrentWeather';
import { DailyForecast } from './DailyForecast';
import { HourlyForecast } from './HourlyForecast';
import styles from './WeatherApp.module.css';

const API_KEY = '8028451c55c7d3245c46a570fe03b315'; // OpenWeather API 키를 여기에 입력하세요
const CITY = 'Seoul';

interface WeatherData {
  current: {
    temp: number;
    weather: Array<{ main: string; icon: string }>;
    wind_speed: number;
  };
  daily: Array<{
    dt: number;
    temp: { min: number; max: number };
    weather: Array<{ icon: string }>;
  }>;
  hourly: Array<{
    dt: number;
    temp: number;
    weather: Array<{ icon: string }>;
  }>;
}

export const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // 먼저 도시의 좌표를 가져옵니다
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${CITY},KR&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();
      
      if (geoData.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon } = geoData[0];

      // One Call API를 사용하여 날씨 데이터 가져오기
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&lang=kr&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('API call failed');
      }

      const data = await weatherResponse.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Mock 데이터 사용 (API 키가 없거나 오류 발생 시)
      setWeatherData(getMockWeatherData());
      setLoading(false);
    }
  };

  const getMockWeatherData = (): WeatherData => {
    return {
      current: {
        temp: 8,
        weather: [{ main: '맑음', icon: '01d' }],
        wind_speed: 11.0,
      },
      daily: [
        {
          dt: Date.now() / 1000 + 86400,
          temp: { min: 0, max: 6 },
          weather: [{ icon: '01d' }],
        },
        {
          dt: Date.now() / 1000 + 86400 * 2,
          temp: { min: -2, max: 6 },
          weather: [{ icon: '01d' }],
        },
      ],
      hourly: [
        { dt: Date.now() / 1000, temp: 8, weather: [{ icon: '01d-17' }] },
        { dt: Date.now() / 1000 + 3600, temp: 4, weather: [{ icon: '01d-18' }] },
        { dt: Date.now() / 1000 + 7200, temp: 3, weather: [{ icon: '02d-18' }] },
        { dt: Date.now() / 1000 + 10800, temp: 3, weather: [{ icon: '01n-19' }] },
        { dt: Date.now() / 1000 + 14400, temp: 2, weather: [{ icon: '01n-20' }] },
      ],
    };
  };

  const getWeatherCondition = (condition: string) => {
    const conditions: { [key: string]: string } = {
      Clear: '맑음',
      Clouds: '흐림',
      Rain: '비',
      Snow: '눈',
      Drizzle: '이슬비',
      Thunderstorm: '뇌우',
      Mist: '안개',
      Fog: '안개',
    };
    return conditions[condition] || condition;
  };

  if (loading || !weatherData) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
      </div>
    );
  }

  const dailyForecasts = weatherData.daily.slice(1, 3).map((day, index) => {
    const date = new Date(day.dt * 1000);
    const dayLabel = index === 0 
      ? '내일' 
      : `${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]} (${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')})`;
    
    return {
      day: dayLabel,
      highTemp: day.temp.max,
      lowTemp: day.temp.min,
      icon: day.weather[0].icon,
    };
  });

  const hourlyForecasts = weatherData.hourly.slice(0, 5).map((hour) => {
    const date = new Date(hour.dt * 1000);
    return {
      time: `${String(date.getHours()).padStart(2, '0')}:00`,
      temperature: hour.temp,
      icon: `${hour.weather[0].icon}-${date.getHours()}`,
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.statusBar}>
        <div className={styles.leftGroup}>
          <span>{currentTime.getHours()}:{String(currentTime.getMinutes()).padStart(2, '0')}</span>
        </div>
        <div className={styles.rightGroup}>
          <span>📶</span>
          <span>📡</span>
          <span>🔋</span>
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.cityName}>서울특별시</div>
      </div>

      <div className={styles.dots}>
        <div className={`${styles.dot} ${styles.active}`}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>

      <CurrentWeather
        temperature={weatherData.current.temp}
        condition={getWeatherCondition(weatherData.current.weather[0].main)}
        highTemp={weatherData.daily[0].temp.max}
        lowTemp={weatherData.daily[0].temp.min}
        windSpeed={weatherData.current.wind_speed}
        icon={weatherData.current.weather[0].icon}
      />

      <DailyForecast forecasts={dailyForecasts} />

      <HourlyForecast forecasts={hourlyForecasts} />
    </div>
  );
};