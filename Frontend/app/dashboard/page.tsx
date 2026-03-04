'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Zap, TrendingUp, ShieldAlert, Filter } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/UI'

interface Device {
  id: string
  name: string
  type: 'light' | 'fan' | 'plug' | 'rgb'
  room: string
  status: 'on' | 'off'
  power?: number
  brightness?: number
  speed?: number
  color?: string
}

interface Room {
  id: string
  name: string
  devices: Device[]
  isOnline: boolean
}

interface Stats {
  totalPower: number
  activeDevices: number
  onlineRooms: string
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [stats, setStats] = useState<Stats>({
    totalPower: 0,
    activeDevices: 0,
    onlineRooms: '0/0',
  })
  const [loading, setLoading] = useState(true)
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API endpoints
        // const devicesRes = await fetch('/api/devices')
        // const roomsRes = await fetch('/api/rooms')

        setTimeout(() => {
          const mockRooms: Room[] = [
            {
              id: '1',
              name: 'Living Room',
              isOnline: true,
              devices: [
                {
                  id: 'd1',
                  name: 'Main Light',
                  type: 'light',
                  room: 'Living Room',
                  status: 'on',
                  brightness: 75,
                },
                {
                  id: 'd2',
                  name: 'Ceiling Fan',
                  type: 'fan',
                  room: 'Living Room',
                  status: 'on',
                  speed: 2,
                },
              ],
            },
            {
              id: '2',
              name: 'Bedroom',
              isOnline: true,
              devices: [
                {
                  id: 'd3',
                  name: 'Bed Lamp',
                  type: 'light',
                  room: 'Bedroom',
                  status: 'off',
                  brightness: 0,
                },
              ],
            },
            {
              id: '3',
              name: 'Kitchen',
              isOnline: false,
              devices: [
                {
                  id: 'd4',
                  name: 'Overhead Light',
                  type: 'light',
                  room: 'Kitchen',
                  status: 'off',
                  brightness: 0,
                },
              ],
            },
          ]

          const activeDevices = mockRooms.reduce(
            (sum, room) => sum + room.devices.filter((d) => d.status === 'on').length,
            0
          )
          const totalPower = mockRooms.reduce(
            (sum, room) =>
              sum +
              room.devices
                .filter((d) => d.status === 'on')
                .reduce((roomSum, device) => roomSum + (device.power || 50), 0),
            0
          )
          const onlineRoomsCount = mockRooms.filter((r) => r.isOnline).length

          setRooms(mockRooms)
          setStats({
            totalPower,
            activeDevices,
            onlineRooms: `${onlineRoomsCount}/${mockRooms.length}`,
          })
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleToggleDevice = async (roomId: string, deviceId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              devices: room.devices.map((device) =>
                device.id === deviceId
                  ? { ...device, status: device.status === 'on' ? 'off' : 'on' }
                  : device
              ),
            }
          : room
      )
    )

    // TODO: Call API to update device state
    // await fetch(`/api/devices/${deviceId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ status: newStatus }),
    // })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex-1 md:ml-64 pt-16 md:pt-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation />

      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Monitor and control your smart home devices</p>
            </div>
            <Link href="/rooms">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Room
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Power Usage</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalPower}W</p>
                  </div>
                  <TrendingUp className="text-orange-500 opacity-20 w-8 h-8" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Active Devices</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeDevices}</p>
                  </div>
                  <Zap className="text-green-500 opacity-20 w-8 h-8" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Online Rooms</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.onlineRooms}</p>
                  </div>
                  <Filter className="text-blue-500 opacity-20 w-8 h-8" />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Rooms and Devices */}
          <div className="space-y-6">
            {rooms.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <Zap className="mx-auto text-slate-300 mb-3 w-10 h-10" />
                  <p className="text-slate-600 mb-4">No rooms configured yet</p>
                  <Link href="/rooms">
                    <Button>Create Your First Room</Button>
                  </Link>
                </CardBody>
              </Card>
            ) : (
              rooms.map((room) => (
                <div key={room.id}>
                  <button
                    onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}
                    className="w-full text-left"
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardBody className="p-6 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${room.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          />
                          <h2 className="text-lg font-semibold text-slate-900">{room.name}</h2>
                          <span className="text-sm text-slate-500">
                            ({room.devices.filter((d) => d.status === 'on').length}/{room.devices.length} active)
                          </span>
                        </div>
                        <Badge variant={room.isOnline ? 'success' : 'danger'}>
                          {room.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </CardBody>
                    </Card>
                  </button>

                  {/* Devices Grid */}
                  {expandedRoom === room.id && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {room.devices.map((device) => (
                        <Card key={device.id}>
                          <CardBody className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                  {device.type === 'light'
                                    ? '💡'
                                    : device.type === 'fan'
                                      ? '🌀'
                                      : device.type === 'plug'
                                        ? '🔌'
                                        : '🎨'}
                                </span>
                                <div>
                                  <p className="font-semibold text-slate-900">{device.name}</p>
                                  <Badge variant={device.status === 'on' ? 'success' : 'default'}>
                                    {device.status === 'on' ? 'On' : 'Off'}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Device Control */}
                            {device.type === 'light' && device.brightness !== undefined && (
                              <div className="mb-4">
                                <p className="text-sm text-slate-600 mb-2">Brightness: {device.brightness}%</p>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={device.brightness}
                                  onChange={(e) => {
                                    // TODO: Update brightness
                                  }}
                                  className="w-full"
                                />
                              </div>
                            )}

                            {device.type === 'fan' && device.speed !== undefined && (
                              <div className="mb-4">
                                <p className="text-sm text-slate-600 mb-2">Speed: {device.speed}/3</p>
                                <div className="flex gap-2">
                                  {[1, 2, 3].map((level) => (
                                    <button
                                      key={level}
                                      className={`flex-1 py-1 px-2 rounded text-sm font-medium transition-colors ${
                                        device.speed === level
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-slate-200 text-slate-700'
                                      }`}
                                    >
                                      {level}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {device.power && (
                              <p className="text-sm text-slate-600 mb-4">
                                Power: {device.power}W
                              </p>
                            )}

                            {/* Toggle Button */}
                            <button
                              onClick={() => handleToggleDevice(room.id, device.id)}
                              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                device.status === 'on'
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                              }`}
                            >
                              {device.status === 'on' ? 'Turn Off' : 'Turn On'}
                            </button>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <Link href="/rooms">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl mb-3">🏠</div>
                  <h3 className="font-semibold text-slate-900 mb-1">Manage Rooms</h3>
                  <p className="text-sm text-slate-600">Create and configure rooms</p>
                </CardBody>
              </Card>
            </Link>

            <Link href="/access-management">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl mb-3">🔐</div>
                  <h3 className="font-semibold text-slate-900 mb-1">Access Control</h3>
                  <p className="text-sm text-slate-600">Manage user permissions</p>
                </CardBody>
              </Card>
            </Link>

            <Link href="/analytics">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-semibold text-slate-900 mb-1">Analytics</h3>
                  <p className="text-sm text-slate-600">View energy usage trends</p>
                </CardBody>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
