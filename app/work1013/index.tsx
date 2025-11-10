"use client";

import { Box, Container, List, ListItem, ListItemText, ListItemButton, Button, Typography } from "@mui/material";
import { blue, grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductList() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);

  const products = [
    { desc: "product", price: 60000, href: "/work1013/productpage" },
    { desc: "customer", price: 20000, href: "/work1013/customer" },
    { desc: "supplier", price: 10000, href: "/work1013/supplier" },
    { desc: "order", price: 1700, href: "/work1013/orderlist" },
  ];

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

  useEffect(() => {
    // check current user on mount
    let mounted = true;
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data?.user ?? null);
      } catch (err) {
        console.error('getUser error', err);
      }
    };
    getUser();

    // subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      // unsubscribe
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ color: grey[50], fontWeight: 700 }}>Work1013</Typography>
        <Box>
          {!user ? (
            <>
              <Button component={Link} href="/auth/login" variant="outlined" sx={{ color: grey[50], borderColor: grey[700], mr: 1 }}>
                Login
              </Button>
              <Button component={Link} href="/auth/register" variant="contained" sx={{ bgcolor: blue[700], color: grey[50], '&:hover': { bgcolor: blue[600] } }}>
                Register
              </Button>
            </>
          ) : (
            <>
              <Typography component="span" sx={{ color: grey[400], mr: 2 }}>{user.user_metadata?.username}</Typography>
              <Button onClick={handleLogout} variant="outlined" sx={{ color: grey[50], borderColor: grey[700] }}>Logout</Button>
            </>
          )}
        </Box>
      </Box>

      <Box sx={itemStyle}>
        <List subheader="Product list" aria-label="product list" sx={{ color: grey[50] }}>
        {products.map((product) =>
          <ListItem divider key={product.desc} sx={listItemStyle}>
            <ListItemButton
              component="a"
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ p: 1 }}
            >
              <ListItemText
                primary={<span style={{ fontWeight: 600, fontSize: '1.1rem', color: grey[50] }}>{product.desc}</span>}
                secondary={<span style={{ color: blue[300], fontWeight: 500 }}>NT$ {product.price.toString()}</span>}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
    </Container>
  );
}