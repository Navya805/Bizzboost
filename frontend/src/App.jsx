"use client"

import { useState } from "react"
import Header from "@/components/header"
import StockSection from "@/components/stock-section"
import AddStockSection from "@/components/add-stock-section"
import LiveDetectionSection from "@/components/live-detection-section"
import StockList from "@/components/stock-list"
import SalesSection from "@/components/sales-section"
import styles from "./page.module.css"

export default function Home() {
  const [stockData, setStockData] = useState([])
  const [salesData, setSalesData] = useState([])
  const [addResponse, setAddResponse] = useState(null)
  const [liveResponse, setLiveResponse] = useState(null)
  const [isLoadingStock, setIsLoadingStock] = useState(false)
  const [isLoadingDetection, setIsLoadingDetection] = useState(false)
  const [isLoadingSales, setIsLoadingSales] = useState(false)

  const handleGetSales = async () => {
    setIsLoadingSales(true)
    try {
      const res = await fetch("http://localhost:5000/sales/today")
      const data = await res.json()
      setSalesData(data)
    } catch (error) {
      console.error("Error fetching sales:", error)
    } finally {
      setIsLoadingSales(false)
    }
  }

  const handleGetStock = async () => {
    setIsLoadingStock(true)
    try {
      const res = await fetch("http://localhost:5000/stock")
      const data = await res.json()
      setStockData(data)
    } catch (error) {
      console.error("Error fetching stock:", error)
    } finally {
      setIsLoadingStock(false)
    }
  }

  const handleAddStock = async (name, price, quantity) => {
    try {
      const res = await fetch("http://localhost:5000/stock/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, quantity }),
      })
      const data = await res.json()
      setAddResponse(data)
      handleGetStock()
    } catch (error) {
      console.error("Error adding stock:", error)
    }
  }

  const handleStartLive = async () => {
    setIsLoadingDetection(true)
    try {
      const res = await fetch("http://localhost:5000/start-live")
      const data = await res.json()
      setLiveResponse(data)
      setTimeout(handleGetSales, 500)
    } catch (error) {
      console.error("Error starting live detection:", error)
    } finally {
      setIsLoadingDetection(false)
    }
  }

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Left Column */}
          <div className={styles.column}>
            <StockSection onLoadStock={handleGetStock} isLoading={isLoadingStock} />
            <StockList data={stockData} isLoading={isLoadingStock} />
          </div>

          {/* Middle Column */}
          <div className={styles.column}>
            <AddStockSection onAddStock={handleAddStock} response={addResponse} />
            <SalesSection onLoadSales={handleGetSales} isLoading={isLoadingSales} salesData={salesData} />
          </div>

          {/* Right Column */}
          <div className={styles.column}>
            <LiveDetectionSection
              onStartLive={handleStartLive}
              isLoading={isLoadingDetection}
              response={liveResponse}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
