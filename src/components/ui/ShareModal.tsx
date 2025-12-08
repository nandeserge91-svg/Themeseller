'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Link as LinkIcon, 
  Check, 
  Facebook, 
  Twitter, 
  Linkedin,
  Send,
  MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
  description?: string
  image?: string
}

export default function ShareModal({ isOpen, onClose, url, title, description, image }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || '')

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2] hover:bg-[#1A94DA]',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#095196]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#20BD5A]',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-[#0088CC] hover:bg-[#007AB8]',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Lien copié !')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Erreur lors de la copie')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled or error
      }
    }
  }

  const handleSocialClick = (socialUrl: string) => {
    window.open(socialUrl, '_blank', 'width=600,height=400,scrollbars=yes')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Partager</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Product Preview */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="font-semibold text-gray-900 line-clamp-2">{title}</p>
                  {description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
                  )}
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {socialLinks.map((social) => (
                    <button
                      key={social.name}
                      onClick={() => handleSocialClick(social.url)}
                      className={`${social.color} p-3 rounded-xl text-white transition-colors flex items-center justify-center group`}
                      title={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>

                {/* Copy Link */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600"
                    />
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                      copied 
                        ? 'bg-accent-500 text-white' 
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copié
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        Copier
                      </>
                    )}
                  </button>
                </div>

                {/* Native Share (mobile) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors font-medium"
                  >
                    Plus d'options de partage...
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}






