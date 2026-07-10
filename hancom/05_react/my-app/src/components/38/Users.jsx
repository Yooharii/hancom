import { useState,useEffect } from "react";

const Users =()=>{
    const [users, setUsers] = useState([])

    useEffect(()=>{
        fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json()).then((data) => setUsers(data)).catch((error)=>console.log("데이터 로딩 실패 : ",error))
    },[])
    return (
        <>
        <ul style={{listStyle:'none'}}>
            {users.map((u)=>(
                <li style={{
                    backgroundColor:'beige',
                    margin:'8px',
                    borderRadius:'17px'
                }} key={u.id}>
                    이름 : {u.name}<br></br>
                    닉네임 : {u.username}<br></br>
                    회사 : {u.company.name}
                
                </li>
            ))}
        </ul>
        </>
    )
}
export default Users