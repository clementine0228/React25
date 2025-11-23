"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { blue, grey } from '@mui/material/colors';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkUser();

    // Subscribe to auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    } catch (err) {
      console.error('Error checking user:', err);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth/login');
  };

  if (!mounted) return null;

  return (
    <AppBar position="static" sx={{ bgcolor: grey[900], mb: 3 }}>
      <Toolbar>
        <Link href="/work1013" passHref style={{ textDecoration: 'none' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, color: grey[50], cursor: 'pointer', fontWeight: 700 }}
          >
            Work1013
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {!user ? (
            <>
              <Button 
                component={Link} 
                href="/auth/login" 
                variant="outlined" 
                sx={{ color: grey[50], borderColor: grey[700], '&:hover': { borderColor: grey[500] } }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                href="/auth/register" 
                variant="contained" 
                sx={{ bgcolor: blue[700], color: grey[50], '&:hover': { bgcolor: blue[600] } }}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <Typography sx={{ color: grey[400], mr: 2 }}>
                {user.email}
              </Typography>
              <Button 
                onClick={handleLogout} 
                variant="outlined" 
                sx={{ color: grey[50], borderColor: grey[700], '&:hover': { borderColor: grey[500] } }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
