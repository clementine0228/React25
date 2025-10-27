"use client";

import { Box, Container, List, ListItem, ListItemText, ListItemButton, TextField, Button } from "@mui/material";
import { blue, grey } from '@mui/material/colors';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductList() {
  const [newProduct, setNewProduct] = useState({ desc: '', price: '' });
  // Internal routes for each product page
  const [products, setProducts] = useState([
    { desc: "iPad", price: 20000, href: "/work1013/product1" },
    { desc: "iPhone 8", price: 20000, href: "/work1013/product2" },
    { desc: "iPhone X", price: 30000, href: "/work1013/product3" }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.desc && newProduct.price) {
      setProducts(prev => [...prev, {
        desc: newProduct.desc,
        price: Number(newProduct.price),
        href: `/work1013/product${prev.length + 1}`
      }]);
      setNewProduct({ desc: '', price: '' }); // Reset form
    }
  };

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
    <Container>
      <Box sx={{ ...itemStyle, mb: 2 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <TextField
            name="desc"
            label="Product Description"
            value={newProduct.desc}
            onChange={handleInputChange}
            variant="filled"
            size="small"
            sx={{
              flex: 2,
              '& .MuiFilledInput-input': { color: grey[50] },
              '& .MuiInputLabel-root': { color: grey[400] },
              '& .MuiFilledInput-root': { bgcolor: grey[800] }
            }}
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            variant="filled"
            size="small"
            sx={{
              flex: 1,
              '& .MuiFilledInput-input': { color: grey[50] },
              '& .MuiInputLabel-root': { color: grey[400] },
              '& .MuiFilledInput-root': { bgcolor: grey[800] }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: blue[700], color: grey[50], '&:hover': { bgcolor: blue[600] } }}
          >
            Add Product
          </Button>
        </form>
      </Box>
      <Box sx={itemStyle}>
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
