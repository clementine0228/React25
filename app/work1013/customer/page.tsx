"use client";
import Link from "next/link";


export default function Member1Page() {
  const customers = ["王小明", "陳美麗", "李志強", "吳佩玲"];

  return (
    <div className="container">
      <h1>顧客列表</h1>
      <ul>
        {customers.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
      <Link href="/work1013">回首頁</Link>
    </div>
  );
}
