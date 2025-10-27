"use client";

import React, { useState } from "react";
import { Box, Container, List, ListItem, ListItemText, TextField, Button, Stack, Typography } from "@mui/material";
import { blue } from '@mui/material/colors';

type Product = { desc: string; price: number };

export default function ProductList() {
  // 產品只存在本地 state 陣列
  const [products, setProducts] = useState<Product[]>([
    { desc: "iPad", price: 200 },
    { desc: "iPhone 8", price: 500 },
    { desc: "iPhone X", price: 1000 },
  ]);
  const [showAdd, setShowAdd] = useState(false);

  const itemStyle = {
    bgcolor: blue[50],
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
  } as const;
  const listItemStyle = {
    bgcolor: blue[100],
    borderRadius: 1,
    mb: 1,
    boxShadow: 1,
  } as const;


  function handleAddProduct(newItem: Product) {
    setProducts((p) => [newItem, ...p]);
  }

  return (
    <Container>
      <Box sx={itemStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">
            {showAdd ? '新增產品' : '產品列表'}
          </Typography>
          <Button variant="outlined" onClick={() => setShowAdd(s => !s)}>
            {showAdd ? '回到列表' : '新增產品'}
          </Button>
        </Stack>
        {showAdd ? (
          <AddProductForm onAdd={item => { handleAddProduct(item); setShowAdd(false); }} />
        ) : (
          <List subheader="Product list" aria-label="product list">
            {products.map((product, idx) =>
              <ListItem divider key={`${product.desc}-${product.price}-${idx}`} sx={listItemStyle}>
                <ListItemText
                  primary={<span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{product.desc}</span>}
                  secondary={<span style={{ color: blue[700], fontWeight: 500 }}>Amount:{product.price.toString()}</span>}
                />
              </ListItem>
            )}
          </List>
        )}
      </Box>
    </Container>
  );

  // 內部元件：新增產品表單
  function AddProductForm({ onAdd }: { onAdd: (item: Product) => void }) {
    const [form, setForm] = useState({ desc: '', price: '' });
    const [error, setError] = useState<string | null>(null);

    function handleSubmit() {
      setError(null);
      if (!form.desc.trim()) {
        setError('請輸入產品名稱');
        return;
      }
      const n = Number(form.price);
      if (!form.price || Number.isNaN(n) || n <= 0) {
        setError('訂單數量需為大於 0 的數字');
        return;
      }
      onAdd({ desc: form.desc.trim(), price: n });
      setForm({ desc: '', price: '' });
    }

    return (
      <>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="產品名稱" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} fullWidth />
          <TextField label="訂單數量" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} sx={{ width: 160 }} />
          <Button variant="contained" onClick={handleSubmit}>新增</Button>
        </Stack>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      </>
    );
  }
}