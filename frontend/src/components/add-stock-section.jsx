"use client"

import { useState } from "react"
import styles from "@/components/add-stock-section.module.css"

export default function AddStockSection({ onAddStock, response }) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !price || !quantity) return

    setIsSubmitting(true)
    await onAddStock(name, Number.parseFloat(price), Number.parseInt(quantity))
    setName("")
    setPrice("")
    setQuantity("")
    setIsSubmitting(false)
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>➕</div>
        <div className={styles.text}>
          <h2>Add Stock</h2>
          <p>Add new items to inventory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Laptop, Mouse, Keyboard"
            className={styles.input}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className={styles.input}
            />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting || !name || !price || !quantity} className={styles.button}>
          {isSubmitting ? "Adding..." : "Add Stock"}
        </button>
      </form>

      {response && <div className={styles.response}>{response.message}</div>}
    </div>
  )
}
