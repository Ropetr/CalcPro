/**
 * Hook personalizado para navegação por teclado padronizada
 * Implementa padrão TAB (adicionar item) e ENTER (calcular)
 */

import { useState, useEffect } from 'react'
import { NavigationConfig, KeyboardNavigationHook } from './types'

export const useKeyboardNavigation = (): KeyboardNavigationHook => {
  const [config, setConfig] = useState<NavigationConfig | null>(null)
  const [canCalculate, setCanCalculate] = useState(false)

  // Funções expostas do hook
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!config) return
    
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    const fieldName = target?.getAttribute('data-field') || target?.getAttribute('data-nav-index')
    
    if (!fieldName) return

    // TAB: Adicionar novo item
    if (event.key === 'Tab') {
      event.preventDefault()
      config.onTabAction()
    }

    // ENTER: Calcular (se dados estão válidos)
    if (event.key === 'Enter') {
      event.preventDefault()
      
      if (canCalculate) {
        config.onEnterAction()
      }
    }
  }

  const addItem = () => {
    if (config) {
      config.onTabAction()
      
      // Focar automaticamente no primeiro campo (largura) do novo item após criação
      setTimeout(() => {
        focusFirstFieldOfNewItem()
      }, 100)
    }
  }

  const calculate = () => {
    if (config && canCalculate) {
      config.onEnterAction()
    }
  }

  // Função para focar no primeiro campo do item mais recentemente adicionado
  const focusFirstFieldOfNewItem = () => {
    if (!config) return
    
    const firstField = config.fields[0]
    if (!firstField) return

    // Buscar padrões comuns de seletores para diferentes tipos de calculadora
    const possibleSelectors = [
      // Padrão forro-pvc (cômodos) - último elemento DOM (primeiro visualmente)
      '[data-comodo-id]:last-child [data-ambiente-id] input[type="text"]:first-of-type',
      // Padrão outras calculadoras (medidas) - último elemento DOM (primeiro visualmente)
      '[data-medida-id]:last-child input[type="text"]',
      '[data-medida-id]:last-child input[type="number"]',
      '[data-ambiente-id]:last-child input[type="number"]',
      // Padrão alternativo por data-field
      `[data-field="${firstField.name}"]:last-of-type`,
      // Padrão geral (último input de texto adicionado)
      'input[type="text"]:last-of-type'
    ]

    for (const selector of possibleSelectors) {
      const input = document.querySelector(selector) as HTMLInputElement
      if (input) {
        input.focus()
        input.select() // Selecionar o texto se houver
        break
      }
    }
  }

  useEffect(() => {
    if (!config) return

    const internalHandleKeyDown = (event: KeyboardEvent) => {
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
          
          // Focar automaticamente no primeiro campo (largura) do novo item após criação
          setTimeout(() => {
            focusFirstFieldOfNewItem()
          }, 100)
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
    window.addEventListener('keydown', internalHandleKeyDown)
    
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
      window.removeEventListener('keydown', internalHandleKeyDown)
      
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
    canCalculate,
    handleKeyDown,
    addItem,
    calculate
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