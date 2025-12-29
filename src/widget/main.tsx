import React from 'react'
import ReactDOM from 'react-dom/client'
import { WeatherWidget } from '@/components/weather-widget'
import { ProductsWidget } from '@/components/products-widget'
import { demoData } from './demo-data'

// Get widget type from global variable (set by MCP resource HTML) or URL query param
const getWidgetType = (): string => {
  // Check for global variable set by MCP resource HTML first
  if ((window as any).__WIDGET_TYPE__) {
    return (window as any).__WIDGET_TYPE__
  }
  // Fallback to URL query param for local development
  const params = new URLSearchParams(window.location.search)
  return params.get('type') || 'weather'
}

// Get tool output data from ChatGPT
const getToolOutput = () => {
  return (window as any).openai?.toolOutput
}

const App: React.FC = () => {
  const widgetType = getWidgetType()
  const toolOutput = getToolOutput()

  switch (widgetType) {
    case 'products': {
      // Handle both single product and product list
      let products = toolOutput?.products || (toolOutput?.id ? [toolOutput] : demoData.products)
      return <ProductsWidget products={products} />
    }
    case 'weather':
    default: {
      const data = toolOutput || demoData.weather
      return <WeatherWidget data={data} />
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
