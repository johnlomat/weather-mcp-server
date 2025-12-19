import React from 'react'
import { Card, Badge, Chip } from '@ainativekit/ui'
import { WeatherWidgetProps } from './types'
import { getWeatherEmoji, getWeatherDescription } from './utils'

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  const emoji = getWeatherEmoji(data.weatherCode || 0)
  const description = getWeatherDescription(data.weatherCode || 0)

  return (
    <Card elevationLevel={1}>
      <Card.Header>
        <Card.ChipGroup>
          <Chip variant="neutral">{emoji} {description}</Chip>
        </Card.ChipGroup>
      </Card.Header>
      <Card.Body>
        <Card.Title>{data.location || 'Unknown Location'}</Card.Title>
        <div style={{ fontSize: '48px', fontWeight: 300, textAlign: 'center', margin: '16px 0' }}>
          {data.temperature ?? '--'}°C
        </div>
        <Card.Description>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            <Badge variant="neutral">💧 Humidity: {data.humidity ?? '--'}%</Badge>
            <Badge variant="neutral">💨 Wind: {data.windSpeed ?? '--'} km/h</Badge>
            <Badge variant="neutral">🌡️ Feels: {data.feelsLike ?? '--'}°C</Badge>
            <Badge variant="neutral">☀️ UV: {data.uvIndex ?? '--'}</Badge>
          </div>
        </Card.Description>
      </Card.Body>
    </Card>
  )
}

export * from './types'
