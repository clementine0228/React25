import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { grey } from '@mui/material/colors';

export default function Product1Page() {
  return (
    <Container>
      <Box sx={{ bgcolor: grey[900], color: grey[50], p: 4, borderRadius: 2, mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Product 1 — iPad</Typography>
        <Typography sx={{ mb: 2 }}>Detailed page for iPad. Price: NT$ 20,000.</Typography>
        <Link href="/work1013" passHref>
          <Button variant="contained" sx={{ mt: 2 }}>Back to products</Button>
        </Link>
      </Box>
    </Container>
  );
}
