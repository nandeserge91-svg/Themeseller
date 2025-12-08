'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  LogOut,
  Package,
  Settings,
  LayoutDashboard,
  Heart
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import CartSidebar from './CartSidebar'
import CurrencySwitcher from '@/components/ui/CurrencySwitcher'
import SearchBar from '@/components/ui/SearchBar'

const categories = [
  { name: 'WordPress', slug: 'wordpress', icon: '🎨' },
  { name: 'Shopify', slug: 'shopify', icon: '🛒' },
  { name: 'Systeme.io', slug: 'systeme-io', icon: '⚡' },
  { name: 'HTML', slug: 'html', icon: '🌐' },
  { name: 'Figma', slug: 'figma', icon: '✨' },
  { name: 'Tunnels de Vente', slug: 'funnels', icon: '🚀' },
  { name: 'Email Templates', slug: 'email', icon: '📧' },
  { name: 'Landing Pages', slug: 'landing', icon: '📄' },
]

export default function Header() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { items, openCart } = useCartStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ouvrir la recherche avec Ctrl+K ou Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      // Fermer avec Escape
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  // Valeurs côté client seulement
  const cartItemsCount = mounted ? items.length : 0
  const isLoggedIn = mounted ? isAuthenticated() : false
  const currentUser = mounted ? user : null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/produits?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-md'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                Theme<span className="gradient-text">Pro</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Catégories
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown */}
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[280px]">
                    <div className="grid gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/categorie/${cat.slug}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors group/item"
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="font-medium text-gray-700 group-hover/item:text-primary-600">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/produits"
                className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Tous les Produits
              </Link>
              <Link
                href="/vendeurs"
                className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Vendeurs
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Currency Switcher */}
              <div className="hidden sm:block">
                <CurrencySwitcher />
              </div>

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Rechercher...</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-400 bg-white rounded border border-gray-200">
                  ⌘K
                </kbd>
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                      {currentUser?.firstName?.[0] || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[220px]"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">
                            {currentUser?.firstName || 'Mon compte'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{currentUser?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href="/mon-compte"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Mon Compte
                          </Link>
                          <Link
                            href="/mon-compte/achats"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Package className="w-4 h-4" />
                            Mes Achats
                          </Link>
                          <Link
                            href="/mon-compte/favoris"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="w-4 h-4" />
                            Favoris
                          </Link>
                          
                          {(currentUser?.role === 'VENDOR' || currentUser?.role === 'ADMIN') && (
                            <Link
                              href="/vendeur"
                              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Espace Vendeur
                            </Link>
                          )}
                          
                          {currentUser?.role === 'ADMIN' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              Administration
                            </Link>
                          )}
                        </div>
                        
                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={() => {
                              logout()
                              setIsUserMenuOpen(false)
                              router.push('/')
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/connexion"
                    className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/devenir-vendeur"
                    className="btn-primary text-sm"
                  >
                    Devenir Vendeur
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 bg-white/95 backdrop-blur-lg overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des thèmes, templates, funnels..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
                  Catégories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categorie/${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium text-gray-700">{cat.name}</span>
                  </Link>
                ))}
                
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                  <Link
                    href="/produits"
                    className="block px-4 py-3 text-gray-700 hover:bg-primary-50 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tous les Produits
                  </Link>
                  <Link
                    href="/vendeurs"
                    className="block px-4 py-3 text-gray-700 hover:bg-primary-50 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vendeurs
                  </Link>
                </div>

                {!isLoggedIn && (
                  <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                    <Link
                      href="/connexion"
                      className="block px-4 py-3 text-center text-gray-700 hover:bg-primary-50 rounded-xl font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/devenir-vendeur"
                      className="block btn-primary text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Devenir Vendeur
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className="h-16 md:h-20" />

      {/* Search Bar Modal */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  )
}

