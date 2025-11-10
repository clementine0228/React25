"use client";

import { Box, Container, List, ListItem, ListItemText, ListItemButton, TextField, Button, IconButton } from "@mui/material";
import { blue, grey } from '@mui/material/colors';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  href?: string;
}

export default function ProductList() {
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // edit/delete states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ name: '', price: '' });
  const [actionLoading, setActionLoading] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditValues({ name: product.name, price: product.price.toString() });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: '', price: '' });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id: number) => {
    if (!editValues.name || !editValues.price) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('product')
        .update({ name: editValues.name, price: Number(editValues.price) })
        .eq('id', id);
      if (error) {
        console.error('Error updating product:', error);
      } else {
        await fetchProducts();
        cancelEdit();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('product')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting product:', error);
      } else {
        await fetchProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product')
        .select('id, name, price, created_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      if (data) {
        setProducts(data.map(product => ({
          ...product,
          href: `/work1013/product${product.id}`
        })));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      try {
        const { error } = await supabase
          .from('product')
          .insert([
            { 
              name: newProduct.name,
              price: Number(newProduct.price)
            }
          ]);

        if (error) {
          console.error('Error inserting product:', error);
          return;
        }

        // Refresh the products list
        fetchProducts();
        
        // Reset form
        setNewProduct({ name: '', price: '' });
      } catch (error) {
        console.error('Error:', error);
      }
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
  if (!mounted) {
    return null;
  }
  
  return (
    <Container>
      <Box sx={{ ...itemStyle, mb: 2 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <TextField
                name="name"
                label="Product Name"
                value={newProduct.name}
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
            {loading ? (
              <ListItem>
                <ListItemText primary={<span style={{ color: grey[50] }}>Loading products...</span>} />
              </ListItem>
            ) : products.length === 0 ? (
              <ListItem>
                <ListItemText primary={<span style={{ color: grey[50] }}>No products found</span>} />
              </ListItem>
            ) : products.map((product) => (
              <ListItem divider key={product.id} sx={listItemStyle}>
                {editingId === product.id ? (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
                    <TextField name="name" value={editValues.name} onChange={handleEditChange} size="small" sx={{ flex: 2, '& .MuiFilledInput-input': { color: grey[50] } }} variant="filled" />
                    <TextField name="price" value={editValues.price} onChange={handleEditChange} size="small" sx={{ width: 120, '& .MuiFilledInput-input': { color: grey[50] } }} variant="filled" type="number" />
                    <IconButton onClick={() => saveEdit(product.id)} color="primary" disabled={actionLoading} sx={{ color: blue[300] }}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={cancelEdit} disabled={actionLoading} sx={{ color: grey[400] }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Link href={product.href || `/work1013/product${product.id}`} passHref>
                      <ListItemButton component="a" sx={{ p: 1 }}>
                        <ListItemText
                          primary={<span style={{ fontWeight: 600, fontSize: '1.1rem', color: grey[50] }}>{product.name}</span>}
                          secondary={
                            <div>
                              <span style={{ color: blue[300], fontWeight: 500, display: 'block' }}>NT$ {product.price.toString()}</span>
                              <span style={{ color: grey[400], fontSize: '0.8rem' }}>
                                Added: {new Date(product.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          }
                        />
                      </ListItemButton>
                    </Link>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton onClick={() => startEdit(product)} sx={{ color: grey[400] }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product.id)} sx={{ color: grey[400] }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </>
                )}
              </ListItem>
            ))}
            </List>
          </Box>
    </Container>
  );
}