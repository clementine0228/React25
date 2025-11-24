"use client";

import React, { useEffect, useState } from "react";
import ProductAdd from "./orderAdd";
import { Box, Container, List, ListItem, ListItemText, Stack, Typography, Fab, IconButton, Alert } from "@mui/material";
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
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
    checkUser();
    fetchProducts();
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    } catch (err) {
      console.error('checkUser error', err);
      setUser(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!user) {
      alert('You must be logged in to delete a product');
      return;
    }
    const ok = confirm('確定要刪除此筆資料嗎？');
    if (!ok) return;
    try {
      const { error } = await supabase.from('orderlist').delete().eq('id', id);
      if (error) {
        console.error('刪除失敗', error);
        alert('刪除失敗：' + error.message);
      } else {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert('刪除發生錯誤');
    }
  };

  return (
    <Container>
      <Box sx={itemStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">訂單列表</Typography>
        </Stack>
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }} onClick={() => { if (!user) { alert('You must be logged in to add a product'); return; } setSelected(null); setShowAdd(true); }} disabled={!user}>
          <AddIcon />
        </Fab>
        <List subheader="Order list" aria-label="order list">
          {products.map((product) =>
            <ListItem divider key={product.id} sx={listItemStyle}
              secondaryAction={(
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => { if (!user) { alert('You must be logged in to edit a product'); return; } setSelected(product); setShowAdd(true); }} disabled={!user}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(product.id)} disabled={!user}>
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
        {!mounted ? null : (
          <>
            {!user && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You must be logged in to add, edit, or delete products. Please log in to perform these actions.
              </Alert>
            )}
            <ProductAdd open={showAdd} product={selected} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); fetchProducts(); }} onDeleted={() => { setShowAdd(false); fetchProducts(); }} />
          </>
        )}
      </Box>
    </Container>
  );

}