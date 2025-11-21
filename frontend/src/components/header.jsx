import styles from "@/components/header.module.css"

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <span className={styles.logoText}>B</span>
          </div>
          <div className={styles.titleSection}>
            <h1>BizzBoost</h1>
            <p>Smart Inventory Management System</p>
          </div>
        </div>
      </div>
    </header>
  )
}
