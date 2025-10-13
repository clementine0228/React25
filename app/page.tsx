'use client';
import {useState} from 'react';
import Button from '@mui/material/Button';
import {Card, CardActions, CardHeader, CardContent} from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Home() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count+1);
    alert(count);
  }
  return (
  <Container >
    <Card>
      <CardHeader title="張文卓" />
      <CardContent>
        <Typography variant="body1">資管四甲 411401011</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={handleClick}>Click Me</Button>
      </CardActions>
    </Card>
    <Card>
      <CardHeader title="雷家齊" />
      <CardContent>
        <Typography variant="body1">資管四甲 411401463</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={handleClick}>Click Me</Button>
      </CardActions>
    </Card>
    <Card>
      <CardHeader title="林岳霆" />
      <CardContent>
        <Typography variant="body1">資管四甲 411401449</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={handleClick}>Click Me</Button>
      </CardActions>
    </Card>
    <Card>
      <CardHeader title="林明君" />
      <CardContent>
        <Typography variant="body1">資管四甲 411401578</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={handleClick}>Click Me</Button>
      </CardActions>
    </Card>
  </Container>)
}