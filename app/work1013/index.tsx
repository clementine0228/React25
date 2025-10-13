import { Box, Container, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { blue, grey } from '@mui/material/colors';

<<<<<<< HEAD
export default function work1013() {
  // Add `url` to each product so it can link to its webpage.
  const products = [
    { desc: "顧客列表", url: "https://www.apple.com/ipad/" },
    { desc: "廠商列表", url: "https://www.apple.com/iphone-8/" },
    { desc: "訂單列表",  url: "https://www.apple.com/iphone-x/" },
    { desc: "聯絡列表",  url: "https://www.apple.com/iphone-x/" },
=======
export default function ProductList() {
  // Add `url` to each product so it can link to its webpage.
  const products = [
    { desc: "product", price: 20000, href: "product.tsx" },
    { desc: "customer", price: 20000, href: "customer.tsx" },
    { desc: "supplier", price: 30000, href: "supplier.tsx" },
    { desc: "order", price: 40000, href: "order.tsx" },
>>>>>>> 6a5ae9f2d7db49d54652f42e51040dfbb4b86b89
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
<<<<<<< HEAD
              href={product.url}
=======
              href={product.href}
>>>>>>> 6a5ae9f2d7db49d54652f42e51040dfbb4b86b89
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 6a5ae9f2d7db49d54652f42e51040dfbb4b86b89
