import { Card, CardContent, Typography } from '@mui/material'

const Content = () => {
    return (
        <Card sx={{
            width: '600px',
            height: '400px',
            margin: '40px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <CardContent>
                <Typography variant="h4">내용입니다.</Typography>
            </CardContent>
        </Card>
    )
}

export default Content
