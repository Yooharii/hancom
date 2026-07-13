import { useState, useRef } from 'react'
import { Box, Typography } from '@mui/material'

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

const Favorites = () => {
  const [favs, setFavs]             = useState(getFavorites())
  const [playingUrl, setPlayingUrl] = useState(null)
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

  const handleRemove = (song) => {
    toggleFavorite(song)
    setFavs(getFavorites())
  }

  return (
    <main className="main" style={{ padding: '24px' }}>
      <Typography variant="h6" fontWeight="bold" style={{ textAlign: 'center', marginBottom: '24px', color: 'white' }}>
        ⭐ 즐겨찾기
      </Typography>

      <Box style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        {favs.length === 0 ? (
          <Box style={{ textAlign: 'center', padding: '48px 0' }}>
            <Typography style={{ fontSize: '40px', marginBottom: '8px' }}>🎵</Typography>
            <Typography style={{ color: 'rgba(255,255,255,0.7)' }}>즐겨찾기한 곡이 없어요</Typography>
            <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>검색 페이지에서 ☆를 눌러 추가해보세요</Typography>
          </Box>
        ) : (
          favs.map((song, i) => (
            <Box
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', marginBottom: '8px', borderRadius: '10px', ...(playingUrl === song.previewUrl ? GLASS_PLAY : GLASS), transition: 'all 0.2s' }}
            >
              <img src={song.artworkUrl100} alt="cover" width={52} height={52} style={{ borderRadius: '8px' }} />
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight="bold" noWrap style={{ color: 'white' }}>{song.trackName}</Typography>
                <Typography variant="body2" noWrap style={{ color: 'rgba(255,255,255,0.65)' }}>{song.artistName}</Typography>
              </Box>
              <Box onClick={() => handleRemove(song)} style={{ fontSize: '20px', cursor: 'pointer' }}>⭐</Box>
              <Box onClick={() => handlePlay(song.previewUrl)} style={{ fontSize: '22px', cursor: song.previewUrl ? 'pointer' : 'default', opacity: song.previewUrl ? 1 : 0.35 }}>
                {playingUrl === song.previewUrl ? '⏸' : '▶️'}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </main>
  )
}

export default Favorites
