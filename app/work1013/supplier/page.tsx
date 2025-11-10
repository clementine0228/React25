"use client";
import { supabase } from '../../../lib/supabaseClient';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ProductEdit, { Product as SupplierProduct } from './supplierEdit';



import React, { useEffect, useState } from "react";
import { Box, Container, List, ListItem, ListItemText, TextField, Button, Stack, Typography, DialogTitle, Dialog, DialogContent, DialogActions, Fab, InputAdornment, IconButton } from "@mui/material";
import { blue, grey } from '@mui/material/colors';

type Product = SupplierProduct;



export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);


  const itemStyle = {
    bgcolor: blue[200],
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
  } as const;
  const listItemStyle = {
    bgcolor: grey[100],
    borderRadius: 1,
    mb: 3,
    boxShadow: 1,
  } as const;
  

  async function handleDelete(id: number) { // 删除
    const { error } = await supabase
      .from("supplier")
      .delete()
      .eq("id", id);

    if (error) console.error(error);

    setRefresh(r => r + 1);
  }

  function openEdit(product: Product) {
    setEditProduct(product);
    setShowEdit(true);
  }
  

  

  // 從 Supabase 抓取產品資
  // 初始載入與 refresh 觸發
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("supplier")
        .select('id, name, price, created_at')
        .order('id', { ascending: true });
      if (error) {
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    }
    fetchProducts();
  }, [refresh]);

   

  return (
    <Container>
      <Box sx={itemStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
           <Typography variant="h6">供应列表</Typography>
        </Stack>
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }} onClick={() => setShowAdd(true)}>
          <AddIcon />
        </Fab>
        <List>
          {products.map((supplier) =>
            <ListItem divider key={supplier.id} sx={listItemStyle}>
              <ListItemText
                primary={<span style={{ color: '#000', fontWeight: 600, fontSize: '1.1rem' }}>{supplier.name}</span>}
                secondary={<span style={{ color: blue[700], fontWeight: 500 }}>NT$ {supplier.price.toString()}</span>}
              />

              <Stack direction="row" spacing={1}>
                <IconButton edge="end" aria-label="edit" onClick={() => openEdit(supplier)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(supplier.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </ListItem>
          )}
           
         
        </List>
        <ProductAdd open={showAdd} onClose={() => setShowAdd(false)} onAdd={() => setRefresh(r => r + 1)} />
        <ProductEdit
          open={showEdit}
          product={editProduct}
          onClose={() => { setShowEdit(false); setEditProduct(null); }}
          onEdit={() => { setShowEdit(false); setEditProduct(null); setRefresh(r => r + 1); }}
        />
      </Box>
    </Container>
  );

}


  // 內部元件：新增產品表單
  type ProductAddProps = {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
};



  

   function ProductAdd({ open, onClose, onAdd }: ProductAddProps) {
  const [form, setForm] = useState({ name: '', price: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!form.name.trim()) {
      setError('請輸入產品名稱');
      return;
    }
    const n = Number(form.price);
    if (!form.price || Number.isNaN(n) || n <= 0) {
      setError('價格需為大於 0 的數字');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('supplier') // 改成 supplier 名
      .insert([{ name: form.name.trim(), price: n }]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setForm({ name: '', price: '' });
      onAdd();   // 通知父元件刷新
      onClose();
    }
  }

  

  function handleDialogClose() {
    setError(null);
    setForm({ name: '', price: '' });
    onClose();
  }

  

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>新增供应商</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="供应名称"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            fullWidth
            autoFocus
            placeholder="例如：蘋果"
          />
          <TextField
            label="数量"
            type="number"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            InputProps={{ startAdornment: <InputAdornment position="start">NT$</InputAdornment> }}
            sx={{ maxWidth: 240 }}
          />
          {error && <Typography color="error" sx={{ pt: 1 }}>{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end' }}>
        <Button onClick={handleDialogClose}>取消</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ ml: 1 }}>
          新增
        </Button>
      </DialogActions>
    </Dialog>
  );
}
