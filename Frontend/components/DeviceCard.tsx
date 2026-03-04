'use client'

interface DeviceCardProps {
  title: string
  deviceId: number
  children: React.ReactNode
}

export default function DeviceCard({ title, deviceId, children }: DeviceCardProps) {
  return (
    <div className="card-container">
      <h3 className="card-title">{title}</h3>
      <div className="space-form">
        {children}
      </div>
      <p className="card-subtitle">Device ID: {deviceId}</p>
    </div>
  )
}
