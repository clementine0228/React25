"use client";

import React, { useEffect, useState } from "react";
import ProductAdd from "./orderAdd";
import { Box, Container, List, ListItem, ListItemText, Stack, Typography, Fab, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { blue } from '@mui/material/colors';
import { supabase } from '../../../lib/supabaseClient';

type Product = { id: number; name: string; price: number };

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  // fetch function 可重用
  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orderlist")
        .select()
        .order('id', { ascending: true });
      if (error) {
        console.error('讀取失敗:', error);
        setProducts([]);
        setError(error.message || '讀取失敗');
      } else {
        setProducts(data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '例外錯誤');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  return (
    <Container>
      <Box sx={itemStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">訂單列表</Typography>
        </Stack>
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }} onClick={() => { setSelected(null); setShowAdd(true); }}>
          <AddIcon />
        </Fab>
        <List subheader="Order list" aria-label="order list">
          {products.map((product) =>
            <ListItem divider key={product.id} sx={listItemStyle}
              secondaryAction={(
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => { setSelected(product); setShowAdd(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={async () => {
                    // 直接呼叫刪除 API
                    const confirmed = confirm('確定要刪除此筆資料嗎？');
                    if (!confirmed) return;
                    const { error } = await supabase.from('orderlist').delete().eq('id', product.id);
                    if (error) {
                      console.error('刪除失敗', error);
                      alert('刪除失敗：' + error.message);
                    } else {
                      // 重新載入
                      fetchProducts();
                    }
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            >
              <ListItemText
                primary={<span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{product.name}</span>}
                secondary={<span style={{ color: blue[700], fontWeight: 500 }}>Amount: {product.price.toString()}</span>}
              />
            </ListItem>
          )}
        </List>
        <ProductAdd open={showAdd} product={selected} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); fetchProducts(); }} onDeleted={() => { setShowAdd(false); fetchProducts(); }} />
      </Box>
    </Container>
  );

}