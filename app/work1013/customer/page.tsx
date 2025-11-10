"use client";

import { Box, Container, List, ListItem, ListItemText, ListItemButton, TextField, Button } from "@mui/material";
import { green, grey } from '@mui/material/colors';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface Customer { // 介面名稱改為 Customer (顧客)
  id: number;
  name: string;
  created_at: string;
  href?: string;
}

export default function Member1Page() { // 維持原元件名稱
  // 狀態改為處理顧客資料，並移除價格欄位
  const [newCustomer, setNewCustomer] = useState({ name: '' });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCustomers(); // 呼叫新的資料獲取函數
  }, []);

  const fetchCustomers = async () => { // 函數名稱改為 fetchCustomers
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer') // 表格名稱改為 'customer'
        .select('id, name, created_at') // 移除 price 欄位
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }

      if (data) {
        setCustomers(data.map(customer => ({
          ...customer,
          href: `/work1013/member${customer.id}` // 連結路徑調整為 member
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
    if (newCustomer.name) { // 僅檢查名稱
      try {
        const { error } = await supabase
          .from('customer') // 表格名稱改為 'customer'
          .insert([
            {
              name: newCustomer.name,
            }
          ]);

        if (error) {
          console.error('Error inserting customer:', error);
          return;
        }

        fetchCustomers();
        setNewCustomer({ name: '' }); // 重設名稱
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Dark theme styles (保持不變)
 const itemStyle = {
    bgcolor: grey[900], 
    color: grey[50], 
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
  };
  const listItemStyle = {
    bgcolor: grey[800], 
    color: grey[50],
    borderRadius: 1,
    mb: 1,
    boxShadow: 1,
  };
  if (!mounted) {
    return null;
  }

  return (
    // ✨ 在這裡新增 sx={{ pt: 4 }} 來增加頂部內邊距，將內容往下推
    <Container sx={{ pt: 4 }}> 
      <Box sx={{ ...itemStyle, mb: 2 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <TextField
            name="name"
            label="Customer Name"
            value={newCustomer.name}
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
          <Button
            type="submit"
            variant="contained"
            // 根據您的程式碼，使用 green 的顏色變數
            sx={{ bgcolor: green[700], color: grey[50], '&:hover': { bgcolor: green[600] } }}
          >
            Add Customer
          </Button>
        </form>
      </Box>
      <Box sx={itemStyle}>
        <List subheader="Customer List" aria-label="customer list" sx={{ color: grey[50] }}>
          {loading ? (
            <ListItem>
              <ListItemText primary={<span style={{ color: grey[50] }}>Loading customers...</span>} />
            </ListItem>
          ) : customers.length === 0 ? (
            <ListItem>
              <ListItemText primary={<span style={{ color: grey[50] }}>No customers found</span>} />
            </ListItem>
          ) : customers.map((customer) =>
            <ListItem divider key={customer.id} sx={listItemStyle}>
              <Link href={customer.href || `/work1013/member${customer.id}`} passHref>
                <ListItemButton component="a" sx={{ p: 1 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 600, fontSize: '1.1rem', color: grey[50] }}>{customer.name}</span>}
                    secondary={
                      <span style={{ color: grey[400], fontSize: '0.8rem' }}>
                        Added: {new Date(customer.created_at).toLocaleDateString()}
                      </span>
                    }
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