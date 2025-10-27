"use client";
import { useState } from 'react';
import Link from "next/link";
import styles from './MemberPage.module.css'; // 請確保路徑正確

export default function Member1Page() {
  const [customers, setCustomers] = useState([
    "王小明", 
    "陳美麗", 
    "李志強", 
    "吳佩玲"
  ]);

  const [newCustomerName, setNewCustomerName] = useState("");

  const handleAddCustomer = (e) => {
    e.preventDefault();

    if (newCustomerName.trim() === "") {
      alert("請輸入顧客姓名！");
      return;
    }

    setCustomers((prevCustomers) => [
      ...prevCustomers,
      newCustomerName.trim()
    ]);

    setNewCustomerName("");
  };

  return (
    <div className={styles.container}>
      
      <h1 className={styles.title}>顧客列表 ({customers.length} 位)</h1>
      
      {/* 新增資料表單 */}
      <form onSubmit={handleAddCustomer} className={styles.addForm}>
        <input
          type="text"
          placeholder="輸入新的顧客姓名..."
          value={newCustomerName}
          onChange={(e) => setNewCustomerName(e.target.value)}
          className={styles.inputField}
        />
        <button type="submit" className={styles.addButton}>
          新增顧客
        </button>
      </form>
      
      {/* 顧客列表 */}
      <ul className={styles.customerList}>
        {customers.map((name, index) => (
          <li key={index} className={styles.customerItem}>
            {name}
          </li>
        ))}
      </ul>
      
      {/* 回首頁連結 */}
      <div className={styles.centerLink}>
        <Link href="/work1013" className={styles.homeLink}>
          回首頁
        </Link>
      </div>
    </div>
  );
}