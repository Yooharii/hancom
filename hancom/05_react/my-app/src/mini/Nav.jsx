import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <nav className="nav">
      <Link to="/weather" className="nav-link">홈</Link>
      <Link to="/weather/playlist" className="nav-link">플레이리스트</Link>
      <Link to="/search" className="nav-link">검색</Link>
      <Link to="/favorites" className="nav-link">즐겨찾기</Link>
      <Link to="/region" className="nav-link">지역별 날씨보기</Link>
    </nav>
  )
}

export default Nav
