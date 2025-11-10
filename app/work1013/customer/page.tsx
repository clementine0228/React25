"use client";

import { Box, Container, List, ListItem, ListItemText, ListItemButton, TextField, Button, Typography, IconButton } from "@mui/material";
// 引入圖示和顏色
import DeleteIcon from '@mui/icons-material/Delete'; 
import EditIcon from '@mui/icons-material/Edit';
import { green, grey, red, blue } from '@mui/material/colors';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
// 移除 Session 相關的導入

interface Customer { 
  id: number;
  name: string;
  created_at: string;
  href?: string;
}

export default function Member1Page() { 
  const [newCustomer, setNewCustomer] = useState({ name: '' });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  // 移除 [session, setSession] 狀態
  
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editName, setEditName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 移除 Session 相關的 fetch 和 listener
    fetchCustomers();

    // 由於移除了訂閱，這裡的 return 清理函數也變得不必要，但保留它無害
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer')
        .select('id, name, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }

      if (data) {
        setCustomers(data.map(customer => ({
          ...customer,
          href: `/work1013/member${customer.id}`
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
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomer.name) {
      try {
        const { error } = await supabase
          .from('customer')
          .insert([{ name: newCustomer.name }]);

        if (error) {
          console.error('Error inserting customer:', error);
          alert(`新增失敗：${error.message || '請檢查資料庫設定。'}`);
          return;
        }

        fetchCustomers();
        setNewCustomer({ name: '' });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDelete = async (customerId: number) => {
    // ✨ 權限檢查已移除。未登入用戶點擊也會嘗試刪除。
    if (!window.confirm("確定要刪除這位顧客嗎？此操作不可逆！")) return;
    
    try {
        setLoading(true);
        const { error } = await supabase
            .from('customer')
            .delete()
            .eq('id', customerId); 

        if (error) {
            console.error('Error deleting customer:', error);
            // 提醒用戶刪除失敗，這可能是因為 RLS 權限不足
            alert(`刪除失敗: ${error.message || '請檢查後端權限設定 (RLS)。'}`);
            return;
        }

        setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editName) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('customer')
        .update({ name: editName }) 
        .eq('id', editingCustomer.id);

      if (error) {
        console.error('Error updating customer:', error);
        alert(`修改失敗：${error.message || '請檢查後端權限設定 (RLS)。'}`);
        return;
      }
      
      setCustomers(prev => prev.map(c => 
          c.id === editingCustomer.id ? { ...c, name: editName } : c
      ));

      setShowEditModal(false);
      setEditingCustomer(null);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemStyle = {
    bgcolor: grey[900], 
    color: grey[50], 
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
  };
  const listItemStyle = {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    bgcolor: grey[800], 
    color: grey[50],
    borderRadius: 1,
    mb: 1,
    boxShadow: 1,
  };
  if (!mounted) {
    return null;
  }
  
  const startEdit = (customer: Customer) => {
      setEditingCustomer(customer);
      setEditName(customer.name);
      setShowEditModal(true);
  };

  return (
    <Container sx={{ pt: 4 }}> 
      {/* 新增表單 */}
      <Box sx={{ ...itemStyle, mb: 2 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <TextField
            name="name"
            label="Customer Name"
            value={newCustomer.name}
            onChange={handleInputChange}
            variant="filled"
            size="small"
            sx={{ flex: 2, '& .MuiFilledInput-input': { color: grey[50] }, '& .MuiInputLabel-root': { color: grey[400] }, '& .MuiFilledInput-root': { bgcolor: grey[800] } }}
          />
          <Button type="submit" variant="contained" sx={{ bgcolor: green[700], color: grey[50], '&:hover': { bgcolor: green[600] } }}>
            Add Customer
          </Button>
        </form>
      </Box>

      <Box sx={itemStyle}>
        {/* 刪除權限已移除，所以移除提示訊息 */}
        
        <List subheader="Customer List" aria-label="customer list" sx={{ color: grey[50] }}>
          {customers.map((customer) =>
            <ListItem divider key={customer.id} sx={listItemStyle}>
              {/* 連結和文字區域 */}
              <Link href={customer.href || `/work1013/member${customer.id}`} passHref style={{ flexGrow: 1, textDecoration: 'none' }}>
                <ListItemButton component="a" sx={{ p: 1, width: '100%' }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 600, fontSize: '1.1rem', color: grey[50] }}>{customer.name}</span>}
                    secondary={<span style={{ color: grey[400], fontSize: '0.8rem' }}>Added: {new Date(customer.created_at).toLocaleDateString()}</span>}
                  />
                </ListItemButton>
              </Link>
              
              {/* 修改按鈕 (始終顯示) */}
              <IconButton 
                  edge="end" 
                  aria-label="edit" 
                  sx={{ mr: 1, color: blue[400], '&:hover': { color: blue[500] } }} 
                  onClick={() => startEdit(customer)}
              >
                  <EditIcon />
              </IconButton>
              
              {/* ✨ 刪除按鈕 (始終顯示，權限檢查已移除) */}
              <IconButton 
                edge="end" 
                aria-label="delete" 
                onClick={() => handleDelete(customer.id)}
                disabled={loading}
                sx={{ color: red[400], '&:hover': { color: red[500] } }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          )}
        </List>
      </Box>
      
      {/* 編輯介面/Modal */}
      {showEditModal && editingCustomer && (
          <Box sx={{
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              ...itemStyle, 
              width: { xs: '90%', sm: 400 },
              border: `2px solid ${blue[500]}`,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
          }}>
              <Typography variant="h6" sx={{ color: blue[300] }}>
                  修改顧客名稱 (ID: {editingCustomer.id})
              </Typography>
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <TextField
                      label="New Customer Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      variant="filled"
                      size="medium"
                      fullWidth
                      sx={{ '& .MuiFilledInput-input': { color: grey[50] }, '& .MuiInputLabel-root': { color: grey[400] }, '& .MuiFilledInput-root': { bgcolor: grey[800] } }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button 
                          variant="outlined" 
                          onClick={() => setShowEditModal(false)}
                          disabled={loading}
                          sx={{ color: grey[400], borderColor: grey[600] }}
                      >
                          取消
                      </Button>
                      <Button 
                          type="submit" 
                          variant="contained" 
                          disabled={loading || !editName.trim()}
                          sx={{ bgcolor: blue[700], color: grey[50], '&:hover': { bgcolor: blue[600] } }}
                      >
                          {loading ? '儲存中...' : '儲存修改'}
                      </Button>
                  </Box>
              </form>
          </Box>
      )}
    </Container>
  );
}