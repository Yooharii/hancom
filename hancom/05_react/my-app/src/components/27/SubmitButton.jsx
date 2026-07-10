import {useState} from 'react'
import {Button, Card,TextField} from '@mui/material'

const SubmitButton = () =>{
    const [value, setValue] = useState('')
//text 박스에 들어가는 값을 배열로 지정하여 값 넣어주기
    return(
        <>
        <Button variant="contained" onClick={()=>alert(value)}>
            눌러주세요!
        </Button>
        <Card>
            밑에 입력하세요.
        </Card>
        <TextField value={value} onChange={(e)=>setValue(e.target.value)}></TextField>
        </>
    )
}
export default SubmitButton