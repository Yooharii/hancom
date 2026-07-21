import {AppBar} from '@mui/material'



const Header= () =>{
    return(
        <>
            <AppBar position="static" style={
                {backgroundColor : 'lightGreen',
                 color : 'white',
                 padding : '20px',
                 fontSize:'30px',
                 textAlign:'left',
                }
            }>
                <p>Header</p>
             </AppBar>
        </>
    )
}

export default Header