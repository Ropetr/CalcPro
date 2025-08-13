# Padrão de Sistema de Abas para Calculadoras

**Versão:** 1.0  
**Data:** 02/08/2025  
**Referência:** Implementado na Calculadora Forro Modular

## 🎯 Objetivo

Estabelecer um padrão consistente de interface com abas para todas as calculadoras do CalcPro, facilitando a integração futura com sistema ERP e melhorando a experiência do usuário.

## 🏗️ Estrutura Base

### 1. Estados Necessários
```typescript
// Estado para tipo de material (adaptar conforme calculadora)
const [activeForro, setActiveForro] = useState<'tipo1' | 'tipo2' | 'tipo3' | ... | 'info'>('tipo1')

// Estados existentes da calculadora
const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
```

### 2. Hierarquia de Abas

**Nível Superior:** Tipos de Material (em ordem alfabética rigorosa)
- Exemplo Forro: Forrovid, Gesso, Isopor, Mineral, PVC, Rockfon, INFO

**Nível Inferior:** Funcionalidades
- Ambientes/Medidas
- Plano de Corte/Desenho  
- Lista Geral/Materiais

### 3. Estrutura HTML/JSX

```jsx
{/* Área Principal com Abas */}
<div className="bg-white rounded-lg shadow mb-8">
  {/* Abas dos Tipos - Estilo Navegador */}
  <div className="bg-gray-100">
    <div className="flex items-end justify-start px-4 pt-2">
      <div className="flex">
        {/* Botões das abas de tipo */}
        <button onClick={() => setActiveTipo('tipo1')} className={estiloAba}>
          Tipo 1
        </button>
        {/* ... outros tipos ... */}
        <button onClick={() => setActiveTipo('info')} className={estiloAba}>
          INFO
        </button>
      </div>
    </div>
    <div className="border-b border-gray-300"></div>
  </div>
  
  {/* Abas Funcionais */}
  <div className="border-b border-gray-200">
    <div className="flex items-center justify-between p-6 pb-0">
      <div className="flex space-x-8">
        {/* Abas de funcionalidade */}
      </div>
    </div>
  </div>

  {/* Conteúdo Condicional */}
  <div className="p-6">
    {activeTipo === 'info' ? (
      // Conteúdo da aba INFO
    ) : (
      // Conteúdo das abas funcionais
    )}
  </div>
</div>
```

## 🎨 Classes CSS Padrão

### Abas de Tipo (Estilo Navegador)
```css
/* Aba Ativa */
bg-white text-gray-900 border-t border-l border-r border-gray-300 rounded-t-lg -mb-px z-10

/* Aba Inativa */
bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 border-t border-l border-r border-gray-300 rounded-t-lg mr-px

/* Última aba (sem margin-right) */
bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 border-t border-l border-r border-gray-300 rounded-t-lg
```

### Abas Funcionais (Estilo Underline)
```css
/* Aba Ativa */
border-primary-500 text-primary-600

/* Aba Inativa */
border-transparent text-gray-500 hover:text-gray-700
```

## 📱 Formatação de Campos

### Campos Decimais
```typescript
// Função de formatação
const formatarNumero = (valor: string): string => {
  if (!valor || valor === '') return ''
  valor = valor.trim()
  if (!valor) return ''
  
  let numeroLimpo = valor.replace(/[^\d,.-]/g, '')
  if (!numeroLimpo) return valor
  
  numeroLimpo = numeroLimpo.replace(',', '.')
  const numero = parseFloat(numeroLimpo)
  if (isNaN(numero)) return valor
  
  return numero.toFixed(2).replace('.', ',')
}

// Aplicação nos inputs
<input
  type="text"
  inputMode="decimal"
  value={campo}
  onChange={(e) => setCampo(e.target.value)}
  onBlur={(e) => setCampo(formatarNumero(e.target.value))}
  placeholder="3,50"
/>
```

### Campos de Quantidade
```typescript
const formatarQuantidade = (valor: string): string => {
  if (!valor || valor === '') return ''
  valor = valor.trim()
  if (!valor) return ''
  
  const numeroLimpo = valor.replace(/[^\d]/g, '')
  if (!numeroLimpo) return ''
  
  const numero = parseInt(numeroLimpo)
  if (isNaN(numero)) return ''
  
  return numero.toString()
}

// Aplicação nos inputs
<input
  type="text"
  inputMode="numeric"
  value={quantidade}
  onChange={(e) => setQuantidade(e.target.value)}
  onBlur={(e) => setQuantidade(formatarQuantidade(e.target.value))}
/>
```

## 📋 Conteúdo da Aba INFO

