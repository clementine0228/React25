"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";
import { supabase } from '../../../lib/supabaseClient';

type Product = {
    id?: number;
    name: string;
    price: number;
};

type ProductAddProps = {
    open: boolean;
    product?: Product | null;
    onSaved: (product: Product) => void;
    onDeleted?: (id: number) => void;
    onClose: () => void;
};

export default function ProductAdd({ open, product, onSaved, onDeleted, onClose }: ProductAddProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 當 product prop 改變時，填入表單（用於編輯）
    useEffect(() => {
        if (product) {
            setName(product.name ?? '');
            setPrice(product.price !== undefined ? String(product.price) : '');
        } else {
            setName('');
            setPrice('');
            setError(null);
        }
    }, [product, open]);

    const handleSubmit = async () => {
        // 驗證
        if (!name.trim()) {
            setError('請輸入產品名稱');
            return;
        }
        const priceNum = Number(price);
        if (!price || Number.isNaN(priceNum) || priceNum <= 0) {
            setError('價格必須大於 0');
            return;
        }

        setError(null);
        setSubmitting(true);
        try {
            if (product && product.id) {
                // update
                const { data, error: updateError } = await supabase
                    .from('orderlist')
                    .update({ name: name.trim(), price: priceNum })
                    .eq('id', product.id)
                    .select()
                    .single();
                if (updateError) {
                    console.error('更新失敗:', updateError);
                    setError(updateError.message || '更新失敗');
                } else if (data) {
                    onSaved({ id: data.id, name: data.name, price: data.price });
                    handleClose();
                }
            } else {
                // insert
                const { data, error: insertError } = await supabase
                    .from('orderlist')
                    .insert([{ name: name.trim(), price: priceNum }])
                    .select()
                    .single();
                if (insertError) {
                    console.error('新增失敗:', insertError);
                    setError(insertError.message || '新增失敗');
                } else if (data) {
                    onSaved({ id: data.id, name: data.name, price: data.price });
                    handleClose();
                }
            }
        } catch (err: any) {
            console.error('例外:', err);
            setError(err?.message || '發生例外錯誤');
        } finally {
            setSubmitting(false);
        }
    };

    // 刪除
    const handleDelete = async () => {
        if (!product || !product.id) return;
        setSubmitting(true);
        try {
            const { error: deleteError } = await supabase
                .from('orderlist')
                .delete()
                .eq('id', product.id);
            if (deleteError) {
                console.error('刪除失敗:', deleteError);
                setError(deleteError.message || '刪除失敗');
            } else {
                onDeleted && onDeleted(product.id);
                handleClose();
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.message || '刪除例外');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setName("");
        setPrice("");
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{product ? '編輯訂單' : '新增訂單'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="產品名稱"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        fullWidth
                        error={!!error && !name.trim()}
                    />
                    <TextField
                        label="數量"
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        fullWidth
                        error={!!error && (!price || Number(price) <= 0)}
                    />
                    {error && (
                        <div style={{ color: 'red', fontSize: '0.875rem' }}>{error}</div>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                {product && (
                    <Button onClick={handleDelete} color="error" disabled={submitting}>刪除</Button>
                )}
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={submitting}
                >
                    {submitting ? (product ? '更新中...' : '新增中...') : (product ? '更新' : '新增')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}