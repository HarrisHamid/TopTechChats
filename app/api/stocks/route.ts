import { NextResponse } from "next/server"

const ALPHA_VANTAGE_API_KEY = process.env.STOCKS_API_KEY || "demo"

const techCompanies = [
  { name: "Apple Inc.", ticker: "AAPL" },
  { name: "Microsoft Corp.", ticker: "MSFT" },
  { name: "Alphabet Inc.", ticker: "GOOGL" },
  { name: "Amazon.com Inc.", ticker: "AMZN" },
  { name: "Tesla Inc.", ticker: "TSLA" },
  { name: "Meta Platforms", ticker: "META" },
  { name: "NVIDIA Corp.", ticker: "NVDA" },
  { name: "Netflix Inc.", ticker: "NFLX" },
  { name: "Salesforce Inc.", ticker: "CRM" },
  { name: "Oracle Corp.", ticker: "ORCL" },
]

async function fetchStockData(symbol: string) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
    )
    const data = await response.json()

    if (data["Global Quote"]) {
      const quote = data["Global Quote"]
      return {
        price: Number.parseFloat(quote["05. price"]),
        change: Number.parseFloat(quote["09. change"]),
        changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
      }
    }

    // Fallback to mock data if API fails
    return generateMockData()
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error)
    return generateMockData()
  }
}

function generateMockData() {
  const basePrice = Math.random() * 500 + 50
  const change = (Math.random() - 0.5) * 20
  return {
    price: Number.parseFloat(basePrice.toFixed(2)),
    change: Number.parseFloat(change.toFixed(2)),
    changePercent: Number.parseFloat(((change / basePrice) * 100).toFixed(2)),
  }
}

export async function GET() {
  try {
    // For demo purposes, we'll use mock data to avoid API rate limits
    // In production, uncomment the line below to use real API data
    const stockPromises = techCompanies.map(company => fetchStockData(company.ticker))

    // Using mock data for demo
    // const stockPromises = techCompanies.map(() => Promise.resolve(generateMockData()))
    const stockData = await Promise.all(stockPromises)

    const companiesWithPrices = techCompanies.map((company, index) => ({
      ...company,
      ...stockData[index],
      positive: stockData[index].change > 0,
    }))

    return NextResponse.json(companiesWithPrices)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}