### Estrutura Obrigatória
```jsx
<div className="space-y-6">
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
    {/* Cabeçalho */}
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
        <span className="text-white font-bold text-lg">ℹ</span>
      </div>
      <div>
        <h3 className="text-xl font-bold text-blue-900">Nome da Calculadora</h3>
        <p className="text-blue-700">Descrição do sistema</p>
      </div>
    </div>
    
    {/* Grid de Conteúdo */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Como Usar */}
      <div>
        <h4 className="font-semibold text-blue-900 mb-3">🎯 Como Usar:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Selecione o tipo</strong> nas abas superiores</li>
          <li>• <strong>Configure especificações</strong> (instruções específicas)</li>
          <li>• <strong>Adicione itens</strong> com medidas</li>
          <li>• <strong>Visualize resultados</strong> nas outras abas</li>
        </ul>
      </div>
      
      {/* Funcionalidades */}
      <div>
        <h4 className="font-semibold text-blue-900 mb-3">⚡ Funcionalidades:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Otimização automática</strong></li>
          <li>• <strong>Cálculo inteligente</strong></li>
          <li>• <strong>Sistema modular</strong></li>
          <li>• <strong>Formatação automática</strong></li>
        </ul>
      </div>
    </div>
    
    {/* Dicas */}
    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h4 className="font-semibold text-yellow-900 mb-2">💡 Dicas Importantes:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
        <div>
          <p>• Use <strong>vírgula</strong> para casas decimais</p>
          <p>• Pressione <strong>Tab</strong> para mudar de células</p>
          <p>• Pressione <strong>Enter</strong> para calcular</p>
        </div>
        <div>
          <p>• Sistema considera aproveitamento</p>
          <p>• Parâmetros específicos por tipo</p>
          <p>• Otimização detalhada</p>
        </div>
      </div>
    </div>
    
    {/* Versão */}
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h4 className="font-semibold text-green-900 mb-2">🔧 Versão Atual:</h4>
      <p className="text-sm text-green-800">
        Nome da Calculadora v2.0 - Sistema com otimização avançada
      </p>
    </div>
  </div>
</div>
```

## 🔧 Configurações Especiais

### Navegação por Teclado
```typescript
// Foco automático no primeiro campo após TAB
// Implementado automaticamente no hook useKeyboardNavigation
const navigation = useKeyboardNavigation()

// A função addItem() agora inclui foco automático:
// - Executa onTabAction()
// - Foca automaticamente no primeiro campo (largura)
// - Funciona com diferentes padrões de seletor
```

### Seletores de Foco Suportados
```typescript
// O sistema tenta automaticamente estes seletores em ordem:
const possibleSelectors = [
  // Padrão forro-pvc (cômodos)
  '[data-comodo-id]:first-child [data-ambiente-id] input[type="text"]:first-of-type',
  // Padrão outras calculadoras (medidas)
  '[data-medida-id]:first-child input[type="text"]',
  // Padrão alternativo por data-field
  '[data-field="largura"]:first-of-type',
  // Padrão geral (primeiro input de texto)
  'input[type="text"]:first-of-type'
]
```

### Botão Flutuante
```jsx
{/* Ocultar na aba INFO */}
{activeTab === 'medidas' && activeTipo !== 'info' && (
  <button className="fixed bottom-6 right-6...">
    <Plus className="h-6 w-6" />
  </button>
)}
```

### Contagem Inteligente
```typescript
// Filtrar apenas itens válidos
const itensValidos = itens.filter(item => 
  item.campo1 && item.campo2 && 
  parseFloat(item.campo1.replace(',', '.')) > 0 && 
  parseFloat(item.campo2.replace(',', '.')) > 0
)
```

## 📦 Checklist de Implementação

- [ ] Estados de controle das abas
- [ ] HTML/JSX da estrutura de abas
- [ ] CSS classes aplicadas
- [ ] Conteúdo da aba INFO
- [ ] Formatação automática de campos
- [ ] **Navegação por teclado com foco automático** ✅
- [ ] Ocultação de elementos na aba INFO
- [ ] Contagem inteligente de itens válidos
- [ ] Testes de funcionalidade
- [ ] Deploy e verificação

## 🚀 Integração ERP (Futuro)

Cada aba de tipo permitirá que o sistema ERP identifique automaticamente:
- Tipo de material selecionado
- Parâmetros específicos do material
- Cálculos diferenciados por tipo
- Integração com estoque por categoria

---

**Nota:** Este padrão deve ser seguido rigorosamente em todas as calculadoras para manter consistência e facilitar manutenção futura.