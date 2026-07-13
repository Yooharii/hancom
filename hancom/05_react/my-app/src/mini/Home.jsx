import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Home.css'
import { getWeatherMood, weatherMoodMap } from './contents/weatherData.jsx'

const Home = () => {
  const [weather, setWeather] = useState(null)
  const [moodKey, setMoodKey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cityName, setCityName] = useState('현재 위치')

  useEffect(() => {
    // 현재 날씨 요청
    const fetchWeather = (lat, lon) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          setWeather(data.current_weather)
          setMoodKey(getWeatherMood(data.current_weather.weathercode))
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    // 위치 권한 요청
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ko`)
            .then(res => res.json())
            .then(data => {
              const addr = data.address
              const city = addr.city || addr.town || addr.county || ''
              const district = addr.suburb || addr.neighbourhood || ''
              setCityName(city && district ? `${city} ${district}` : city || district || '현재 위치')
            })
            .catch(() => setCityName('현재 위치'))

          fetchWeather(latitude, longitude)
        },
        () => {
          // 위치 거부 시 메시지만 표시
          setLoading(false)
        }
      )
    }
  }, [])

  const mood = moodKey ? weatherMoodMap[moodKey] : null

  return (
    <main className="main">
      {loading ? (
        <p className="loading">날씨 불러오는 중... ☁️</p>
      ) : weather && mood ? (
        <div className="content">
          <div className="weather-card">
            <span className="weather-emoji">{mood.emoji}</span>
            <p className="weather-label">{cityName} · {mood.label} · {weather.temperature}°C</p>
          </div>
          <p className="mood-text">
            오늘은 <strong>{mood.mood}</strong> 음악을 추천해요!
          </p>
          <Link to="/weather/playlist">
            <button className="playlist-btn">🎵 추천 플레이리스트</button>
          </Link>
        </div>
      ) : (
        <p className="loading">위치를 불러올 수 없습니다 📍</p>
      )}
    </main>
  )
}

export default Home
