import{useState} from 'react'

const Counter = () =>{
    const [ count, setCounter] = useState(0)

    const btnStyle = {
        backgroundColor:'lightblue',
        width : '60px',
        height : '60px',
        fontSize : '18px',
        textAlign : 'center',
        cursor : 'pointer',
        border : 'none',
        borderRadius : '8px',
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '12px',
        }}>
            <button style={btnStyle} onClick={() => setCounter(c => c - 1)}>-1</button>

                <p style={{
                    background:'red',
                    width : '60px',
                    height : '60px',
                    fontSize : '20px',
                    textAlign : 'center',
                    lineHeight : '60px',
                    margin : 0,
                    borderRadius : '8px',
                    color : 'white',
                }}>{count}</p>

            <button style={btnStyle} onClick={() => setCounter(c => c + 1)}>+1</button>
            <button style={btnStyle} onClick={() => setCounter(0)}>Reset</button>
        </div>
    )
}

export default Counter
