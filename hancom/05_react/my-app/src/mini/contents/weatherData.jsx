export const weatherPlaylists = {
  sunny_hot: [
    { title: '뜨겁고 신나는',   keyword: 'tropical house summer anthem',  emoji: '☀️' },
    { title: '청량하고 시원한', keyword: 'reggaeton beach party latin',   emoji: '🏖️' },
    { title: '열정적인',        keyword: 'EDM festival dance 2023',       emoji: '🕺' },
  ],
  sunny: [
    { title: '밝고 경쾌한',   keyword: 'happy pop upbeat hits', emoji: '🎵' },
    { title: '신나고 활기찬', keyword: 'funk soul groove feel good',       emoji: '💃' },
    { title: '가볍고 상쾌한', keyword: 'indie folk bright morning',        emoji: '🎸' },
  ],
  sunny_cool: [
    { title: '잔잔하고 감성적인', keyword: 'mellow singer songwriter autumn folk', emoji: '🍂' },
    { title: '따뜻하고 포근한',   keyword: 'soft acoustic guitar fingerpicking',  emoji: '🎻' },
    { title: '나른하고 여유로운', keyword: 'chillhop beats study instrumental',   emoji: '🍃' },
  ],
  rainy: [
    { title: '슬프고 감성적인',  keyword: 'melancholic piano ballad heartbreak', emoji: '🎹' },
    { title: '나른하고 몽환적인', keyword: 'cafe jazz blues rainy night',          emoji: '☕' },
    { title: '애잔하고 촉촉한',  keyword: 'neo soul emotional slow jam',          emoji: '🎤' },
  ],
  cloudy: [
    { title: '차분하고 조용한',   keyword: 'ambient soft synth pad calm',    emoji: '🎻' },
    { title: '여유롭고 느긋한',   keyword: 'smooth saxophone bossa nova',    emoji: '🎷' },
    { title: '흐릿하고 감성적인', keyword: 'shoegaze dreamy reverb guitar', emoji: '🌥️' },
  ],
  snowy: [
    { title: '포근하고 따뜻한',   keyword: 'solo piano minimalist snow',       emoji: '🎹' },
    { title: '고요하고 평화로운', keyword: 'nordic folk winter acoustic cozy', emoji: '🧣' },
    { title: '우아하고 서정적인', keyword: 'string quartet classical serene',  emoji: '🎼' },
  ],
  stormy: [
    { title: '강렬하고 거친',          keyword: 'hard rock electric guitar riff',    emoji: '🎸' },
    { title: '폭발적이고 에너지넘치는', keyword: 'dark synthwave aggressive techno', emoji: '⚡' },
    { title: '묵직하고 강한',          keyword: 'heavy metal thrash drum bass',      emoji: '🤘' },
  ],
  foggy: [
    { title: '몽환적이고 신비로운', keyword: 'dark ambient drone atmospheric',  emoji: '🌫️' },
    { title: '흐릿하고 꿈같은',    keyword: 'ethereal vocal reverb slowcore', emoji: '✨' },
    { title: '어둡고 묘한',        keyword: 'noir jazz trumpet melancholy',   emoji: '🎷' },
  ],
}

// temp를 넘기면 온도까지 반영, 안 넘기면 날씨 코드만으로 결정
export const getWeatherMood = (code, temp) => {
  if (code === 0 || code === 1 || code === 2) {
    if (temp !== undefined) {
      if (temp >= 27) return 'sunny_hot'
      if (temp < 15)  return 'sunny_cool'
    }
    return 'sunny'
  }
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'foggy'
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return 'rainy'
  if ([71,73,75,77,85,86].includes(code)) return 'snowy'
  if ([95,96,99].includes(code)) return 'stormy'
  return 'sunny'
}

export const moodLabel = {
  sunny_hot:  '🔥 뜨거운날',
  sunny:      '☀️ 맑은 날',
  sunny_cool: '🍃 선선하고 맑은 날',
  rainy:      '🌧️ 비 오는 날',
  cloudy:     '☁️ 흐린 날',
  snowy:      '❄️ 눈 오는 날',
  stormy:     '⛈️ 천둥 치는 날',
  foggy:      '🌫️ 안개 낀 날',
}

export const weatherMoodMap = {
  sunny_hot:  { emoji: '🔥', label: '맑음 (개더움)',  mood: '신나고 활기찬' },
  sunny:      { emoji: '☀️', label: '맑음',           mood: '신나고 활기차게' },
  sunny_cool: { emoji: '🍃', label: '맑음 (선선)',    mood: '잔잔하고 감성적으로' },
  cloudy:     { emoji: '☁️', label: '흐림',           mood: '잔잔하고 감성적으로' },
  rainy:      { emoji: '🌧️', label: '비',             mood: '감성적이고 몽환적으로' },
  snowy:      { emoji: '❄️', label: '눈',             mood: '포근하고 따뜻하게' },
  stormy:     { emoji: '⛈️', label: '천둥번개',       mood: '강렬하고 에너지 넘치게' },
  foggy:      { emoji: '🌫️', label: '안개',           mood: '몽환적이고 신비롭게' },
}
