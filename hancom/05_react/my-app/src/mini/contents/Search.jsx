import { useState, useRef } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'

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

const Search = () => {
  const [query, setQuery]           = useState('')
  const [songs, setSongs]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [searched, setSearched]     = useState(false)
  const [playingUrl, setPlayingUrl] = useState(null)
  const [favs, setFavs]             = useState(getFavorites())
  const audioRef = useRef(null)

  const handleSearch = () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&country=KR&limit=10`)
      .then(r => r.json())
      .then(data => { setSongs(data.results); setLoading(false) })
      .catch(() => setLoading(false))
  }

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

  return (
    <main className="main" style={{ padding: '24px' }}>
      <Typography variant="h6" fontWeight="bold" style={{ textAlign: 'center', marginBottom: '24px', color: 'white' }}>
        🔍 음악 검색
      </Typography>

      <Box style={{ display: 'flex', gap: '24px', width: '100%', maxWidth: '860px', margin: '0 auto' }}>

        {/* 왼쪽: 검색창 */}
        <Box style={{ width: '260px', flexShrink: 0 }}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="아티스트 또는 곡 이름"
              style={{ padding: '10px 14px', fontSize: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', outline: 'none', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'white' }}
            />
            <button
              onClick={handleSearch}
              style={{ padding: '10px', background: 'rgba(29,185,84,0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(29,185,84,0.55)', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 16px rgba(29,185,84,0.3)', transition: 'all 0.2s' }}
            >
              검색
            </button>
          </Box>
        </Box>

        {/* 오른쪽: 검색 결과 */}
        <Box style={{ flex: 1 }}>
          {loading ? (
            <Box style={{ textAlign: 'center', padding: '32px 0' }}>
              <CircularProgress size={32} style={{ color: '#1db954' }} />
            </Box>
          ) : searched && songs.length === 0 ? (
            <Typography style={{ color: 'rgba(255,255,255,0.6)' }}>검색 결과가 없어요</Typography>
          ) : (
            songs.map((song, i) => (
              <Box
                key={i}
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

      </Box>
    </main>
  )
}

export default Search
