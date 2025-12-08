'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Mail,
  Shield,
  Users,
  Store,
  Eye,
  Edit2,
  Trash2,
  Ban,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react'
import Button from '@/components/ui/Button'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'ADMIN' | 'VENDOR' | 'CLIENT'
  status: 'active' | 'pending' | 'suspended'
  orders?: number
  products?: number
  sales?: number
  joinDate: string
  phone?: string
  bio?: string
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'CLIENT',
    status: 'active',
    orders: 5,
    joinDate: '2024-01-10',
    phone: '+33 6 12 34 56 78',
  },
  {
    id: '2',
    name: 'WebStudio Pro',
    email: 'contact@webstudio.pro',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    role: 'VENDOR',
    status: 'active',
    products: 12,
    sales: 234,
    joinDate: '2023-06-15',
    phone: '+33 1 23 45 67 89',
    bio: 'Agence de création de thèmes WordPress et templates HTML premium.',
  },
  {
    id: '3',
    name: 'Sophie Durand',
    email: 'sophie.d@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'CLIENT',
    status: 'active',
    orders: 2,
    joinDate: '2024-01-05',
    phone: '+33 6 98 76 54 32',
  },
  {
    id: '4',
    name: 'DesignHub',
    email: 'hello@designhub.io',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    role: 'VENDOR',
    status: 'pending',
    products: 0,
    sales: 0,
    joinDate: '2024-01-14',
    phone: '+33 1 11 22 33 44',
    bio: 'Studio de design spécialisé en UI/UX et templates Figma.',
  },
  {
    id: '5',
    name: 'FunnelExperts',
    email: 'team@funnelexperts.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
    role: 'VENDOR',
    status: 'active',
    products: 8,
    sales: 156,
    joinDate: '2023-09-20',
    phone: '+33 1 55 66 77 88',
    bio: 'Experts en tunnels de vente et marketing automation.',
  },
]

const roleConfig = {
  ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-700', icon: Shield },
  VENDOR: { label: 'Vendeur', color: 'bg-purple-100 text-purple-700', icon: Store },
  CLIENT: { label: 'Client', color: 'bg-blue-100 text-blue-700', icon: Users },
}

