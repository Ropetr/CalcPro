/**
 * Hook personalizado para navegação por teclado padronizada
 * Implementa padrão TAB (adicionar item) e ENTER (calcular)
 */

import { useState, useEffect } from 'react'
import { NavigationConfig, KeyboardNavigationHook } from './types'

export const useKeyboardNavigation = (): KeyboardNavigationHook => {
  const [config, setConfig] = useState<NavigationConfig | null>(null)
  const [canCalculate, setCanCalculate] = useState(false)

  useEffect(() => {
    if (!config) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement
      const fieldName = target?.getAttribute('data-field')
      
      if (!fieldName) return

      // Encontrar configuração do campo atual
      const currentField = config.fields.find(field => field.name === fieldName)
      if (!currentField) return

      // TAB: Adicionar novo item (apenas no último campo da sequência)
      if (event.key === 'Tab') {
        const lastField = config.fields[config.fields.length - 1]
        if (currentField.name === lastField.name) {
          event.preventDefault()
          
          // Salvar valor atual antes de executar ação
          if (target.value && target.getAttribute('data-ambiente-id')) {
            // Trigger change event para salvar o valor
            target.dispatchEvent(new Event('blur'))
          }
          
          config.onTabAction()
        }
      }

      // ENTER: Calcular (se dados estão válidos)
      if (event.key === 'Enter') {
        event.preventDefault()
        
        // Verificar se pode calcular
        const isValid = config.canCalculate ? config.canCalculate() : validateRequiredFields()
        
        if (isValid) {
          config.onEnterAction()
        } else {
          // Feedback visual de que não pode calcular
          showValidationFeedback(target)
        }
      }
    }

    const validateRequiredFields = (): boolean => {
      const requiredFields = config.fields.filter(field => field.required)
      
      return requiredFields.every(field => {
        const elements = document.querySelectorAll(`[data-field="${field.name}"]`)
        
        // Para múltiplos ambientes, pelo menos um deve estar preenchido
        return Array.from(elements).some(element => {
          const input = element as HTMLInputElement
          const value = input.value.trim()
          
          if (!value) return false
          
          // Validação customizada se fornecida
          if (field.validation) {
            return field.validation(value)
          }
          
          // Validação padrão para números
          if (field.name === 'largura' || field.name === 'comprimento') {
            const num = parseFloat(value.replace(',', '.'))
            return !isNaN(num) && num > 0
          }
          
          return true
        })
      })
    }

    const showValidationFeedback = (target: HTMLElement) => {
      // Feedback visual temporário
      target.style.borderColor = '#ef4444'
      target.style.backgroundColor = '#fef2f2'
      
      setTimeout(() => {
        target.style.borderColor = ''
        target.style.backgroundColor = ''
      }, 1000)
    }

    // Atualizar status de validação periodicamente
    const updateCanCalculate = () => {
      const isValid = config.canCalculate ? config.canCalculate() : validateRequiredFields()
      setCanCalculate(isValid)
    }

    // Listener para eventos de teclado
    window.addEventListener('keydown', handleKeyDown)
    
    // Listener para mudanças nos campos (validação em tempo real)
    const handleInputChange = () => updateCanCalculate()
    config.fields.forEach(field => {
      const elements = document.querySelectorAll(`[data-field="${field.name}"]`)
      elements.forEach(element => {
        element.addEventListener('input', handleInputChange)
        element.addEventListener('blur', handleInputChange)
      })
    })

    // Validação inicial
    updateCanCalculate()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      
      // Limpar listeners dos campos
      config.fields.forEach(field => {
        const elements = document.querySelectorAll(`[data-field="${field.name}"]`)
        elements.forEach(element => {
          element.removeEventListener('input', handleInputChange)
          element.removeEventListener('blur', handleInputChange)
        })
      })
    }
  }, [config])

  return {
    config,
    setConfig,
    canCalculate
  }
}

/**
 * Configurações pré-definidas para diferentes tipos de calculadoras
 */
export const navigationPresets = {
  // Padrão para calculadoras com ambientes (forro, drywall, etc)
  ambientes: (onAddAmbiente: () => void, onCalculate: () => void): NavigationConfig => ({
    fields: [
      { name: 'comprimento', selector: '[data-field="comprimento"]', required: true },
      { name: 'largura', selector: '[data-field="largura"]', required: true },
      { name: 'descricao', selector: '[data-field="descricao"]' }
    ],
    onTabAction: onAddAmbiente,
    onEnterAction: onCalculate,
    helpText: {
      tab: 'adicionar novo ambiente',
      enter: 'calcular (se dados válidos)'
    }
  }),

  // Padrão para calculadoras simples (single environment)
  simples: (onCalculate: () => void): NavigationConfig => ({
    fields: [
      { name: 'comprimento', selector: '[data-field="comprimento"]', required: true },
      { name: 'largura', selector: '[data-field="largura"]', required: true }
    ],
    onTabAction: () => {}, // Não faz nada no TAB
    onEnterAction: onCalculate,
    helpText: {
      tab: '',
      enter: 'calcular'
    }
  })
}