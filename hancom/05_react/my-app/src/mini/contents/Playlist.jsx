import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardActionArea, Typography, Box, CircularProgress } from '@mui/material'
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

const Playlist = () => {
  const [mood, setMood]               = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [selected, setSelected]       = useState(null)
  const [songs, setSongs]             = useState({})
  const [songLoading, setSongLoading] = useState({})
  const [playingUrl, setPlayingUrl]   = useState(null)
  const [favs, setFavs]               = useState(getFavorites())
  const audioRef = useRef(null)

  useEffect(() => {
    const fetchWeather = (lat, lon) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => { setMood(getWeatherMood(data.current_weather.weathercode)); setWeatherLoading(false) })
        .catch(() => { setMood('sunny'); setWeatherLoading(false) })
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        ()    => fetchWeather(37.5665, 126.9780)
      )
    } else {
      fetchWeather(37.5665, 126.9780)
    }
  }, [])

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setPlayingUrl(null)
  }

  const handleCardClick = (index) => {
    if (selected === index) { setSelected(null); return }
    stopAudio()
    setSelected(index)
    if (songs[index]) return
    setSongLoading(prev => ({ ...prev, [index]: true }))
    const keyword = weatherPlaylists[mood][index].keyword
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&media=music&country=KR&limit=8`)
      .then(r => r.json())
      .then(data => {
        setSongs(prev => ({ ...prev, [index]: data.results }))
        setSongLoading(prev => ({ ...prev, [index]: false }))
      })
      .catch(() => setSongLoading(prev => ({ ...prev, [index]: false })))
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

  if (weatherLoading) {
    return (
      <main className="main">
        <CircularProgress style={{ color: '#1db954' }} />
        <Typography style={{ marginTop: '16px', color: 'rgba(255,255,255,0.6)' }}>날씨 불러오는 중...</Typography>
      </main>
    )
  }

  const cards = weatherPlaylists[mood]

  return (
    <main className="main" style={{ padding: '24px' }}>
      <Typography variant="h6" fontWeight="bold" style={{ textAlign: 'center', marginBottom: '24px', color: 'white' }}>
        {moodLabel[mood]}에 어울리는 플레이리스트
      </Typography>

      <Box style={{ display: 'flex', gap: '24px', width: '100%', maxWidth: '860px', margin: '0 auto' }}>

        {/* 왼쪽: 카드 목록 */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '260px', flexShrink: 0 }}>
          {cards.map((card, i) => (
            <Card
              key={i}
              style={{
                ...GLASS,
                borderRadius: '14px',
                border: selected === i ? '2px solid #1db954' : '1px solid rgba(255,255,255,0.2)',
                boxShadow: selected === i ? '0 4px 20px rgba(29,185,84,0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                color: 'white',
              }}
            >
              <CardActionArea onClick={() => handleCardClick(i)} style={{ borderRadius: '14px' }}>
                <CardContent style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
                  <Typography style={{ fontSize: '36px' }}>{card.emoji}</Typography>
                  <Typography variant="h6" fontWeight="bold" style={{ color: 'white' }}>{card.title}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {/* 오른쪽: 곡 목록 */}
        {selected !== null && (
          <Box style={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" style={{ marginBottom: '12px', color: 'white' }}>
              {cards[selected].emoji} {cards[selected].title} 추천 곡
            </Typography>

            {songLoading[selected] ? (
              <Box style={{ textAlign: 'center', padding: '32px 0' }}>
                <CircularProgress size={28} style={{ color: '#1db954' }} />
                <Typography style={{ marginTop: '8px', color: 'rgba(255,255,255,0.6)' }}>곡 불러오는 중...</Typography>
              </Box>
            ) : (
              (songs[selected] || []).map((song, j) => (
                <Box
                  key={j}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', marginBottom: '6px', borderRadius: '10px', ...(playingUrl === song.previewUrl ? GLASS_PLAY : GLASS), transition: 'all 0.2s' }}
                >
                  <img src={song.artworkUrl100} alt="cover" width={48} height={48} style={{ borderRadius: '8px' }} />
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight="bold" noWrap style={{ color: 'white' }}>{song.trackName}</Typography>
                    <Typography variant="body2" noWrap style={{ color: 'rgba(255,255,255,0.65)' }}>{song.artistName}</Typography>
                  </Box>
                  <Box onClick={() => { toggleFavorite(song); setFavs(getFavorites()) }} style={{ fontSize: '20px', cursor: 'pointer' }}>
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

export default Playlist
