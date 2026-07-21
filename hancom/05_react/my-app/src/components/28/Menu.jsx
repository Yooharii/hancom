import { Button, Box } from '@mui/material'

const Menu = () => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
             }}>
            <Button variant="outlined">1번</Button>
            <Button variant="outlined">2번</Button>
            <Button variant="outlined">3번</Button>
        </Box>
    )
}
export default Menu
