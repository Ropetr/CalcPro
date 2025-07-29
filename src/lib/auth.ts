import { StoredUser, User, RegisterData, VerificationCode } from '@/types/auth'

const USERS_KEY = 'calcpro_users'
const CURRENT_USER_KEY = 'calcpro_current_user'
const VERIFICATION_CODES_KEY = 'calcpro_verification_codes'

// Função para criar usuário admin padrão
const createDefaultAdmin = (): StoredUser => {
  const now = new Date().toISOString()
  return {
    id: 'admin-default',
    name: 'Administrador CalcPro',
    email: 'admin@calcpro.app.br',
    phone: '(11) 99999-9999',
    company: 'CalcPro Sistemas',
    password: 'Rodelo122509.',
    createdAt: now,
    verification: {
      emailVerified: true,
      phoneVerified: true,
      emailVerifiedAt: now
    },
    subscription: {
      plan: 'premium',
      status: 'active',
      createdAt: now
    }
  }
}

// Funções utilitárias para localStorage
export const authStorage = {
  getUsers: (): StoredUser[] => {
    if (typeof window === 'undefined') return []
    const users = localStorage.getItem(USERS_KEY)
    const parsedUsers = users ? JSON.parse(users) : []
    
    // Verificar se admin padrão existe, se não, criar
    const adminExists = parsedUsers.find((user: StoredUser) => user.email === 'admin@calcpro.app.br')
    if (!adminExists) {
      const defaultAdmin = createDefaultAdmin()
      parsedUsers.push(defaultAdmin)
      localStorage.setItem(USERS_KEY, JSON.stringify(parsedUsers))
    }
    
    return parsedUsers
  },

  saveUsers: (users: StoredUser[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  },

  setCurrentUser: (user: User | null) => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  },

  getVerificationCodes: (): VerificationCode[] => {
    if (typeof window === 'undefined') return []
    const codes = localStorage.getItem(VERIFICATION_CODES_KEY)
    return codes ? JSON.parse(codes) : []
  },

  saveVerificationCodes: (codes: VerificationCode[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(codes))
  }
}

// Validações
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Senha deve ter pelo menos 6 caracteres' }
  }
  return { valid: true }
}

// Funções utilitárias para códigos
export const generateEmailCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6 dígitos
}

export const generateSmsCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString() // 4 dígitos
}

export const isCodeExpired = (generatedAt: string, expiryMinutes: number = 15): boolean => {
  const generated = new Date(generatedAt)
  const now = new Date()
  return (now.getTime() - generated.getTime()) > (expiryMinutes * 60 * 1000)
}

