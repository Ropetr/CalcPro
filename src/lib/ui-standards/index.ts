/**
 * Sistema de Padrões UI CalcPro
 * 
 * Sistema unificado de navegação + formatação para todas as calculadoras
 * Garante consistência e melhora experiência do usuário
 */

// === NAVEGAÇÃO ===
export { useKeyboardNavigation, navigationPresets } from './navigation/useKeyboardNavigation'
export { NavigationHelp, useNavigationHelp } from './navigation/components/NavigationHelp'
export type { NavigationField, NavigationConfig, KeyboardNavigationHook } from './navigation/types'

import { useKeyboardNavigation } from './navigation/useKeyboardNavigation'

// === FORMATAÇÃO ===
export { 
  useAutoFormat, 
  useDimensionFormat, 
  useCurrencyFormat, 
  usePercentageFormat 
} from './formatting/useAutoFormat'
export { 
  formatValue, 
  formatDimension, 
  formatCurrency, 
  autoCompleteDimension,
  formatPresets 
} from './formatting/formatters'
export type { FormatConfig, FormattedValue, AutoFormatHook } from './formatting/types'

// === COMPONENTES ===
export { 
  StandardInput, 
  DimensionInput, 
  CurrencyInput, 
  PercentageInput 
} from './components/StandardInput'

/**
 * Hook integrado para calculadoras completas
 * Combina navegação + formatação em uma única interface
 */
export const useCalculatorStandards = () => {
  const navigation = useKeyboardNavigation()
  
  return {
    navigation
  }
}

/**
 * Exemplo de uso completo:
 * 
 * ```tsx
 * import { useCalculatorStandards, navigationPresets } from '@/lib/ui-standards'
 * 
 * export default function MinhaCalculadora() {
 *   const { navigation, DimensionInput, NavigationHelp } = useCalculatorStandards()
 *   
 *   useEffect(() => {
 *     navigation.setConfig(
 *       navigationPresets.ambientes(adicionarAmbiente, calcular)
 *     )
 *   }, [])
 *   
 *   return (
 *     <div>
 *       <NavigationHelp variant="full" />
 *       
 *       <DimensionInput 
 *         data-field="comprimento"
 *         data-ambiente-id={ambiente.id}
 *         label="Comprimento"
 *         required
 *         onValueChange={(numeric) => updateAmbiente('comprimento', numeric)}
 *       />
 *       
 *       <DimensionInput 
 *         data-field="largura"
 *         data-ambiente-id={ambiente.id}
 *         label="Largura"
 *         required
 *         onValueChange={(numeric) => updateAmbiente('largura', numeric)}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */