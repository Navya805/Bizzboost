"use client"

import styles from "@/components/stock-list.module.css"

export default function StockList({ data, isLoading }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>
          {isLoading ? "Loading inventory..." : "No items yet. Load stock to view inventory."}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Current Inventory</h3>
      <div className={styles.list}>
        {data.map((item) => (
          <div key={item._id} className={styles.item}>
            <div>
              <p className={styles.itemName}>{item.name}</p>
              <div className={styles.itemDetails}>
                <span>💰 ${item.price}</span>
                <span>📊 {item.quantity} units</span>
              </div>
            </div>
            <div className={styles.badge}>${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