// Envio real de email via API route
export const sendVerificationEmailCode = async (email: string, code: string, userName: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // No ambiente de desenvolvimento, ainda mostrar no console
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 EMAIL DE VERIFICAÇÃO:`)
      console.log(`Para: ${email}`)
      console.log(`Código: ${code}`)
      console.log(`Nome: ${userName}`)
    }

    // Chamar API route para envio de email
    const response = await fetch('/api/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code, userName })
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error)
    return { success: false, error: 'Erro no envio do email de verificação' }
  }
}

export const simulateSmsSend = async (phone: string, code: string): Promise<void> => {
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log(`📱 SMS SIMULADO ENVIADO:`)
  console.log(`Para: ${phone}`)
  console.log(`Código: ${code}`)
  console.log(`Este código expira em 15 minutos.`)
}

// Funções de autenticação
export const registerUser = async (userData: RegisterData): Promise<{ success: boolean; error?: string; requiresVerification?: boolean }> => {
  try {
    const users = authStorage.getUsers()
    
    // Verificar se email já existe
    if (users.find(user => user.email === userData.email)) {
      return { success: false, error: 'Este email já está cadastrado' }
    }

    // Validações
    if (!validateEmail(userData.email)) {
      return { success: false, error: 'Email inválido' }
    }

    const passwordValidation = validatePassword(userData.password)
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error }
    }

    if (userData.password !== userData.confirmPassword) {
      return { success: false, error: 'Senhas não coincidem' }
    }

    // Criar usuário (não verificado)
    const now = new Date().toISOString()
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 5) // 5 dias de trial

    const newUser: StoredUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      company: userData.company,
      password: userData.password, // Em produção, usar hash
      createdAt: now,
      verification: {
        emailVerified: false,
        phoneVerified: true // Desabilitado - marcar como já verificado
      },
      subscription: {
        plan: 'trial',
        status: 'active',
        trialEndsAt: trialEndsAt.toISOString(),
        createdAt: now
      }
    }

    // Salvar usuário
    users.push(newUser)
    authStorage.saveUsers(users)

    // Gerar apenas código de email
    const emailCode = generateEmailCode()
    const codeGeneratedAt = now

    const verificationCodes = authStorage.getVerificationCodes()
    const existingCodeIndex = verificationCodes.findIndex(c => c.email === userData.email)
    
    const newVerificationCode: VerificationCode = {
      email: userData.email,
      emailCode,
      emailCodeGeneratedAt: codeGeneratedAt
    }

    if (existingCodeIndex >= 0) {
      verificationCodes[existingCodeIndex] = newVerificationCode
    } else {
      verificationCodes.push(newVerificationCode)
    }
    
    authStorage.saveVerificationCodes(verificationCodes)

    // Enviar apenas email de verificação
    const emailResult = await sendVerificationEmailCode(userData.email, emailCode, userData.name)
    if (!emailResult.success) {
      console.error('Erro ao enviar email:', emailResult.error)
      // Continuar mesmo se email falhar, apenas logar erro
    }

    // Retornar sucesso indicando que precisa de verificação
    return { success: true, requiresVerification: true }
  } catch (error) {
    return { success: false, error: 'Erro interno. Tente novamente.' }
  }
}

export const loginUser = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
  try {
    const users = authStorage.getUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return { success: false, error: 'Email ou senha incorretos' }
    }

    // Verificar se trial expirou
    if (user.subscription.plan === 'trial' && user.subscription.trialEndsAt) {
      const trialEnd = new Date(user.subscription.trialEndsAt)
      if (new Date() > trialEnd) {
        // Atualizar status para expirado
        user.subscription.status = 'expired'
        authStorage.saveUsers(users)
      }
    }

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, error: 'Erro interno. Tente novamente.' }
  }
}

export const logoutUser = () => {
  authStorage.setCurrentUser(null)
}

// Função para verificar email
export const verifyEmailCode = (email: string, code: string): { success: boolean; error?: string } => {
  try {
    const verificationCodes = authStorage.getVerificationCodes()
    const codeData = verificationCodes.find(c => c.email === email)
    
    if (!codeData || !codeData.emailCode || !codeData.emailCodeGeneratedAt) {
      return { success: false, error: 'Código não encontrado. Solicite um novo código.' }
    }

    if (isCodeExpired(codeData.emailCodeGeneratedAt)) {
      return { success: false, error: 'Código expirado. Solicite um novo código.' }
    }

    if (codeData.emailCode !== code) {
      return { success: false, error: 'Código incorreto. Verifique e tente novamente.' }
    }

    // Atualizar usuário como email verificado
    const users = authStorage.getUsers()
    const userIndex = users.findIndex(u => u.email === email)
    
    if (userIndex === -1) {
      return { success: false, error: 'Usuário não encontrado.' }
    }

    users[userIndex].verification.emailVerified = true
    users[userIndex].verification.emailVerifiedAt = new Date().toISOString()
    authStorage.saveUsers(users)

    // Remover código usado
    codeData.emailCode = undefined
    codeData.emailCodeGeneratedAt = undefined
    authStorage.saveVerificationCodes(verificationCodes)

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno. Tente novamente.' }
  }
}

// Função para verificar SMS (desabilitada)
export const verifySmsCode = (email: string, code: string): { success: boolean; error?: string } => {
  // SMS desabilitado - sempre retorna sucesso
  return { success: true }
}

// Função para reenviar código de email
export const resendEmailCode = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const users = authStorage.getUsers()
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return { success: false, error: 'Usuário não encontrado.' }
    }

    if (user.verification.emailVerified) {
      return { success: false, error: 'Email já verificado.' }
    }

    // Gerar novo código
    const emailCode = generateEmailCode()
    const now = new Date().toISOString()

    const verificationCodes = authStorage.getVerificationCodes()
    const codeIndex = verificationCodes.findIndex(c => c.email === email)
    
    if (codeIndex >= 0) {
      verificationCodes[codeIndex].emailCode = emailCode
      verificationCodes[codeIndex].emailCodeGeneratedAt = now
    } else {
      verificationCodes.push({
        email,
        emailCode,
        emailCodeGeneratedAt: now
      })
    }
    
    authStorage.saveVerificationCodes(verificationCodes)

    // Enviar email real
    const emailResult = await sendVerificationEmailCode(email, emailCode, user.name)
    if (!emailResult.success) {
      return { success: false, error: emailResult.error || 'Erro ao enviar email' }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno. Tente novamente.' }
  }
}

// Função para reenviar código SMS
export const resendSmsCode = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const users = authStorage.getUsers()
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return { success: false, error: 'Usuário não encontrado.' }
    }

    if (user.verification.phoneVerified) {
      return { success: false, error: 'Telefone já verificado.' }
    }

    // SMS desabilitado
    return { success: false, error: 'Verificação por SMS desabilitada' }
  } catch (error) {
    return { success: false, error: 'Erro interno. Tente novamente.' }
  }
}

// Função para verificar status da assinatura
export const getSubscriptionStatus = (user: User) => {
  const { subscription } = user
  
  if (subscription.plan === 'trial') {
    if (subscription.trialEndsAt) {
      const trialEnd = new Date(subscription.trialEndsAt)
      const now = new Date()
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysLeft <= 0) {
        return { status: 'expired', message: 'Seu período de teste expirou', daysLeft: 0 }
      }
      
      return { 
        status: 'trial', 
        message: `${daysLeft} dia${daysLeft !== 1 ? 's' : ''} restante${daysLeft !== 1 ? 's' : ''} no seu teste gratuito`,
        daysLeft 
      }
    }
  }
  
  return { status: subscription.status, message: `Plano ${subscription.plan} ativo`, daysLeft: null }
}