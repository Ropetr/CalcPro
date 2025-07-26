'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthContextType, RegisterData } from '@/types/auth'
import { authStorage, registerUser, loginUser, logoutUser, verifyEmailCode, verifySmsCode, resendEmailCode, resendSmsCode } from '@/lib/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se há usuário logado ao inicializar
  useEffect(() => {
    const currentUser = authStorage.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = loginUser(email, password)
    
    if (result.success && result.user) {
      setUser(result.user)
      authStorage.setCurrentUser(result.user)
    }
    
    setIsLoading(false)
    return { success: result.success, error: result.error }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string; requiresVerification?: boolean }> => {
    setIsLoading(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = await registerUser(userData)
    
    setIsLoading(false)
    return { 
      success: result.success, 
      error: result.error,
      requiresVerification: result.requiresVerification 
    }
  }

  const verifyEmail = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const result = verifyEmailCode(email, code)
    
    // Se verificou com sucesso, atualizar o usuário atual se for o mesmo
    if (result.success && user && user.email === email) {
      const updatedUser = { ...user, verification: { ...user.verification, emailVerified: true } }
      setUser(updatedUser)
      authStorage.setCurrentUser(updatedUser)
    }
    
    return result
  }

  const verifyPhone = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const result = verifySmsCode(email, code)
    
    // Se verificou com sucesso, atualizar o usuário atual se for o mesmo
    if (result.success && user && user.email === email) {
      const updatedUser = { ...user, verification: { ...user.verification, phoneVerified: true } }
      setUser(updatedUser)
      authStorage.setCurrentUser(updatedUser)
    }
    
    return result
  }

  const logout = () => {
    setUser(null)
    logoutUser()
    // Redirecionar para home
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    verifyEmail,
    verifyPhone,
    resendEmailCode,
    resendSmsCode,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}