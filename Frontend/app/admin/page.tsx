'use client'

import { useState } from 'react'
import { Shield, Users, Lock, Settings, Trash2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/UI'
import HardwareProvisioning from '@/components/HardwareProvisioning'

interface Admin {
  id: string
  address: string
  role: 'SUPER_ADMIN' | 'ADMIN'
  permissions: string[]
  status: 'active' | 'inactive'
  addedAt: number
}

export default function AdminPanel() {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: '1',
      address: '0x742d35Cc6634C0532925a3b844Bc7e7a6f8e3c0b',
      role: 'SUPER_ADMIN',
      permissions: ['create_rooms', 'manage_users', 'system_settings', 'view_logs'],
      status: 'active',
      addedAt: Date.now() - 86400 * 30,
    },
  ])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'hardware' | 'system'>('users')

  const handleRevokeAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to revoke admin access?')) return

    try {
      // TODO: Call API to revoke admin access
      setAdmins((prev) => prev.filter((a) => a.id !== adminId))
      setSuccess('Admin access revoked')
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError('Failed to revoke admin access')
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation />

      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Shield className="text-purple-600 w-8 h-8" />
              Admin Panel
            </h1>
            
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'users'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                User Management
              </button>
              <button
                onClick={() => setActiveTab('hardware')}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'hardware'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Hardware Provisioning
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'system'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                System Info
              </button>
            </div>
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

          {/* Users Tab Content */}
          {activeTab === 'users' && (
            <div className="space-y-8">
              {/* Admin Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Shield className="text-purple-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total Admins</p>
                        <p className="text-2xl font-bold text-slate-900">{admins.length}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Active</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {admins.filter((a) => a.status === 'active').length}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Lock className="text-orange-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Super Admins</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {admins.filter((a) => a.role === 'SUPER_ADMIN').length}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Admins List */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Administrator Accounts</h2>
                <div className="space-y-4">
                  {admins.length === 0 ? (
                    <Card>
                      <CardBody className="text-center py-12">
                        <Shield className="mx-auto text-slate-300 mb-3 w-10 h-10" />
                        <p className="text-slate-600">No admin accounts</p>
                      </CardBody>
                    </Card>
                  ) : (
                    admins.map((admin) => (
                      <Card key={admin.id} className="overflow-hidden">
                        <div className="p-6 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Shield className="text-slate-600 w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-mono text-sm font-semibold text-slate-900">
                                    {formatAddress(admin.address)}
                                  </p>
                                  <Badge variant={admin.status === 'active' ? 'success' : 'danger'}>
                                    {admin.status === 'active' ? 'Active' : 'Inactive'}
                                  </Badge>
                                  <Badge>{admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</Badge>
                                </div>
                                <p className="text-xs text-slate-600 mt-2">
                                  Added on {formatDate(admin.addedAt)}
                                </p>
                              </div>
                            </div>

                            {/* Permissions */}
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <p className="text-xs text-slate-600 font-semibold mb-2">Permissions:</p>
                              <div className="flex flex-wrap gap-2">
                                {admin.permissions.map((perm) => (
                                  <span
                                    key={perm}
                                    className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700"
                                  >
                                    {perm.replace(/_/g, ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRevokeAdmin(admin.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-colors flex-shrink-0"
                            title="Revoke admin access"
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
          )}

          {/* Hardware Provisioning Tab */}
          {activeTab === 'hardware' && <HardwareProvisioning />}

          {/* System Info Tab */}
          {activeTab === 'system' && (
            <Card>
              <CardBody className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Contract Address</p>
                    <p className="text-sm font-mono text-slate-900 mt-1">
                      0x5FbDB2315678afccb33d7d144aca41937d0cf6ae
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Network</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">Anvil (Local BSC Fork)</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">RPC Endpoint</p>
                    <p className="text-sm font-mono text-slate-900 mt-1">https://rpc.jainhardik06.in</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Chain ID</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">31337</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
