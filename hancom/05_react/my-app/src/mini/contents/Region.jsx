import { useState, useRef } from 'react'
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material'
import { weatherPlaylists, getWeatherMood, moodLabel } from './weatherData.jsx'

const getFavorites = () => JSON.parse(localStorage.getItem('favorites') || '[]')
const toggleFavorite = (song) => {
  const favs = getFavorites()
  const updated = favs.some(f => f.trackId === song.trackId)
    ? favs.filter(f => f.trackId !== song.trackId)
    : [...favs, song]
  localStorage.setItem('favorites', JSON.stringify(updated))
}

const GLASS      = { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }
const GLASS_PLAY = { background: 'rgba(29,185,84,0.22)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(29,185,84,0.4)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }

const cities = [
  { name: '서울', lat: 37.5665, lon: 126.9780, emoji: '🏙️' },
  { name: '부산', lat: 35.1796, lon: 129.0756, emoji: '🌊' },
  { name: '대전', lat: 36.3504, lon: 127.3845, emoji: '🌿' },
  { name: '대구', lat: 35.8714, lon: 128.6014, emoji: '🍎' },
  { name: '인천', lat: 37.4563, lon: 126.7052, emoji: '✈️' },
  { name: '광주', lat: 35.1595, lon: 126.8526, emoji: '🌻' },
  { name: '수원', lat: 37.2636, lon: 127.0286, emoji: '🏰' },
  { name: '제주', lat: 33.4996, lon: 126.5312, emoji: '🌺' },
]

const Region = () => {
  const [selected, setSelected]         = useState(null)
  const [weather, setWeather]           = useState(null)
  const [mood, setMood]                 = useState(null)
  const [cards, setCards]               = useState([])
  const [songs, setSongs]               = useState({})
  const [loadingCity, setLoadingCity]   = useState(false)
  const [loadingSongs, setLoadingSongs] = useState({})
  const [openCard, setOpenCard]         = useState(null)
  const [playingUrl, setPlayingUrl]     = useState(null)
  const [favs, setFavs]                 = useState(getFavorites())
  const audioRef = useRef(null)

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setPlayingUrl(null)
  }

  const handlePlay = (previewUrl) => {
    if (!previewUrl) return
    if (playingUrl === previewUrl) {
      audioRef.current.pause(); setPlayingUrl(null)
    } else {
      stopAudio()
      const audio = new Audio(previewUrl)
      audio.play()
      audio.onended = () => setPlayingUrl(null)
      audioRef.current = audio
      setPlayingUrl(previewUrl)
    }
  }

  const fetchSongs = (cardIndex, keyword) => {
    if (songs[cardIndex]) {
      setOpenCard(openCard === cardIndex ? null : cardIndex)
      return
    }
    setOpenCard(cardIndex)
    setLoadingSongs(prev => ({ ...prev, [cardIndex]: true }))
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&media=music&country=KR&limit=8`)
      .then(r => r.json())
      .then(data => {
        setSongs(prev => ({ ...prev, [cardIndex]: data.results }))
        setLoadingSongs(prev => ({ ...prev, [cardIndex]: false }))
      })
      .catch(() => setLoadingSongs(prev => ({ ...prev, [cardIndex]: false })))
  }

  const handleCityClick = (city) => {
    stopAudio()
    setSelected(city)
    setWeather(null)
    setMood(null)
    setCards([])
    setSongs({})
    setOpenCard(null)
    setLoadingCity(true)

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`)
      .then(r => r.json())
      .then(data => {
        const code = data.current_weather.weathercode
        const temp = data.current_weather.temperature
        const m = getWeatherMood(code, temp)
        setWeather({ temp, code })
        setMood(m)
        setCards(weatherPlaylists[m])
        setLoadingCity(false)
      })
      .catch(() => setLoadingCity(false))
  }

  return (
    <main className="main" style={{ padding: '24px' }}>
      <Typography variant="h6" fontWeight="bold" style={{ textAlign: 'center', marginBottom: '24px', color: 'white' }}>
        📍 지역 선택
      </Typography>

      <Box style={{ display: 'flex', gap: '24px', width: '100%', maxWidth: '860px', margin: '0 auto' }}>

        {/* 왼쪽: 도시 그리드 + 날씨 + 카드 */}
        <Box style={{ width: '260px', flexShrink: 0 }}>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {cities.map(city => (
              <div
                key={city.name}
                onClick={() => handleCityClick(city)}
                className="city-btn"
                style={selected?.name === city.name
                  ? { background: 'rgba(29,185,84,0.4)', border: '1px solid #1db954', color: 'white' }
                  : {}}
              >
                <Typography style={{ fontSize: '20px' }}>{city.emoji}</Typography>
                <Typography fontWeight="bold" style={{ fontSize: '13px', color: 'white' }}>{city.name}</Typography>
              </div>
            ))}
          </Box>

          {loadingCity && (
            <Box style={{ textAlign: 'center', padding: '16px 0' }}>
              <CircularProgress size={28} style={{ color: '#1db954' }} />
              <Typography style={{ marginTop: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{selected?.name} 날씨 불러오는 중...</Typography>
            </Box>
          )}

          {weather && mood && !loadingCity && (
            <>
              <Box style={{ textAlign: 'center', marginBottom: '16px', padding: '12px', borderRadius: '12px', ...GLASS }}>
                <Typography style={{ fontSize: '22px', color: 'white' }}>{moodLabel[mood]}</Typography>
                <Typography style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{selected?.name} · {weather.temp}°C</Typography>
              </Box>

              <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cards.map((card, i) => (
                  <Card
                    key={i}
                    onClick={() => fetchSongs(i, card.keyword)}
                    style={{ ...GLASS, cursor: 'pointer', borderRadius: '12px', border: openCard === i ? '2px solid #1db954' : '1px solid rgba(255,255,255,0.2)', boxShadow: openCard === i ? '0 4px 20px rgba(29,185,84,0.3)' : '0 4px 16px rgba(0,0,0,0.2)', transition: 'all 0.2s', color: 'white' }}
                  >
                    <CardContent style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                      <Typography style={{ fontSize: '28px' }}>{card.emoji}</Typography>
                      <Typography fontWeight="bold" style={{ flex: 1, color: 'white' }}>{card.title}</Typography>
                      <Typography style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{openCard === i ? '▲' : '▼'}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}
        </Box>

        {/* 오른쪽: 곡 목록 */}
        {openCard !== null && (
          <Box style={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" style={{ marginBottom: '12px', color: 'white' }}>
              {cards[openCard]?.emoji} {cards[openCard]?.title} 추천 곡
            </Typography>

            {loadingSongs[openCard] ? (
              <Box style={{ textAlign: 'center', padding: '32px 0' }}>
                <CircularProgress size={28} style={{ color: '#1db954' }} />
              </Box>
            ) : (
              (songs[openCard] || []).map((song, j) => (
                <Box
                  key={j}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', marginBottom: '6px', borderRadius: '10px', ...(playingUrl === song.previewUrl ? GLASS_PLAY : GLASS), transition: 'all 0.2s' }}
                >
                  <img src={song.artworkUrl100} alt="cover" width={48} height={48} style={{ borderRadius: '8px' }} />
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight="bold" noWrap style={{ color: 'white' }}>{song.trackName}</Typography>
                    <Typography variant="body2" noWrap style={{ color: 'rgba(255,255,255,0.65)' }}>{song.artistName}</Typography>
                  </Box>
                  <Box onClick={(e) => { e.stopPropagation(); toggleFavorite(song); setFavs(getFavorites()) }} style={{ fontSize: '20px', cursor: 'pointer' }}>
                    {favs.some(f => f.trackId === song.trackId) ? '⭐' : '☆'}
                  </Box>
                  <Box onClick={() => handlePlay(song.previewUrl)} style={{ fontSize: '22px', cursor: song.previewUrl ? 'pointer' : 'default', opacity: song.previewUrl ? 1 : 0.35 }}>
                    {playingUrl === song.previewUrl ? '⏸' : '▶️'}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}

      </Box>
    </main>
  )
}

export default Region
