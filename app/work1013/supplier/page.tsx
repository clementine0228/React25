import { Box, Container, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { grey, purple } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Link from 'next/link';



export default function ProductList() { 
  const suppliers = [
    { desc: "少林寺好食材", supp: '供應:5000', href: "/supplier/test" },
    { desc: "懦夫救星", supp: '供應:1000' },
    { desc: "唐牛工業", supp: '供應:4000' }
  ];
  const itemStyle = {
    bgcolor: purple[300],
    borderRadius: 2,
    boxShadow: 3,
    p: 20,
    
  };
  const listItemStyle = {
    bgcolor: purple[100],
    borderRadius: 3,
    mb: 1,
    boxShadow: 10,
  };
  return (
    <Container >
    <Box sx={itemStyle} >
      
      <List subheader="供應商"  aria-label="product list" >
        {suppliers.map((supplier) =>
        
        
          <ListItem divider key={supplier.desc} sx={listItemStyle}>
           
            <ListItemText
              primary={<span style={{ color:grey[200], fontWeight: 600, fontSize: '2.5rem' }}>{supplier.desc}</span>}
              secondary={<span style={{ color: purple[700], fontWeight: 500 }}>NT$ {supplier.supp}</span>}
            />
          </ListItem>
        )}
      </List>
       <Link href="/work1013" passHref>
          <Button variant="contained" sx={{ mt: 2 }}>Back to page</Button>
        </Link>
    </Box>
    </Container>
  );
}
