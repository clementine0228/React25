"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Container, List, ListItem, ListItemText,
  TextField, Button, Stack, Typography
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Product = { desc: string; price: number };

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  // 讀取 Supabase 資料
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("orderlist").select();
    if (error) {
      console.error(error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
  };

  // 元件掛載時自動載入資料
  useEffect(() => {
    fetchProducts();
  }, []);

  // 新增產品
  function handleAddProduct(newItem: Product) {
    setProducts((prev) => [newItem, ...prev]);
  }

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

  return (
    <Container>
      <Box sx={itemStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">
            {showAdd ? "新增產品" : "產品列表"}
          </Typography>
          <Button variant="outlined" onClick={() => setShowAdd((s) => !s)}>
            {showAdd ? "回到列表" : "新增產品"}
          </Button>
        </Stack>

        {showAdd ? (
          <AddProductForm onAdd={(item) => { handleAddProduct(item); setShowAdd(false); }} />
        ) : (
          <List subheader="Product list" aria-label="product list">
            {products.map((product, idx) => (
              <ListItem divider key={`${product.desc}-${product.price}-${idx}`} sx={listItemStyle}>
                <ListItemText
                  primary={<span style={{ fontWeight: 600, fontSize: "1.1rem" }}>{product.desc}</span>}
                  secondary={<span style={{ color: blue[700], fontWeight: 500 }}>Amount: {product.price}</span>}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

// 🔽 新增產品表單元件
function AddProductForm({ onAdd }: { onAdd: (item: Product) => void }) {
  const [form, setForm] = useState({ desc: "", price: "" });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    setError(null);
    if (!form.desc.trim()) {
      setError("請輸入產品名稱");
      return;
    }
    const n = Number(form.price);
    if (!form.price || Number.isNaN(n) || n <= 0) {
      setError("訂單數量需為大於 0 的數字");
      return;
    }
    onAdd({ desc: form.desc.trim(), price: n });
    setForm({ desc: "", price: "" });
  }

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="產品名稱"
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
          fullWidth
        />
        <TextField
          label="訂單數量"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          sx={{ width: 160 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          新增
        </Button>
      </Stack>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    </>
  );
}
