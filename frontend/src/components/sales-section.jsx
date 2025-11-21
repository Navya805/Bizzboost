"use client"

import styles from "@/components/sales-section.module.css"

export default function SalesSection({ onLoadSales, isLoading, salesData }) {
  const calculateTotalSales = () => {
    return salesData.reduce((sum, item) => sum + (item.total || 0), 0)
  }

  const calculateTotalQuantity = () => {
    return salesData.reduce((sum, item) => sum + (item.qty || 0), 0)
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>💳</div>
        <div className={styles.text}>
          <h2>Today's Sales</h2>
          <p>Real-time sales tracking</p>
        </div>
      </div>

      <button className={styles.button} onClick={onLoadSales} disabled={isLoading}>
        {isLoading ? "Loading..." : "Refresh Sales"}
      </button>

      {salesData && salesData.length > 0 ? (
        <div>
          <div className={styles.stats}>
            <div className={`${styles.stat} ${styles.statRevenue}`}>
              <p>Total Revenue</p>
              <p>${calculateTotalSales().toFixed(2)}</p>
            </div>
            <div className={`${styles.stat} ${styles.statItems}`}>
              <p>Total Items</p>
              <p>{calculateTotalQuantity()}</p>
            </div>
          </div>

          <div className={styles.salesList}>
            {salesData.map((item, idx) => (
              <div key={idx} className={styles.salesItem}>
                <div>
                  <p className={styles.salesItemName}>{item._id}</p>
                  <p className={styles.salesItemQty}>
                    {item.qty} unit{item.qty !== 1 ? "s" : ""}
                  </p>
                </div>
                <p className={styles.salesItemPrice}>${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.empty}>{isLoading ? "Loading sales..." : "No sales today yet"}</p>
      )}
    </div>
  )
}
