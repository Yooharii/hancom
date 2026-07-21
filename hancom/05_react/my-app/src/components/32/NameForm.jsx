import { useState } from 'react'

const NameForm = () => { 
    const [name, setName] =useState('')
    return(
        <div style={{
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
        }}>
            <input style={{
                fontSize:'22px',
                padding:'10px',
                textAlign:'center',
                width:'180px',
                height:'30px',
                margin:'10px'
            }} value={name} onChange={(e) => setName(e.target.value)}/>

            <p style ={{
                fontSize : '18px',
                color:'blue',
             }}>
                안녕,{name}</p>
        </div>
    )
}
export default NameForm