const statusConfig = {
  active: { label: 'Actif', color: 'bg-accent-100 text-accent-700' },
  pending: { label: 'En attente', color: 'bg-warning-100 text-warning-700' },
  suspended: { label: 'Suspendu', color: 'bg-red-100 text-red-700' },
}

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Actions
  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'suspended' : 'active'
        }
      }
      return user
    }))
    setOpenMenuId(null)
  }

  const handleApproveVendor = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, status: 'active' }
      }
      return user
    }))
    setOpenMenuId(null)
  }

  const handleDeleteUser = () => {
    if (deletingUser) {
      setUsers(users.filter(user => user.id !== deletingUser.id))
      setDeletingUser(null)
    }
  }

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ))
    setEditingUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
              <p className="text-gray-600">{users.length} utilisateurs inscrits</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'CLIENT').length}
                  </p>
                  <p className="text-sm text-gray-500">Clients</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'VENDOR').length}
                  </p>
                  <p className="text-sm text-gray-500">Vendeurs</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-500">Actifs</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-500">En attente</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les rôles</option>
                <option value="CLIENT">Clients</option>
                <option value="VENDOR">Vendeurs</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rôle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Stats</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Inscrit le</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const role = roleConfig[user.role]
                    const status = statusConfig[user.status]
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                            <role.icon className="w-3 h-3" />
                            {role.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {user.role === 'VENDOR' 
                              ? `${user.products || 0} produits • ${user.sales || 0} ventes`
                              : `${user.orders || 0} commandes`
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setViewingUser(user)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Voir le profil"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a 
                              href={`mailto:${user.email}`}
                              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                              title="Envoyer un email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                            
                            {/* Menu déroulant */}
                            <div className="relative" ref={openMenuId === user.id ? menuRef : null}>
                              <button 
                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              <AnimatePresence>
                                {openMenuId === user.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
                                  >
                                    <button
                                      onClick={() => {
                                        setEditingUser(user)
                                        setOpenMenuId(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      Modifier le profil
                                    </button>
                                    
                                    {user.status === 'pending' && user.role === 'VENDOR' && (
                                      <button
                                        onClick={() => handleApproveVendor(user.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-600 hover:bg-accent-50"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Approuver le vendeur
                                      </button>
                                    )}
                                    
                                    <button
                                      onClick={() => handleToggleStatus(user.id)}
                                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                                        user.status === 'suspended' 
                                          ? 'text-accent-600 hover:bg-accent-50' 
                                          : 'text-warning-600 hover:bg-warning-50'
                                      }`}
                                    >
                                      {user.status === 'suspended' ? (
                                        <>
                                          <CheckCircle className="w-4 h-4" />
                                          Réactiver le compte
                                        </>
                                      ) : (
                                        <>
                                          <Ban className="w-4 h-4" />
                                          Suspendre le compte
                                        </>
                                      )}
                                    </button>
                                    
                                    <div className="border-t border-gray-100 my-1"></div>
                                    
                                    <button
                                      onClick={() => {
                                        setDeletingUser(user)
                                        setOpenMenuId(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Supprimer le compte
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de visualisation */}
      <AnimatePresence>
        {viewingUser && (
          <ViewUserModal user={viewingUser} onClose={() => setViewingUser(null)} />
        )}
      </AnimatePresence>

      {/* Modal d'édition */}
      <AnimatePresence>
        {editingUser && (
          <EditUserModal 
            user={editingUser} 
            onClose={() => setEditingUser(null)} 
            onSave={handleSaveUser}
          />
        )}
      </AnimatePresence>

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {deletingUser && (
          <DeleteConfirmModal 
            user={deletingUser} 
            onClose={() => setDeletingUser(null)} 
            onConfirm={handleDeleteUser}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Modal de visualisation du profil
function ViewUserModal({ user, onClose }: { user: User; onClose: () => void }) {
  const role = roleConfig[user.role]
  const status = statusConfig[user.status]
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header avec avatar */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-white/80">{user.email}</p>
        </div>
        
        {/* Contenu */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${role.color}`}>
              <role.icon className="w-4 h-4" />
              {role.label}
            </span>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          
          <div className="space-y-4">
            {user.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm w-24">Téléphone</span>
                <span className="font-medium text-gray-900">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-sm w-24">Inscrit le</span>
              <span className="font-medium text-gray-900">
                {new Date(user.joinDate).toLocaleDateString('fr-FR', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </span>
            </div>
            {user.role === 'VENDOR' && (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 text-sm w-24">Produits</span>
                  <span className="font-medium text-gray-900">{user.products || 0}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 text-sm w-24">Ventes</span>
                  <span className="font-medium text-gray-900">{user.sales || 0}</span>
                </div>
              </>
            )}
            {user.role === 'CLIENT' && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm w-24">Commandes</span>
                <span className="font-medium text-gray-900">{user.orders || 0}</span>
              </div>
            )}
            {user.bio && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm block mb-1">Bio</span>
                <p className="text-gray-900">{user.bio}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Fermer
            </Button>
            <a href={`mailto:${user.email}`} className="flex-1">
              <Button className="w-full" leftIcon={<Mail className="w-4 h-4" />}>
                Contacter
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Modal d'édition
function EditUserModal({ 
  user, 
  onClose, 
  onSave 
}: { 
  user: User
  onClose: () => void
  onSave: (user: User) => void 
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    status: user.status,
    bio: user.bio || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...user,
      ...formData,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Modifier le profil</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">ID: {user.id}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="CLIENT">Client</option>
                <option value="VENDOR">Vendeur</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>
          
          {user.role === 'VENDOR' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Enregistrer
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Modal de confirmation de suppression
function DeleteConfirmModal({ 
  user, 
  onClose, 
  onConfirm 
}: { 
  user: User
  onClose: () => void
  onConfirm: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Supprimer ce compte ?
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Vous êtes sur le point de supprimer le compte de <strong>{user.name}</strong>. 
          Cette action est irréversible.
          {user.role === 'VENDOR' && user.products && user.products > 0 && (
            <span className="block mt-2 text-warning-600 font-medium">
              ⚠️ Ce vendeur a {user.products} produit(s) qui seront également supprimés.
            </span>
          )}
        </p>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
