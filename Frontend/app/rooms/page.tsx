'use client'

import { useState, useEffect } from 'react'
import { Plus, Zap, ShieldAlert, Filter } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { Card, CardHeader, CardBody, CardFooter, Badge, Button, Input } from '@/components/UI'

interface Room {
  id: number
  name: string
  description: string
  isOnline: boolean
  deviceCount: number
}

interface FormData {
  name: string
  description: string
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
  })

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/rooms')
        // const data = await response.json()

        setTimeout(() => {
          setRooms([
            {
              id: 1,
              name: 'Living Room',
              description: 'Main living and entertainment space',
              isOnline: true,
              deviceCount: 5,
            },
            {
              id: 2,
              name: 'Kitchen',
              description: 'Kitchen and dining area',
              isOnline: true,
              deviceCount: 3,
            },
            {
              id: 3,
              name: 'Bedroom',
              description: 'Master bedroom',
              isOnline: false,
              deviceCount: 2,
            },
          ])
          setLoading(false)
        }, 500)
      } catch (err) {
        setError('Failed to fetch rooms')
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim()) {
      setError('Room name is required')
      return
    }

    try {
      if (editingId) {
        // TODO: Call API to update room
        setRooms((prev) =>
          prev.map((r) =>
            r.id === editingId
              ? { ...r, name: formData.name, description: formData.description }
              : r
          )
        )
        setSuccess('Room updated successfully')
        setEditingId(null)
      } else {
        // TODO: Call API to create room
        const newRoom: Room = {
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          isOnline: true,
          deviceCount: 0,
        }
        setRooms((prev) => [...prev, newRoom])
        setSuccess('Room created successfully')
      }

      setFormData({ name: '', description: '' })
      setShowForm(false)
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError('Failed to save room')
    }
  }

  const handleEdit = (room: Room) => {
    setEditingId(room.id)
    setFormData({ name: room.name, description: room.description })
    setShowForm(true)
  }

  const handleDelete = async (roomId: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return

    try {
      // TODO: Call API to delete room
      setTimeout(() => {
        setRooms((prev) => prev.filter((r) => r.id !== roomId))
        setSuccess('Room deleted successfully')
        setTimeout(() => setSuccess(''), 5000)
      }, 500)
    } catch (err) {
      setError('Failed to delete room')
    }
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
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Zap className="text-blue-600 w-8 h-8" />
                Room Management
              </h1>
              <p className="text-slate-600">Organize and configure your home rooms</p>
            </div>
            {!showForm && (
              <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', description: '' }); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Room
              </Button>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-700">{success}</p>
            </div>
          )}

          {/* Create/Edit Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId ? 'Edit Room' : 'Create New Room'}
                </h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Room Name"
                    placeholder="e.g. Living Room, Bedroom"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the purpose of this room"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingId ? 'Update Room' : 'Create Room'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingId(null)
                        setFormData({ name: '', description: '' })
                      }}
                      className="bg-slate-200 text-slate-900 hover:bg-slate-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          {/* Rooms Grid */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Rooms</h2>

            {rooms.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <Zap className="mx-auto text-slate-300 mb-3 w-10 h-10" />
                  <p className="text-slate-600 mb-4">No rooms created yet</p>
                  <Button onClick={() => setShowForm(true)}>Create Your First Room</Button>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden">
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{room.description}</p>
                        </div>
                        <Badge variant={room.isOnline ? 'success' : 'danger'}>
                          {room.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </div>

                      <div className="mb-4 py-4 border-t border-b border-slate-200">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">{room.deviceCount}</span> devices connected
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


