"use client"

import styles from "@/components/stock-section.module.css"

export default function StockSection({ onLoadStock, isLoading }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>📦</div>
        <div className={styles.text}>
          <h2>View Stock</h2>
          <p>Check your current inventory</p>
        </div>
      </div>

      <button className={styles.button} onClick={onLoadStock} disabled={isLoading}>
        {isLoading ? "Loading..." : "Load Stock"}
      </button>
    </div>
  )
}
