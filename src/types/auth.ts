export interface User {
  id: string
  name: string
  email: string
  phone: string
  company: string
  createdAt: string
  verification: {
    emailVerified: boolean
    phoneVerified: boolean
    emailVerifiedAt?: string
    phoneVerifiedAt?: string
  }
  subscription: {
    plan: 'trial' | 'basic' | 'pro' | 'enterprise' | 'premium'
    status: 'active' | 'expired' | 'cancelled'
    trialEndsAt?: string
    createdAt: string
  }
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
  verifyPhone: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
  resendEmailCode: (email: string) => Promise<{ success: boolean; error?: string }>
  resendSmsCode: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  company: string
  password: string
  confirmPassword: string
}

export interface StoredUser extends User {
  password: string
}

export interface VerificationCode {
  email: string
  emailCode?: string
  smsCode?: string
  emailCodeExpiry?: string
  smsCodeExpiry?: string
  emailCodeGeneratedAt?: string
  smsCodeGeneratedAt?: string
}