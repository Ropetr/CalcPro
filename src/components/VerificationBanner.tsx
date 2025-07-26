'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AlertCircle, CheckCircle, Mail, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function VerificationBanner() {
  const { user } = useAuth()

  if (!user) return null

  const { emailVerified, phoneVerified } = user.verification
  
  // Se email está verificado, não mostrar banner (SMS desabilitado)
  if (emailVerified) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Verificação pendente:</span>
            {' '}
            Confirme seu email para ter acesso completo às funcionalidades.
          </p>
          <div className="mt-2 flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-gray-600">
                Email pendente
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Link
              href={`/verificacao?email=${encodeURIComponent(user.email)}`}
              className="text-sm font-medium text-yellow-700 underline hover:text-yellow-600"
            >
              Verificar agora →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}