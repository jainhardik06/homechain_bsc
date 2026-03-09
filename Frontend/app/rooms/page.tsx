'use client'

import { useState, useEffect } from 'react'
import { Plus, Home, ShieldAlert } from 'lucide-react'
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

  // Load rooms from API
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true)
        setError('')

        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/rooms')
        // const data = await response.json()
        // setRooms(data)

        // Initialize with empty state - no mock data
        setRooms([])
        setLoading(false)
      } catch (err) {
        console.error('Failed to load rooms:', err)
        setError('Failed to load rooms. Please try again.')
        setLoading(false)
      }
    }

    loadRooms()
  }, [])

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
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
      setEditingId(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save room')
    }
  }

  // Handle edit
  const handleEdit = (room: Room) => {
    setEditingId(room.id)
    setFormData({ name: room.name, description: room.description })
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (roomId: number) => {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return
    }

    try {
      // TODO: Call API to delete room
      setRooms((prev) => prev.filter((r) => r.id !== roomId))
      setSuccess('Room deleted successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete room')
    }
  }

  // Cancel form
  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', description: '' })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-slate-200 rounded"></div>
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
                  onClick={() => setError('')}
                  className="text-red-600 hover:text-red-700 text-lg flex-shrink-0"
                >
                  ×
                </button>
              </CardBody>
            </Card>
          )}

          {/* Success Alert */}
          {success && (
            <Card className="border-l-4 border-green-500 bg-green-50">
              <CardBody className="p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-600 flex-shrink-0 mt-0.5"></div>
                <div className="flex-1">
                  <p className="font-semibold text-green-900">{success}</p>
                </div>
                <button
                  onClick={() => setSuccess('')}
                  className="text-green-600 hover:text-green-700 text-lg flex-shrink-0"
                >
                  ×
                </button>
              </CardBody>
            </Card>
          )}

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Room Management</h1>
              <p className="text-slate-600">Organize and configure your home rooms</p>
            </div>
            {!showForm && (
              <Button
                onClick={() => {
                  setShowForm(true)
                  setEditingId(null)
                  setFormData({ name: '', description: '' })
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                New Room
              </Button>
            )}
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId ? 'Edit Room' : 'Create New Room'}
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                <Input
                  label="Room Name"
                  placeholder="e.g. Living Room, Bedroom, Kitchen"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the purpose of this room"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">Optional description</p>
                </div>
              </CardBody>
              <CardFooter className="flex gap-2 justify-end border-t border-slate-200 pt-4">
                <Button
                  onClick={handleCancel}
                  className="bg-slate-200 text-slate-900 hover:bg-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editingId ? 'Update Room' : 'Create Room'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Rooms List */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Rooms</h2>

            {rooms.length === 0 ? (
              // Empty state
              <Card>
                <CardBody className="p-12 text-center">
                  <Home className="mx-auto text-slate-300 mb-4 w-12 h-12" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No rooms yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Create your first room to start organizing your smart home devices
                  </p>
                  <Button
                    onClick={() => {
                      setShowForm(true)
                      setEditingId(null)
                      setFormData({ name: '', description: '' })
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Room
                  </Button>
                </CardBody>
              </Card>
            ) : (
              // Rooms grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <Card
                    key={room.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardBody className="p-6 space-y-4">
                      {/* Room Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 truncate">
                            {room.name}
                          </h3>
                          {room.description && (
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {room.description}
                            </p>
                          )}
                        </div>
                        <Badge variant={room.isOnline ? 'success' : 'danger'}>
                          {room.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </div>

                      {/* Device Count */}
                      <div className="py-3 border-t border-slate-200">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">
                            {room.deviceCount}
                          </span>{' '}
                          device{room.deviceCount !== 1 ? 's' : ''} connected
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => handleEdit(room)}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium hover:shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium hover:shadow-sm"
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
