"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"

interface StockData {
  name: string
  ticker: string
  price: number
  change: number
  changePercent: number
  positive: boolean
}

export default function TechChatsLanding() {
  const [displayedText, setDisplayedText] = useState("")
  const [stockData, setStockData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fullText = "Top Tech Chats"
  const [currentIndex, setCurrentIndex] = useState(0)

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, fullText])

  // Fetch stock data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/stocks")
        if (!response.ok) {
          throw new Error("Failed to fetch stock data")
        }
        const data = await response.json()
        setStockData(data)
        setError(null)
      } catch (err) {
        setError("Failed to load stock data")
        console.error("Error fetching stock data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchStockData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header with typewriter effect */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            {displayedText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real-time insights and discussions on the world's most innovative technology companies
          </p>
          {loading && (
            <div className="flex items-center justify-center mt-4">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-gray-400">Loading real-time data...</span>
            </div>
          )}
          {error && <div className="mt-4 text-red-400">{error}</div>}
        </div>

        {/* Company cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {loading
            ? // Loading skeleton
              Array.from({ length: 10 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-white/20 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4 animate-pulse">
                      <div>
                        <div className="h-5 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-800 rounded w-16"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-8 bg-gray-700 rounded w-24"></div>
                        <div className="h-4 bg-gray-800 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : stockData.map((company, index) => (
                <Card
                  key={company.ticker}
                  className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Company name */}
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-gray-300 transition-colors duration-300 truncate">
                          {company.name}
                        </h3>
                        <p className="text-gray-400 font-mono text-sm font-semibold">{company.ticker}</p>
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-white">${company.price.toFixed(2)}</div>

                        {/* Change indicator */}
                        <div
                          className={`flex items-center space-x-1 text-sm ${
                            company.positive ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {company.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold">
                            {company.positive ? "+" : ""}
                            {company.change.toFixed(2)}
                          </span>
                          <span className="text-xs">
                            ({company.positive ? "+" : ""}
                            {company.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>

                      {/* Animated border */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20 border border-white/20">
            Start Chatting About Tech
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">Real-time market data • Live discussions • Expert insights</p>
          <p className="text-xs mt-2">Data updates every 30 seconds</p>
        </div>
      </div>
    </div>
  )
}
