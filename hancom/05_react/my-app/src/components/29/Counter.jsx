import{useState} from 'react'

const Counter = () =>{
    const [ count, setCounter] = useState(0)
    return (
        <button onClick={() => setCounter(c => c+ 1)}>
            {count}번 눌렀어요.
        </button>
    )
}

export default Counter