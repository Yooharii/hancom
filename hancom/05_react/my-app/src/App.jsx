
import './App.css'
// import Hello from './components/18/Hello.jsx'
//  export로 보낸 함수이름을 from " -"로 부터 받아와  import
// import Greeting from './components/19/Greeting.jsx'
// import Profile from './components/20/Profile.jsx'
// import Card from './components/21/Card.jsx'
// import Avatar from './components/22/Avatar.jsx'
import Badge from './components/23/Badge.jsx'

function App() {
  
  return( 
    <>
    {/* <Hello/> */}
    {/* <Greeting name="React"/>
    <Greeting name="Yoo"/>
    <Greeting name="Lee"/> */}
    {/* <Profile name="유민성" job="웹 프론트"/>  */}
    {/* <Card title ="React 고수되기" desc ="기초부터 차근차근" emoji="🍀" /> */}
    {/* <Avatar name = "유민성" online ={true}/>
    <Avatar name = "유하리" online ={false}/>
    <Avatar name = "유리" online ={true}/> */}
    <Badge text ="안녕하세요 이것은 테스트 입니다." type = "new"/>
    <Badge text ="안녕하세요 이것은 테스트 입니다." type = "add"/>
    </>
  )
}

export default App
