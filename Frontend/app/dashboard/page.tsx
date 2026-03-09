'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Zap, TrendingUp, ShieldAlert, Home } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/UI'
import { useDeviceControl } from '@/hooks/useDeviceControl'
import { useAccount } from 'wagmi'
import { addHomeChainToMetaMask, switchToHomeChain } from '@/lib/metamask'
import { FRONTEND_DEVICE_TYPE_TO_CONTRACT, DEVICE_VALUE_LABELS, DEVICE_MAX_VALUES } from '@/lib/deviceConstants'

interface Device {
  id: string
  name: string
  deviceId: number
  type: 'fan' | 'light' | 'plug' | 'rgb'
  room: string
  roomId: number
  status: number
  maxValue: number
}

interface Room {
  id: string
  name: string
  devices: Device[]
  isOnline: boolean
}

interface Stats {
  activeDevices: number
  totalRooms: number
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [stats, setStats] = useState<Stats>({
    activeDevices: 0,
    totalRooms: 0,
  })
  const [loading, setLoading] = useState(true)
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { toggleDevice, deviceState } = useDeviceControl()
  const { address, isConnected } = useAccount()

  // Setup MetaMask network on mount
  useEffect(() => {
    if (isConnected && address) {
      switchToHomeChain().catch((err) => {
        console.error('Failed to switch network:', err)
      })
    }
  }, [isConnected, address])

