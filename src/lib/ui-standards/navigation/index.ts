/**
 * Sistema de Navegação Padronizado CalcPro
 * 
 * Exportações principais do sistema de navegação por teclado
 * Usado em todas as calculadoras para manter consistência
 */

// Hooks
export { useKeyboardNavigation, navigationPresets } from './useKeyboardNavigation'
export { useNavigationHelp } from './components/NavigationHelp'

// Componentes
export { NavigationHelp } from './components/NavigationHelp'

// Tipos
export type { 
  NavigationField, 
  NavigationConfig, 
  KeyboardNavigationHook 
} from './types'

/**
 * Exemplo de uso:
 * 
 * ```tsx
 * import { useKeyboardNavigation, navigationPresets, NavigationHelp } from '@/lib/navigation'
 * 
 * export default function MinhaCalculadora() {
 *   const navigation = useKeyboardNavigation()
 *   
 *   useEffect(() => {
 *     navigation.setConfig(
 *       navigationPresets.ambientes(adicionarAmbiente, calcular)
 *     )
 *   }, [])
 *   
 *   return (
 *     <div>
 *       <NavigationHelp navigation={navigation} variant="full" />
 *       
 *       <input 
 *         data-field="comprimento"
 *         placeholder="Comprimento"
 *       />
 *       <input 
 *         data-field="largura" 
 *         placeholder="Largura"
 *       />
 *       <input 
 *         data-field="descricao"
 *         placeholder="Descrição"
 *       />
 *     </div>
 *   )
 * }
 * ```
 */