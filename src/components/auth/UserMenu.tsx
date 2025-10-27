import React, { useState, useEffect } from 'react'
import { authService, AuthState } from '../../services/auth'
import { AuthModal } from './AuthModal'
import {
  UserIcon,
  CogIcon,
  DocumentArrowDownIcon,
  Bars3Icon
} from '../../../components/icons/Icons'

interface UserMenuProps {
  onProfileCreate?: () => void
  onProfileManage?: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onProfileCreate,
  onProfileManage
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange(setAuthState)

    return unsubscribe
  }, [])

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      setShowDropdown(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // Auth state will be updated automatically via the subscription
  }

  if (authState.loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!authState.user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <UserIcon className="h-5 w-5" />
          <span>Đăng nhập</span>
        </button>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-3 bg-card-background rounded-full p-2 hover:opacity-90 transition-opacity"
        >
          {authState.user.user_metadata?.avatar_url ? (
            <img
              src={authState.user.user_metadata.avatar_url}
              alt="Avatar"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
          )}

          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-text-primary">
              {authState.user.user_metadata?.full_name || authState.user.email}
            </div>
            <div className="text-xs text-text-secondary">
              {authState.user.email}
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-card-background rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-border-color">
                  <div className="text-sm font-medium text-text-primary">
                    {authState.user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {authState.user.email}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      onProfileCreate?.()
                      setShowDropdown(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-background transition-colors"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-3" />
                    Tạo Profile mới
                  </button>

                  <button
                    onClick={() => {
                      onProfileManage?.()
                      setShowDropdown(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-background transition-colors"
                  >
                    <CogIcon className="h-4 w-4 mr-3" />
                    Quản lý Profiles
                  </button>
                </div>

                {/* Sign Out */}
                <div className="border-t border-border-color py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-background transition-colors"
                  >
                    <Bars3Icon className="h-4 w-4 mr-3" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}
