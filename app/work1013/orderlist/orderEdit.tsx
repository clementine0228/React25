"use client";

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Typography } from "@mui/material";
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export type Product = { id: number; name: string; price: number };

interface ProductEditProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProductEdit({ open, product, onClose, onEdit }: ProductEditProps) {
  const [form, setForm] = useState({ name: product?.name || '', price: product?.price?.toString() || '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setForm({ name: product?.name || '', price: product?.price?.toString() || '' });
    setError(null);
  }, [product, open]);

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
      .from('product')
      .update({ name: form.name.trim(), price: n })
      .eq('id', product?.id);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onEdit();
      onClose();
    }
  }

  function handleDialogClose() {
    setError(null);
    setForm({ name: product?.name || '', price: product?.price?.toString() || '' });
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>編輯產品</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
          <TextField label="產品名稱" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth autoFocus />
          <TextField label="價格" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} sx={{ width: 160 }} />
          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>取消</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>儲存</Button>
      </DialogActions>
    </Dialog>
  );
}
