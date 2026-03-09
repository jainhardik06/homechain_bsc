'use client'

import { useEffect, useState } from 'react'
import { Shield, Globe } from 'lucide-react'

export interface SystemHealthStatus {
  rpcOnline: boolean
  middlewareOnline: boolean
  isOnline: boolean
  lastCheck: number
}

/**
 * SystemStatus Component
 * Global health monitor showing RPC and Middleware connectivity
 * Maintains the "Webasthetic Light Minimalist" design theme
 */
export default function SystemStatus() {
  const [health, setHealth] = useState<SystemHealthStatus>({
    rpcOnline: true,
    middlewareOnline: true,
    isOnline: true,
    lastCheck: Date.now(),
  })
  const [isChecking, setIsChecking] = useState(false)

  // Check system health every 10 seconds
  useEffect(() => {
    const checkHealth = async () => {
      setIsChecking(true)

      try {
        // Check RPC endpoint (Anvil via Cloudflare Tunnel)
        let rpcOnline = false
        try {
          const rpcResponse = await fetch('https://rpc.jainhardik06.in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_chainId',
              params: [],
              id: 1,
            }),
            signal: AbortSignal.timeout(3000), // 3 second timeout
          })

          rpcOnline = rpcResponse.ok && rpcResponse.status === 200
        } catch (err) {
          rpcOnline = false
        }

        // Check Go Middleware health endpoint
        let middlewareOnline = false
        try {
          // IMPORTANT: Replace 192.168.1.100 with your actual Raspberry Pi IP address
          // You can find this in your router's DHCP client list or run:
          //   On Pi: hostname -I
          // Update the IP address in your environment variables if needed
          const middlewareUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL || 'http://192.168.1.100:8080/health'
          
          const middlewareResponse = await fetch(middlewareUrl, {
            method: 'GET',
            signal: AbortSignal.timeout(3000),
          })

          middlewareOnline = middlewareResponse.ok && middlewareResponse.status === 200
        } catch (err) {
          middlewareOnline = false
        }

        const isOnline = rpcOnline && middlewareOnline

        setHealth({
          rpcOnline,
          middlewareOnline,
          isOnline,
          lastCheck: Date.now(),
        })
      } catch (error) {
        console.error('Health check error:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // If system is online, show minimal indicator
  if (health.isOnline) {
    return (
      <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-emerald-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-emerald-600">✓ System Online</span>
        </div>
      </div>
    )
  }

  // If offline, show error state prominently
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-50 border-b border-red-200 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl text-red-600 animate-pulse">⚠</span>
          <div>
            <p className="font-semibold text-red-900 text-sm">System Offline</p>
            <p className="text-xs text-red-800">
              {!health.rpcOnline && !health.middlewareOnline
                ? 'RPC and Middleware unreachable. Check Raspberry Pi.'
                : !health.rpcOnline
                ? 'Blockchain RPC unavailable. Check Cloudflare Tunnel.'
                : 'Middleware unreachable. Check Go service on Pi.'}
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-xs">
          <div className="text-right">
            <p className="text-red-900 font-medium">
              {health.rpcOnline ? '✓' : '✗'} RPC
            </p>
            <p className="text-red-700">
              {new Date(health.lastCheck).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right border-l border-red-200 pl-4">
            <p className="text-red-900 font-medium">
              {health.middlewareOnline ? '✓' : '✗'} Middleware
            </p>
            <p className="text-red-700">
              {new Date(health.lastCheck).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook for programmatic health checks
 * Use in components that need to know system status
 */
export function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealthStatus>({
    rpcOnline: true,
    middlewareOnline: true,
    isOnline: true,
    lastCheck: Date.now(),
  })

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const rpcCheck = fetch('https://rpc.jainhardik06.in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_chainId',
            params: [],
            id: 1,
          }),
          signal: AbortSignal.timeout(3000),
        })
          .then((r) => r.ok)
          .catch(() => false)

        const middlewareCheck = fetch('http://192.168.1.XX:8080/health', {
          signal: AbortSignal.timeout(3000),
        })
          .then((r) => r.ok)
          .catch(() => false)

        const [rpcOnline, middlewareOnline] = await Promise.all([
          rpcCheck,
          middlewareCheck,
        ])

        setHealth({
          rpcOnline,
          middlewareOnline,
          isOnline: rpcOnline && middlewareOnline,
          lastCheck: Date.now(),
        })
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 15000)

    return () => clearInterval(interval)
  }, [])

  return health
}
