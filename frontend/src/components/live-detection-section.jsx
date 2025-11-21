"use client"

import styles from "@/components/live-detection-section.module.css"

export default function LiveDetectionSection({ onStartLive, isLoading, response }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>🎯</div>
        <div className={styles.text}>
          <h2>Live Detection</h2>
          <p>YOLO real-time detection</p>
        </div>
      </div>

      <button className={styles.button} onClick={onStartLive} disabled={isLoading}>
        {isLoading ? "Starting Detection..." : "Start YOLO Detection"}
      </button>

      {response && (
        <div className={`${styles.response} ${response.error ? styles.responseError : styles.responseSuccess}`}>
          <p>{response.message || response.error}</p>
          {response.output && <pre className={styles.output}>{response.output}</pre>}
        </div>
      )}
    </div>
  )
}
