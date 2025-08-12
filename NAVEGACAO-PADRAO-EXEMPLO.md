# Sistema de Navegação Padronizado - Exemplo de Implementação

## 📁 **Nova Estrutura Criada**

```
src/lib/navigation/
├── index.ts                    # Exportações principais
├── types.ts                    # Interfaces TypeScript
├── useKeyboardNavigation.ts    # Hook principal
└── components/
    └── NavigationHelp.tsx      # Componente visual padronizado
```

## 🎯 **Como Aplicar nas Calculadoras Existentes**

### **1. Divisória Drywall (src/app/dashboard/calculadoras/divisoria-drywall/page.tsx)**

#### **Antes (código atual):**
```tsx
// Código específico no próprio arquivo
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Lógica específica misturada
  }
}, [])
```

#### **Depois (com sistema padronizado):**
```tsx
import { useKeyboardNavigation, navigationPresets, NavigationHelp } from '@/lib/navigation'

export default function DivisoriaDrywallPage() {
  const navigation = useKeyboardNavigation()
  
  // Configurar navegação
  useEffect(() => {
    navigation.setConfig(
      navigationPresets.ambientes(
        adicionarParede,
        calcularDrywall
      )
    )
    
    return () => navigation.setConfig(null)
  }, [])
  
  return (
    <div>
      {/* Ajuda visual padronizada */}
      <NavigationHelp navigation={navigation} variant="full" />
      
      {/* Campos com data-field obrigatório */}
      <input 
        data-field="comprimento"
        data-ambiente-id={parede.id}
        placeholder="Comprimento (m)"
        onChange={(e) => atualizarParede(parede.id, 'comprimento', e.target.value)}
      />
      
      <input 
        data-field="largura"
        data-ambiente-id={parede.id}
        placeholder="Largura (m)"
        onChange={(e) => atualizarParede(parede.id, 'largura', e.target.value)}
      />
      
      <input 
        data-field="descricao"
        data-ambiente-id={parede.id}
        placeholder="Descrição"
        onChange={(e) => atualizarParede(parede.id, 'descricao', e.target.value)}
      />
    </div>
  )
}
```

### **2. Forro Modular (Migração do código existente)**

#### **Remover código específico:**
```tsx
// REMOVER estas linhas (150-187):
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement
    // ... código específico
  }
}, [])
```

#### **Substituir por sistema padronizado:**
```tsx
import { useKeyboardNavigation, navigationPresets, NavigationHelp } from '@/lib/navigation'

// Adicionar no componente:
const navigation = useKeyboardNavigation()

useEffect(() => {
  navigation.setConfig(
    navigationPresets.ambientes(
      adicionarAmbiente,
      calcularForroModular
    )
  )
  
  return () => navigation.setConfig(null)
}, [])

// Substituir indicações visuais existentes por:
<NavigationHelp navigation={navigation} variant="full" />
```

### **3. Novas Calculadoras**

Para qualquer nova calculadora, basta importar e usar:

```tsx
import { useKeyboardNavigation, navigationPresets, NavigationHelp } from '@/lib/navigation'

export default function NovaCalculadora() {
  const navigation = useKeyboardNavigation()
  
  useEffect(() => {
    // Para calculadoras com múltiplos ambientes:
    navigation.setConfig(
      navigationPresets.ambientes(adicionarItem, calcular)
    )
    
    // OU para calculadoras simples:
    navigation.setConfig(
      navigationPresets.simples(calcular)
    )
  }, [])
  
  return (
    <div>
      <NavigationHelp navigation={navigation} variant="dashboard" />
      {/* Campos com data-field */}
    </div>
  )
}
```

## ✨ **Vantagens do Sistema Padronizado**

### **🎯 Consistência**
- Mesmo comportamento em todas as calculadoras
- Mesma interface visual para ajuda
- Mesmos atalhos de teclado

### **🛠️ Manutenibilidade**
- Correções em um local afetam todo o sistema
- Novas funcionalidades podem ser adicionadas facilmente
- Testes unitários centralizados

### **🚀 Produtividade**
- Novas calculadoras implementadas mais rapidamente
- Usuários têm experiência consistente
- Menos código duplicado

### **📊 Recursos Avançados**
- Validação em tempo real
- Feedback visual automático
- Status "pronto para calcular"
- Múltiplos estilos de interface

## 🎨 **Variantes do Componente Visual**

### **1. Compact (para espaços pequenos)**
```tsx
<NavigationHelp navigation={navigation} variant="compact" />
```
Resultado: `Tab novo ambiente  Enter calcular`

### **2. Dashboard (para cards de resumo)**
```tsx
<NavigationHelp navigation={navigation} variant="dashboard" />
```
Resultado:
```
Tab novo ambiente
Enter calcular ✓ Pronto
```

### **3. Full (explicação completa)**
```tsx
<NavigationHelp navigation={navigation} variant="full" />
```
Resultado: Caixa amarela com explicações detalhadas e status

## 🔧 **Personalização Avançada**

### **Validação Customizada**
```tsx
const config: NavigationConfig = {
  fields: [
    { 
      name: 'altura', 
      selector: '[data-field="altura"]', 
      required: true,
      validation: (value) => {
        const num = parseFloat(value.replace(',', '.'))
        return num >= 2.0 && num <= 4.0 // Altura entre 2 e 4 metros
      }
    }
  ],
  onTabAction: adicionarAmbiente,
  onEnterAction: calcular,
  canCalculate: () => {
    // Lógica customizada mais complexa
    return ambientes.every(amb => amb.largura > 0 && amb.comprimento > 0)
  }
}
```

### **Feedback Visual Customizado**
```tsx
<NavigationHelp 
  navigation={navigation} 
  variant="full" 
  className="bg-blue-50 border-blue-200" 
/>
```

## 📋 **Plano de Migração**

### **Fase 1: Implementar Sistema** ✅
- [x] Criar estrutura `/src/lib/navigation/`
- [x] Hook `useKeyboardNavigation`
- [x] Componente `NavigationHelp`
- [x] Presets para casos comuns

### **Fase 2: Migrar Forro Modular** 🔄
- [ ] Substituir código específico por sistema padronizado
- [ ] Testar comportamento idêntico
- [ ] Verificar feedback visual

### **Fase 3: Migrar Divisória Drywall** 🔄
- [ ] Implementar navegação padronizada
- [ ] Adicionar validações específicas
- [ ] Testar com múltiplas paredes

### **Fase 4: Aplicar em Outras Calculadoras** 🔄
- [ ] Piso Laminado
- [ ] Piso Vinílico
- [ ] Forro PVC
- [ ] Todas as demais

### **Fase 5: Melhorias Futuras** 📅
- [ ] Navegação por setas (↑↓←→)
- [ ] Atalhos Ctrl+S (salvar)
- [ ] Histórico de valores (Ctrl+Z)
- [ ] Autocompletar valores comuns

## 🎯 **Resultado Final**

Com este sistema, todas as calculadoras terão:

✅ **Comportamento uniforme**: TAB adiciona, ENTER calcula  
✅ **Validação inteligente**: Só calcula quando dados estão válidos  
✅ **Feedback visual**: Status claro para o usuário  
✅ **Manutenção fácil**: Um código, todas as calculadoras  
✅ **Extensibilidade**: Fácil adicionar novos recursos  

**Tempo estimado para implementação completa: 2-3 dias**