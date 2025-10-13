import { Box, Container, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { blue, grey } from '@mui/material/colors';

export default function ProductList() {
  // Add `url` to each product so it can link to its webpage.
  const products = [
    { desc: "product", price: 20000, href: "product.tsx" },
    { desc: "customer", price: 20000, href: "customer.tsx" },
    { desc: "supplier", price: 30000, href: "supplier.tsx" },
    { desc: "order", price: 40000, href: "order.tsx" },
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
            <ListItemButton
              component="a"
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ p: 1 }}
            >
              <ListItemText
                primary={<span style={{ fontWeight: 600, fontSize: '1.1rem', color: grey[50] }}>{product.desc}</span>}
                secondary={<span style={{ color: blue[300], fontWeight: 500 }}>NT$ {product.price.toString()}</span>}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
    </Container>
  );
}
