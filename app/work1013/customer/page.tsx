"use client";
import Link from "next/link";
// 引入 CSS Modules 檔案，路徑請確保正確
import styles from './MemberPage.module.css'; 

export default function Member1Page() {
  const customers = ["王小明", "陳美麗", "李志強", "吳佩玲"];

  return (
    // 使用 .container 類別來建立整體卡片框架
    <div className={styles.container}>
      
      {/* 使用 .title 類別美化標題 */}
      <h1 className={styles.title}>顧客列表</h1>
      
      {/* 使用 .customerList 類別作為列表容器 */}
      <ul className={styles.customerList}>
        {customers.map((name, index) => (
          // 使用 .customerItem 類別美化列表項目
          <li key={index} className={styles.customerItem}>
            {name}
          </li>
        ))}
      </ul>
      
      {/* 使用 .homeLink 類別將連結樣式化為按鈕 */}
      <Link href="/work1013" className={styles.homeLink}>
        回首頁
      </Link>
    </div>
  );
}