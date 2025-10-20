import { Box, Container, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { grey, purple } from '@mui/material/colors';




export default function ProductList() { 
  const products = [
    { desc: "少林寺好食材", supp: '供應:5000' },
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
        {products.map((product) =>
          <ListItem divider key={product.desc} sx={listItemStyle}>
            <ListItemText
              primary={<span style={{ color:grey[200], fontWeight: 600, fontSize: '2.5rem' }}>{product.desc}</span>}
              secondary={<span style={{ color: purple[700], fontWeight: 500 }}>NT$ {product.supp}</span>}
            />
          </ListItem>
        )}
      </List>
    </Box>
    </Container>
  );
}