  // Load rooms data
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true)
        setError(null)

        // TODO: Replace with actual API call
        // const response = await fetch('/api/rooms')
        // const data = await response.json()
        // setRooms(data)

        // Initialize with empty state - no mock data
        setRooms([])
        setStats({
          activeDevices: 0,
          totalRooms: 0,
        })

        setLoading(false)
      } catch (err) {
        console.error('Failed to load rooms:', err)
        setError('Failed to load rooms. Please try again.')
        setLoading(false)
      }
    }

    loadRooms()
  }, [])

  // Handle device control
  const handleToggleDevice = async (
    roomId: string,
    deviceId: string,
    device: Device
  ) => {
    try {
      if (!isConnected) {
        setError('Please connect your wallet first')
        return
      }

      // FIXED: Validate roomId and deviceId match device data
      const roomNum = parseInt(roomId)
      if (isNaN(roomNum) || roomNum !== device.roomId) {
        setError('Invalid room ID. Device belongs to a different room.')
        return
      }

      // FIXED: Validate device exists
      if (!device || !device.id) {
        setError('Device not found')
        return
      }

      // Smart logic based on device type
      let newValue = device.status
      if (device.type === 'light' || device.type === 'plug') {
        newValue = device.status === 0 ? 1 : 0
      } else if (device.type === 'fan') {
        newValue = device.status === 0 ? 1 : device.status < 3 ? device.status + 1 : 0
      } else if (device.type === 'rgb') {
        newValue = device.status === 0 ? 1 : device.status < 4 ? device.status + 1 : 0
      }

      await toggleDevice(device.roomId, device.deviceId, newValue)
      setError(null)
    } catch (err) {
      console.error('Failed to control device:', err)
      setError('Failed to control device. Please try again.')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Error Alert */}
          {error && (
            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardBody className="p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-700 text-lg"
                >
                  ×
                </button>
              </CardBody>
            </Card>
          )}

          {/* Wallet Connection Alert */}
          {!isConnected && (
            <Card className="border-l-4 border-orange-500 bg-orange-50">
              <CardBody className="p-4 flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-orange-900">Connect Your Wallet</p>
                  <p className="text-sm text-orange-800 mt-1">
                    Connect MetaMask to control your smart home devices
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    try {
                      await addHomeChainToMetaMask()
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to add network')
                    }
                  }}
                  className="bg-orange-600 text-white hover:bg-orange-700 flex-shrink-0"
                >
                  Connect Wallet
                </Button>
              </CardBody>
            </Card>
          )}

          {/* Transaction Status */}
          {deviceState.hash && (
            <Card className="border-l-4 border-blue-500 bg-blue-50">
              <CardBody className="p-4">
                <p className="font-semibold text-blue-900 mb-1">
                  {deviceState.isConfirming ? 'Transaction Pending...' : 'Transaction Confirmed!'}
                </p>
                <p className="text-sm text-blue-800 font-mono break-all">{deviceState.hash}</p>
              </CardBody>
            </Card>
          )}

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Monitor and control your smart home devices</p>
            </div>
            <Link href="/rooms">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                New Room
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Rooms</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalRooms}</p>
                  </div>
                  <Home className="text-blue-500 opacity-20 w-10 h-10" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Active Devices</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeDevices}</p>
                  </div>
                  <Zap className="text-green-500 opacity-20 w-10 h-10" />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content - Rooms */}
          {!isConnected ? (
            // Empty state when wallet not connected
            <Card>
              <CardBody className="p-12 text-center">
                <Home className="mx-auto text-slate-300 mb-4 w-12 h-12" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Wallet Not Connected</h2>
                <p className="text-slate-600 mb-6">
                  Connect your MetaMask wallet to view and control your smart home devices
                </p>
                <Button
                  onClick={async () => {
                    try {
                      await addHomeChainToMetaMask()
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to add network')
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Connect Wallet
                </Button>
              </CardBody>
            </Card>
          ) : rooms.length === 0 ? (
            // Empty state when no rooms
            <Card>
              <CardBody className="p-12 text-center">
                <Home className="mx-auto text-slate-300 mb-4 w-12 h-12" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">No Rooms Yet</h2>
                <p className="text-slate-600 mb-6">
                  Create your first room to start controlling smart home devices
                </p>
                <Link href="/rooms">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Room
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            // Rooms list
            <div className="space-y-4">
              {rooms.map((room) => (
                <div key={room.id}>
                  {/* Room Header */}
                  <button
                    onClick={() =>
                      setExpandedRoom(expandedRoom === room.id ? null : room.id)
                    }
                    className="w-full text-left mb-3"
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardBody className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              room.isOnline ? 'bg-green-500' : 'bg-slate-300'
                            }`}
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {room.name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {room.devices.filter((d) => d.status > 0).length}/{room.devices.length} devices active
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={room.isOnline ? 'success' : 'danger'}
                        >
                          {room.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </CardBody>
                    </Card>
                  </button>

                  {/* Devices Grid */}
                  {expandedRoom === room.id && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {room.devices.length === 0 ? (
                        <div className="col-span-full">
                          <Card>
                            <CardBody className="p-8 text-center">
                              <Zap className="mx-auto text-slate-300 mb-3 w-8 h-8" />
                              <p className="text-slate-600">No devices in this room</p>
                            </CardBody>
                          </Card>
                        </div>
                      ) : (
                        room.devices.map((device) => (
                          <Card key={device.id} className="hover:shadow-md transition-shadow">
                            <CardBody className="p-4 space-y-4">
                              {/* Device Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">
                                    {device.type === 'light'
                                      ? '💡'
                                      : device.type === 'fan'
                                        ? '🌀'
                                        : device.type === 'plug'
                                          ? '🔌'
                                          : '🎨'}
                                  </span>
                                  <div>
                                    <h4 className="font-semibold text-slate-900">
                                      {device.name}
                                    </h4>
                                    <Badge
                                      variant={device.status > 0 ? 'success' : 'default'}
                                    >
                                      {device.type === 'fan'
                                        ? device.status === 0
                                          ? 'Off'
                                          : device.status === 1
                                            ? 'Low'
                                            : device.status === 2
                                              ? 'Med'
                                              : 'High'
                                        : device.status > 0
                                          ? 'On'
                                          : 'Off'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Device Controls */}
                              {device.type === 'fan' && (
                                <div>
                                  <p className="text-xs text-slate-600 mb-2 font-medium">
                                    SPEED: {
                                      device.status === 0
                                        ? 'OFF'
                                        : device.status === 1
                                          ? 'LOW'
                                          : device.status === 2
                                            ? 'MED'
                                            : 'HIGH'
                                    }
                                  </p>
                                  <div className="grid grid-cols-4 gap-2">
                                    {[0, 1, 2, 3].map((level) => (
                                      <button
                                        key={level}
                                        onClick={() =>
                                          handleToggleDevice(room.id, device.id, {
                                            ...device,
                                            status: level,
                                          })
                                        }
                                        disabled={deviceState.isConfirming}
                                        className={`py-2 px-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                                          device.status === level
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                        }`}
                                      >
                                        {level === 0 ? '○' : level}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {device.type === 'rgb' && (
                                <div>
                                  <p className="text-xs text-slate-600 mb-2 font-medium">
                                    COLOR:{' '}
                                    {device.status === 0
                                      ? 'OFF'
                                      : device.status === 1
                                        ? 'RED'
                                        : device.status === 2
                                          ? 'GREEN'
                                          : device.status === 3
                                            ? 'BLUE'
                                            : 'WHITE'}
                                  </p>
                                  <div className="grid grid-cols-5 gap-1">
                                    <button
                                      onClick={() =>
                                        handleToggleDevice(room.id, device.id, {
                                          ...device,
                                          status: 0,
                                        })
                                      }
                                      disabled={deviceState.isConfirming}
                                      className={`py-2 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                                        device.status === 0
                                          ? 'bg-slate-800 text-white'
                                          : 'bg-slate-200 hover:bg-slate-300'
                                      }`}
                                    >
                                      ○
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleToggleDevice(room.id, device.id, {
                                          ...device,
                                          status: 1,
                                        })
                                      }
                                      disabled={deviceState.isConfirming}
                                      className={`py-2 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                                        device.status === 1
                                          ? 'bg-red-600 text-white'
                                          : 'bg-red-100 hover:bg-red-200'
                                      }`}
                                    >
                                      R
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleToggleDevice(room.id, device.id, {
                                          ...device,
                                          status: 2,
                                        })
                                      }
                                      disabled={deviceState.isConfirming}
                                      className={`py-2 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                                        device.status === 2
                                          ? 'bg-green-600 text-white'
                                          : 'bg-green-100 hover:bg-green-200'
                                      }`}
                                    >
                                      G
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleToggleDevice(room.id, device.id, {
                                          ...device,
                                          status: 3,
                                        })
                                      }
                                      disabled={deviceState.isConfirming}
                                      className={`py-2 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                                        device.status === 3
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-blue-100 hover:bg-blue-200'
                                      }`}
                                    >
                                      B
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleToggleDevice(room.id, device.id, {
                                          ...device,
                                          status: 4,
                                        })
                                      }
                                      disabled={deviceState.isConfirming}
                                      className={`py-2 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                                        device.status === 4
                                          ? 'bg-yellow-300 text-black'
                                          : 'bg-yellow-100 hover:bg-yellow-200'
                                      }`}
                                    >
                                      W
                                    </button>
                                  </div>
                                </div>
                              )}

                              {(device.type === 'light' || device.type === 'plug') && (
                                <button
                                  onClick={() =>
                                    handleToggleDevice(room.id, device.id, device)
                                  }
                                  disabled={deviceState.isConfirming}
                                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                                    device.status > 0
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                                  }`}
                                >
                                  {deviceState.isConfirming
                                    ? 'Updating...'
                                    : device.status > 0
                                      ? 'Turn Off'
                                      : 'Turn On'}
                                </button>
                              )}
                            </CardBody>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-200">
            <Link href="/rooms">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardBody className="p-6 text-center">
                  <div className="text-4xl mb-3">🏠</div>
                  <h3 className="font-semibold text-slate-900 mb-2">Manage Rooms</h3>
                  <p className="text-sm text-slate-600">
                    Create and configure rooms
                  </p>
                </CardBody>
              </Card>
            </Link>

            <Link href="/access-management">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardBody className="p-6 text-center">
                  <div className="text-4xl mb-3">🔐</div>
                  <h3 className="font-semibold text-slate-900 mb-2">Access Control</h3>
                  <p className="text-sm text-slate-600">Manage user permissions</p>
                </CardBody>
              </Card>
            </Link>

            <Link href="/analytics">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardBody className="p-6 text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-semibold text-slate-900 mb-2">Analytics</h3>
                  <p className="text-sm text-slate-600">View usage trends</p>
                </CardBody>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
