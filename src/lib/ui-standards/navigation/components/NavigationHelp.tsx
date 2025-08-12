/**
 * Componente visual padronizado para mostrar atalhos de navegação
 * Reutilizável em todas as calculadoras
 */

import React from 'react'
import { KeyboardNavigationHook } from '../types'

interface NavigationHelpProps {
  /** Hook de navegação com configuração ativa */
  navigation: KeyboardNavigationHook
  /** Estilo do componente */
  variant?: 'compact' | 'full' | 'dashboard'
  /** Classe CSS adicional */
  className?: string
}

export const NavigationHelp: React.FC<NavigationHelpProps> = ({
  navigation,
  variant = 'full',
  className = ''
}) => {
  if (!navigation.config) return null

  const { helpText } = navigation.config

  // Versão compacta (apenas badges)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 text-xs ${className}`}>
        {helpText?.tab && (
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Tab</kbd>
            <span className="text-gray-500">{helpText.tab}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Enter</kbd>
          <span className="text-gray-500">{helpText.enter}</span>
        </div>
      </div>
    )
  }

  // Versão para dashboard (com indicador de status)
  if (variant === 'dashboard') {
    return (
      <div className={`text-xs text-gray-500 mt-1 ${className}`}>
        {helpText?.tab && (
          <>
            <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Tab</kbd> {helpText.tab}
            <br />
          </>
        )}
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Enter</kbd>
          <span>{helpText.enter}</span>
          {navigation.canCalculate && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              ✓ Pronto
            </span>
          )}
        </div>
      </div>
    )
  }

  // Versão completa (com explicações detalhadas)
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Atalhos de Navegação</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p>• Use <strong>vírgula</strong> para casas decimais (ex: 4,50)</p>
                {helpText?.tab && (
                  <p>• Pressione <strong>Tab</strong> para {helpText.tab}</p>
                )}
                <p>• Pressione <strong>Enter</strong> para {helpText.enter}</p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">Status:</span>
                  {navigation.canCalculate ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      ✓ Dados válidos - pressione Enter
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      ⚠ Complete os campos obrigatórios
                    </span>
                  )}
                </div>
                <p className="text-xs">• Sistema considera aproveitamento de sobras</p>
                <p className="text-xs">• Cálculos otimizados automaticamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook para facilitar o uso do componente
 */
export const useNavigationHelp = (navigation: KeyboardNavigationHook) => {
  const NavigationHelpComponent = ({ 
    variant = 'full' as const, 
    className = '' 
  }) => (
    <NavigationHelp 
      navigation={navigation} 
      variant={variant} 
      className={className} 
    />
  )

  return NavigationHelpComponent
}