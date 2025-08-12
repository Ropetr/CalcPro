/**
 * Hook para formatação automática de valores
 * Sistema integrado de formatação para todas as calculadoras
 */

import { useState, useCallback, useRef } from 'react'
import { FormatConfig, AutoFormatHook, FormattedValue } from './types'
import { formatValue, autoCompleteDimension } from './formatters'

export const useAutoFormat = (
  config: FormatConfig,
  initialValue: string = ''
): AutoFormatHook => {
  const [value, setValue] = useState<FormattedValue>(() =>
    formatValue(initialValue, config)
  )
  
  // Controlar se está em foco para não formatar durante digitação
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Atualizar valor
  const updateValue = useCallback((newInput: string) => {
    const formatted = formatValue(newInput, config)
    setValue(formatted)
  }, [config])
  
  // Handler para onChange
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    if (config.formatOnInput) {
      // Formatar durante digitação
      updateValue(newValue)
    } else {
      // Apenas atualizar raw value durante digitação
      setValue(prev => ({
        ...prev,
        raw: newValue,
        formatted: newValue // Mostrar o que o usuário está digitando
      }))
    }
  }, [config.formatOnInput, updateValue])
  
  // Handler para onBlur (quando sai do campo)
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    
    const currentValue = e.target.value
    
    // Aplicar formatação completa
    if (config.type === 'dimension') {
      // Para dimensões, usar autocompletamento
      const autoCompleted = autoCompleteDimension(currentValue)
      updateValue(autoCompleted)
    } else {
      updateValue(currentValue)
    }
  }, [config.type, updateValue])
  
  // Handler para onFocus (quando entra no campo)
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    
    // Se está formatado, mostrar versão editável
    if (value.formatted !== value.raw && !config.formatOnInput) {
      // Para dimensões, mostrar formato numérico editável
      if (config.type === 'dimension' && value.numeric > 0) {
        const editableValue = value.numeric.toFixed(config.decimals || 2).replace('.', ',')
        e.target.value = editableValue
      }
    }
  }, [value, config])
  
  // Resetar valor
  const reset = useCallback(() => {
    setValue(formatValue('', config))
  }, [config])
  
  // Props para aplicar no input
  const inputProps = {
    value: isFocused ? (inputRef.current?.value || value.formatted) : value.formatted,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus
  }
  
  return {
    value,
    setValue: updateValue,
    inputProps,
    reset
  }
}

/**
 * Hook simplificado para medidas de construção
 */
export const useDimensionFormat = (initialValue: string = '') => {
  return useAutoFormat({
    type: 'dimension',
    decimals: 2,
    min: 0,
    allowNegative: false,
    formatOnInput: false
  }, initialValue)
}

/**
 * Hook simplificado para valores monetários
 */
export const useCurrencyFormat = (initialValue: string = '') => {
  return useAutoFormat({
    type: 'currency',
    decimals: 2,
    min: 0,
    prefix: 'R$ ',
    allowNegative: false,
    formatOnInput: true
  }, initialValue)
}

/**
 * Hook simplificado para percentuais
 */
export const usePercentageFormat = (initialValue: string = '') => {
  return useAutoFormat({
    type: 'percentage',
    decimals: 1,
    min: 0,
    max: 100,
    suffix: '%',
    allowNegative: false,
    formatOnInput: true
  }, initialValue)
}