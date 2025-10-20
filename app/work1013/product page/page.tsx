import { Box, Container, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { blue, grey } from '@mui/material/colors';
import Link from 'next/link';

export default function ProductList() {
  // Internal routes for each product page
  const products = [
    { desc: "iPad", price: 20000, href: "/work1013/product1" },
    { desc: "iPhone 8", price: 20000, href: "/work1013/product2" },
    { desc: "iPhone X", price: 30000, href: "/work1013/product3" }
  ];
  // Dark theme styles
  const itemStyle = {
    bgcolor: grey[900], // dark container
    color: grey[50], // light text
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
  };
  const listItemStyle = {
    bgcolor: grey[800], // slightly lighter than container
    color: grey[50],
    borderRadius: 1,
    mb: 1,
    boxShadow: 1,
  };
  return (
    <Container >
    <Box sx={itemStyle} >
      <List subheader="Product list" aria-label="product list" sx={{ color: grey[50] }}>
        {products.map((product) =>
          <ListItem divider key={product.desc} sx={listItemStyle}>
            <Link href={product.href} passHref>
              <ListItemButton component="a" sx={{ p: 1 }}>
                <ListItemText
                  primary={<span style={{ fontWeight: 600, fontSize: '1.1rem', color: grey[50] }}>{product.desc}</span>}
                  secondary={<span style={{ color: blue[300], fontWeight: 500 }}>NT$ {product.price.toString()}</span>}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        )}
      </List>
    </Box>
    </Container>
  );
}
