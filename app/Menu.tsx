'use client';

import { useRouter } from 'next/navigation';
import { AppBar, Button, Toolbar } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function Menu() {
  const router = useRouter()
    const pathname = usePathname()

  return (
    //  position="static" 显示在页面顶端
    <AppBar position="fixed"> 
      <Toolbar>
        <Button color="inherit" variant={pathname === "/" ? "outlined" : "text"} onClick={() => router.push("/work1013")}>主頁面</Button>
        <Button color="inherit" variant={pathname === "/product" ? "outlined" : "text"} onClick={() => router.push("/product")}>產品管理</Button> 
      </Toolbar>
    </AppBar>
  );
}