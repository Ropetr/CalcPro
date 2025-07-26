'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Smartphone, CheckCircle, RefreshCw } from 'lucide-react'
import { verifyEmailCode, verifySmsCode, resendEmailCode, resendSmsCode } from '@/lib/auth'

export default function VerificacaoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  
  const [emailCode, setEmailCode] = useState(['', '', '', '', '', ''])
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [smsVerified, setSmsVerified] = useState(true) // SMS desabilitado - sempre verificado
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Refs para os inputs
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown para reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Verificar se email está presente
  useEffect(() => {
    if (!email) {
      router.push('/registro')
    }
  }, [email, router])

  // Função para lidar com mudança nos inputs de email
  const handleEmailCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Apenas um dígito por input
    
    const newCode = [...emailCode]
    newCode[index] = value
    setEmailCode(newCode)
    setEmailError('')

    // Auto-focus no próximo input
    if (value && index < 5) {
      emailInputRefs.current[index + 1]?.focus()
    }

    // Auto-submit quando completar
    if (newCode.every(digit => digit !== '') && !isSubmittingEmail) {
      handleEmailVerification(newCode.join(''))
    }
  }

  // Função para lidar com backspace
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !(e.currentTarget as HTMLInputElement).value && index > 0) {
      emailInputRefs.current[index - 1]?.focus()
    }
  }

  // Verificar código de email
  const handleEmailVerification = async (code: string) => {
    if (!email) return
    
    setIsSubmittingEmail(true)
    setEmailError('')

    try {
      const result = verifyEmailCode(email, code)
      
      if (result.success) {
        setEmailVerified(true)
        // Como SMS está sempre verificado, redirecionar imediatamente
        setTimeout(() => router.push('/dashboard'), 1500)
      } else {
        setEmailError(result.error || 'Erro na verificação')
        // Limpar inputs em caso de erro
        setEmailCode(['', '', '', '', '', ''])
        emailInputRefs.current[0]?.focus()
      }
    } catch (error) {
      setEmailError('Erro interno. Tente novamente.')
    } finally {
      setIsSubmittingEmail(false)
    }
  }


  // Reenviar código de email
  const handleResendEmail = async () => {
    if (!email || !canResend) return
    
    setIsResendingEmail(true)
    
    try {
      const result = await resendEmailCode(email)
      if (result.success) {
        setCountdown(60)
        setCanResend(false)
        setEmailCode(['', '', '', '', '', ''])
        emailInputRefs.current[0]?.focus()
      } else {
        setEmailError(result.error || 'Erro ao reenviar código')
      }
    } catch (error) {
      setEmailError('Erro interno. Tente novamente.')
    } finally {
      setIsResendingEmail(false)
    }
  }


  if (!email) {
    return null // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/registro" className="flex items-center justify-center text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar ao registro
        </Link>
        
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-vertical.png" 
              alt="CalcPro" 
              className="h-20 w-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Verificar sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enviamos um código de verificação para seu email
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {email}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Verificação de Email */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              emailVerified ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {emailVerified ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Mail className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {emailVerified ? 'Email Verificado!' : 'Verificar Email'}
              </h3>
              <p className="text-sm text-gray-600">
                {emailVerified ? 'Seu email foi confirmado com sucesso' : 'Digite o código de 6 dígitos'}
              </p>
            </div>
          </div>

          {!emailVerified && (
            <>
              <div className="flex justify-center space-x-2 mb-4">
                {emailCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { emailInputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleEmailCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    disabled={isSubmittingEmail || emailVerified}
                  />
                ))}
              </div>

              {emailError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
                  {emailError}
                </div>
              )}

              {isSubmittingEmail && (
                <div className="text-center text-sm text-gray-600 mb-4">
                  Verificando código...
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleResendEmail}
                  disabled={!canResend || isResendingEmail}
                  className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {isResendingEmail ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  {canResend ? 'Reenviar código' : `Reenviar em ${countdown}s`}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Verificação de SMS - Desabilitada */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Telefone Verificado!
              </h3>
              <p className="text-sm text-gray-600">
                Verificação automática (SMS desabilitado)
              </p>
            </div>
          </div>
        </div>

        {/* Status de conclusão */}
        {emailVerified && smsVerified && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-green-800 font-medium">Conta verificada com sucesso!</div>
            <div className="text-green-600 text-sm">Redirecionando para o dashboard...</div>
          </div>
        )}

        {/* Dica sobre códigos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-blue-800 text-sm">
            💡 <strong>Dica:</strong> Os códigos aparecem no console do navegador (F12) para teste
          </div>
        </div>
      </div>
    </div>
  )
}