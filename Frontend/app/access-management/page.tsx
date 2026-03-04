'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Zap, Users, Lock, ShieldAlert, Calendar } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { Card, CardHeader, CardBody, CardFooter, Badge, Button, Input, Select } from '@/components/UI'

interface AccessGrant {
  id: string
  address: string
  status: 'active' | 'expired' | 'pending'
  room: string
  role: 'GUEST' | 'ROOM_ADMIN'
  startTime: string
  endTime: string
}

interface FormData {
  address: string
  room: string
  role: 'GUEST' | 'ROOM_ADMIN'
  startTime: string
  endTime: string
}

const ROOMS = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Office']

export default function AccessManagementPage() {
  const [grants, setGrants] = useState<AccessGrant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<FormData>({
    address: '',
    room: ROOMS[0],
    role: 'GUEST',
    startTime: '',
    endTime: '',
  })

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/access/grants')
        // const data = await response.json()

        setTimeout(() => {
          setGrants([
            {
              id: '1',
              address: '0x1234567890abcdef1234567890abcdef12345678',
              status: 'active',
              room: 'Living Room',
              role: 'GUEST',
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
            },
          ])
          setLoading(false)
        }, 500)
      } catch (err) {
        setError('Failed to fetch access grants')
        setLoading(false)
      }
    }

    fetchGrants()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr)
  }

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate address
    if (!validateAddress(formData.address)) {
      setError('Invalid Ethereum address format (must be 0x followed by 40 hex characters)')
      return
    }

    // Validate times
    const startTime = new Date(formData.startTime).getTime()
    const endTime = new Date(formData.endTime).getTime()
    if (endTime <= startTime) {
      setError('End time must be after start time')
      return
    }

    try {
      // TODO: Call API to grant access
      // const response = await fetch('/api/access/grant', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      setTimeout(() => {
        const newGrant: AccessGrant = {
          id: Date.now().toString(),
          address: formData.address,
          status: 'pending',
          room: formData.room,
          role: formData.role,
          startTime: formData.startTime,
          endTime: formData.endTime,
        }
        setGrants((prev) => [newGrant, ...prev])
        setSuccess('Access granted successfully')
        setFormData({
          address: '',
          room: ROOMS[0],
          role: 'GUEST',
          startTime: '',
          endTime: '',
        })
        setTimeout(() => setSuccess(''), 5000)
      }, 500)
    } catch (err) {
      setError('Failed to grant access')
    }
  }

  const handleRevokeGrant = async (grantId: string) => {
    if (!confirm('Are you sure you want to revoke this access?')) return

    try {
      // TODO: Call API to revoke access
      // await fetch(`/api/access/revoke/${grantId}`, { method: 'POST' })

      setTimeout(() => {
        setGrants((prev) => prev.filter((g) => g.id !== grantId))
        setSuccess('Access revoked successfully')
        setTimeout(() => setSuccess(''), 5000)
      }, 500)
    } catch (err) {
      setError('Failed to revoke access')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Lock className="text-blue-600 w-8 h-8" />
              Access Management
            </h1>
            <p className="text-slate-600">Manage user access and permissions for your smart home</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap gap-3">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-gap gap-3">
              <p className="text-emerald-700">{success}</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Grants</p>
                    <p className="text-2xl font-bold text-slate-900">{grants.length}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Zap className="text-emerald-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Active</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {grants.filter((g) => g.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Calendar className="text-orange-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Pending</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {grants.filter((g) => g.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Grant Access Form */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Grant Access
              </h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleGrantAccess} className="space-y-4">
                <Input
                  label="Wallet Address"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc7e7a6f8e3c0b"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />

                <Select
                  label="Room"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  options={ROOMS.map((room) => ({ value: room, label: room }))}
                />

                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  options={[
                    { value: 'GUEST', label: 'Guest (Limited Access)' },
                    { value: 'ROOM_ADMIN', label: 'Room Admin (Full Access)' },
                  ]}
                />

                <Input
                  label="Start Time"
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                />

                <Input
                  label="End Time"
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                />

                <Button type="submit" className="w-full">
                  Grant Access
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Access Grants List */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Grants</h2>

            <div className="space-y-4">
              {grants.length === 0 ? (
                <Card>
                  <CardBody className="text-center py-12">
                    <Lock className="mx-auto text-slate-300 mb-3 w-10 h-10" />
                    <p className="text-slate-600">No access grants yet</p>
                  </CardBody>
                </Card>
              ) : (
                grants.map((grant) => (
                  <Card key={grant.id} className="overflow-hidden">
                    <div className="p-6 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Users className="text-slate-600 w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-mono text-sm font-semibold text-slate-900">
                                {formatAddress(grant.address)}
                              </p>
                              <Badge variant={grant.status === 'active' ? 'success' : grant.status === 'pending' ? 'default' : 'danger'}>
                                {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              {grant.room} • {grant.role === 'GUEST' ? 'Guest' : 'Room Admin'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatDate(grant.startTime)} → {formatDate(grant.endTime)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRevokeGrant(grant.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-colors flex-shrink-0"
                        title="Revoke access"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
