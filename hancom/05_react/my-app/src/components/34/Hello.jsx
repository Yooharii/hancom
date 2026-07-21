import { useEffect } from "react";

const Hello = () =>{
    useEffect (()=>{
        console.log("화면 뜰 때 딱 1번 실행되는 '의존성 배열'") 
    }, [])
    return(
        <p>안녕하세요</p>
    )
}

export default Hello