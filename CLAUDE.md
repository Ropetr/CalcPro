# CLAUDE.md - Contexto Essencial CalcPro 🚀

**Última atualização:** 2025-01-13  
**Deploy:** https://calcpro.app.br (GitHub → Cloudflare Pages INSTANTÂNEO)

## 🎯 **SEMPRE LEMBRAR - CRÍTICO**

### **Tom e Comunicação**
- **Tom direto, objetivo, sem floreios** 
- **Respostas concisas** (máximo 4 linhas, salvo quando pedido detalhes)
- **Sem preambles** desnecessários ("Aqui está...", "Com base em...")
- **Uma palavra quando possível**: "4" para "2+2", "Yes" para confirmações
- **Emojis apenas quando solicitados**

### **Deploy e Infraestrutura** 
- **Deploy é INSTANTÂNEO** via GitHub → Cloudflare Pages
- **NÃO demora minutos!** É em tempo real após `git push`
- **URL produção:** https://calcpro.app.br
- **Build:** `npm run build` (Next.js 14 + TypeScript + output: export)

### **Layout Padrão Consolidado (2025-01-13)**
- **Campo multiplicador ×:** Pequeno campo ao lado da largura para quantidade (×4 = 4 paredes iguais)
- **Checkbox altura fixa:** Auto-preenchimento opcional da altura nas próximas medidas  
- **Grid 3 colunas:** Largura (com ×) | Altura (com ☑fixar) | Descrição
- **Área + quantidade:** Exibida ao lado da numeração colorida (① 24,50 m² (4× paredes))
- **Navegação TAB:** largura → altura → descrição (campos auxiliares fora do TAB)
- **Interface limpa:** SEM nomes redundantes - apenas círculos numerados + área calculada
- **Busca/engrenagem:** Alinhadas com abas (pb-4) para harmonia visual
- **Formatação brasileira:** "3,50" não "3.50" - `parseFloat(valor.replace(',', '.'))`

## 🏗️ **ARQUITETURA ATUAL**

### **Stack Tecnológico**
- **Framework:** Next.js 14.2.30 + TypeScript strict
- **UI:** Tailwind CSS + Lucide React
- **Deploy:** Cloudflare Pages (estático)
- **Paths:** `@/` aliases configurados

### **Estrutura Principal**
```
CalcPro/
├── src/app/dashboard/calculadoras/  # 8 calculadoras
├── src/lib/calculators/             # Engines de cálculo
├── src/lib/ui-standards/            # Padrões universais
├── src/components/                  # Componentes reutilizáveis
├── docs/conversas/                  # Histórico completo
└── docs/padroes/                    # Guias técnicos
```

## 🧮 **CALCULADORAS (8 TOTAL)**

### **Status e Características**
| Nome | Status | Padrão UI | Complexidade | Última Atualização |
|------|---------|-----------|--------------|-------------------|
| **Forro Modular** | ✅ Completo | v2.0 | Avançada | Referência padrão |
| **Divisória Drywall** | ✅ Completo | v1.0 | Muito Alta | Desenho SVG 1.904 linhas |
| **Forro PVC** | ✅ Completo | v2.0 | Muito Alta | 3 níveis otimização |
| **Divisória Naval** | 🔄 Funcional | Padronizado | Básica | 13/01/2025 |
| **Forro Drywall** | 🔄 Funcional | Padronizado | Básica | 13/01/2025 |
| **Piso Laminado** | 🔄 Funcional | Padronizado | Básica | 13/01/2025 |
| **Piso Vinílico** | 🔄 Funcional | Padronizado | Básica | 13/01/2025 |
| **Piso Wall** | 🔄 Funcional | Padronizado | Básica | 13/01/2025 |

### **Cores por Calculadora**
- Divisória Drywall: Vermelho (`text-primary-600`) + Building2
- Divisória Naval: Laranja (`text-orange-600`) + Waves  
- Forro Drywall: Azul (`text-blue-600`) + Building2
- Forro Modular: Roxo (`text-purple-600`) + Grid3X3
- Forro PVC: Verde (`text-green-600`) + Layers
- Piso Laminado: Amarelo (`text-yellow-600`) + Ruler
- Piso Vinílico: Índigo (`text-indigo-600`) + Waves
- Piso Wall: Cinza (`text-gray-600`) + Package

## 🎨 **SISTEMA UI-STANDARDS (REVOLUCIONÁRIO)**

### **Navegação por Teclado Universal**
```typescript
// Comportamento em TODAS as calculadoras:
TAB = Adicionar novo item/ambiente
ENTER = Calcular (se dados válidos)
SHIFT+TAB = Novo ambiente em L (só Forro PVC)

// Implementação:
data-field="largura|altura|descricao"  // Padrão obrigatório
```

### **Sistema de Abas Hierárquico**
```typescript
// Nível 1: Tipos de Material (ordem alfabética)
// Nível 2: Funcionalidades (medidas | desenho | materiais)
const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
const [activeTipo, setActiveTipo] = useState<string>('tipo1')

// Aba INFO obrigatória com:
// 🎯 Como Usar | ⚡ Funcionalidades | 💡 Dicas | 🔧 Versão
```

### **Formatação Automática**
```typescript
// Padrão brasileiro universal:
"1" → "1,00"      // Auto-completamento  
"3.5" → "3,50"    // Conversão automática
"12,34" → válido  // Formato correto

// Parsing para cálculos:
parseFloat(valor.replace(',', '.'))  // SEMPRE assim!
```

## 🔧 **IMPLEMENTAÇÕES TÉCNICAS CRÍTICAS**

### **Sistema de Foco Automático**
```typescript
// PROBLEMA RESOLVIDO (13/01/2025):
// Seletores precisam usar :last-child (não :first-child)
// Motivo: slice().reverse() inverte visual mas DOM fica normal

// Correto:
'[data-medida-id]:last-child input[type="text"]'     ✅
'[data-comodo-id]:last-child [data-ambiente-id]...'  ✅

// Incorreto:  
'[data-medida-id]:first-child...'                    ❌
```

### **Numeração Dinâmica**
```typescript
// Círculos numerados corretos:
const displayNumber = medidas.length - reverseIndex;  ✅
// NÃO: reverseIndex + 1                             ❌

// Resultado: 1, 2, 3... crescente (novo = maior número)
```

### **Desenho Técnico com Círculos**
```typescript
// DrywallDrawing.tsx atualizado:
interface DrywallDrawingProps {
  parede: MedidaParede
  scale?: number
  numeroParede?: number  // Novo prop
}

// Layout: [🔵1] 3m × 2.7m | Montante 70mm | duplo chapa(s) por lado
```

## 🧮 **ALGORITMOS ESPECÍFICOS**

### **Forro PVC - Sistema Mais Avançado**
```typescript
// 3 níveis de otimização:
1. Corte simples (régua única)
2. Combinações recursivas (múltiplas réguas)
3. Emendas quando necessário

// Suporte:
- Cômodos em L (múltiplos ambientes)
- Réguas: 3m, 4m, 5m, 6m
- Aproveitamento ≥10cm
- Parafusos: 4.2x13, GN25, Bucha
```

### **Divisória Drywall - Sistema Completo**
```typescript
// DrywallDrawing: 1.904 linhas SVG
- 4 abas laterais (A, A2, B, B2)
- Sistema zoom (50%-300%)
- Parafusos detalhados (4 tipos)
- Vãos inteligentes (portas/janelas)
- Cotas precisas
```

### **Forro Modular - Referência v2.0**
```typescript
// Tipos: Forrovid, Gesso, Isopor, Mineral, PVC, Rockfon
// Módulos: placas/, perfis/, cantoneiras/
// Algoritmo: Otimização de perfis T
```

## 📁 **HISTÓRICO TÉCNICO (docs/conversas/)**

### **Implementações Documentadas**
- **2025-01-12**: Sistema parafusos complexo DrywallDrawing
- **2025-08-02**: Padrão v2.0 abas Forro Modular  
- **2025-08-12**: Calculadora completa Forro PVC
- **2025-08-12**: Padronização design todas calculadoras
- **2025-01-13**: Correções foco automático + círculos numerados

### **Decisões Arquiteturais Registradas**
- Formatação brasileira universal (`replace(',', '.')`)
- Sistema abas hierárquico (preparação ERP)
- Modularização calculadoras (`src/lib/calculators/`)
- UI-Standards como padrão universal

## 📅 **CONVERSAS E DESENVOLVIMENTO**

### Janeiro 2025

#### 2025-01-13: Correções UX + Círculos Numerados + Deploy
**Implementações Realizadas:**
- **🔧 Foco automático corrigido**: TAB na descrição → cursor na largura automático
  - **Causa identificada**: Seletores `:first-child` incorretos → `:last-child` corretos  
  - **Motivo técnico**: `slice().reverse()` inverte visual mas DOM fica normal
  - **Correção**: 8 calculadoras + hook centralizado `useKeyboardNavigation.ts`

- **✨ Círculos numerados**: Desenho técnico DrywallDrawing
  - **Layout**: `[🔵1] 3m × 2.7m | Montante 70mm | duplo chapa(s) por lado`
  - **Interface**: Prop `numeroParede` opcional para futuras calculadoras
  - **Organização**: Informações técnicas ao lado do círculo

- **🧹 Interface limpa**: Removidos nomes redundantes
  - **Antes**: "Parede 01", "Ambiente 01", "Cômodo 01" (automáticos)
  - **Depois**: Campos vazios + placeholders + círculos numerados
  - **Resultado**: Interface menos poluída, mais profissional

- **🔢 Numeração corrigida**: Sequência crescente de cima para baixo
  - **Padrão**: Item novo (topo visual) = maior número
  - **Fórmula**: `displayNumber = medidas.length - reverseIndex`
  - **Comportamento**: 1, 2, 3... independente de exclusões

**Commits Importantes:**
- `ad1f080`: 🔧 Fix: Corrigir foco automático após TAB no campo descrição
- `0619a82`: ✨ Feature: Círculos numerados no desenho técnico  
- `1ea34e4`: ✨ UI: Corrigir numeração e limpar interface das calculadoras
- `603e6b8`: 🔧 Fix: Correção da numeração sequencial após exclusão
- `e527597`: 🔧 Feature: Foco automático no campo largura após TAB

**Deploy**: Realizado com sucesso - todas melhorias ativas em https://calcpro.app.br

---

#### 2025-01-12: Sistema Completo de Parafusos - Divisória Drywall
**Implementações Técnicas:**
- **Sistema Complexo de Guias** (`src/lib/calculators/divisoria-drywall/calculator.ts`):
  - Desconto inteligente vãos: portas (só piso), janelas altas (teto), baixas (sem desconto)
  - Aproveitamento global: recortes ≥1,5m (100%), 0,8-1,5m (80%), <0,8m (descartados)
  - Gestão sobras: identificação aproveitáveis (>80cm)

- **Correção Cálculo Montantes**:
  - Fórmula: `largura ÷ espaçamento`
  - Inteiro: `Math.floor(divisao) + 1`
  - Fracionado: `Math.ceil(divisao) + 1`
  - +1 montante para cada porta/janela

- **Sistema Parafusos Detalhado** (`src/components/DrywallDrawing.tsx` - 1.904 linhas):
  - Montantes (cinza): espaçamento 25cm, margem 5cm piso/teto
  - Guias (verde): espaçamento 25cm horizontal, 2,5cm bordas
  - Emendas: desencontro 12,5cm, margem 4cm entre fileiras
  - Posicionamento por faixas 1,20m com precisão milimétrica

- **Sistema Zoom**: controles -/+/reset (50%-300%), elementos escalados proporcionalmente

**Decisões Arquiteturais:**
- Diâmetro parafusos: 0,5cm (escala técnica real)
- Cores: cinza escuro estruturais, verde guias
- Exclusão inteligente vãos automatizada
- Desencontro técnico conforme normas

---

### Agosto 2025

#### 2025-08-12: Padronização Design Forro PVC
**Problema**: Layout complexo inconsistente com divisória drywall
**Solução**: Padronização completa mantendo funcionalidades avançadas

**Implementações:**
- **Layout simplificado**: 3 campos (largura, comprimento, descrição)
- **Botões integrados**: calcular no header (sem floating buttons)
- **Cômodos L inteligentes**: aparecem só com SHIFT+TAB (cor vermelha)
- **Progressive Disclosure**: complexidade só quando necessário

**Padrão estabelecido:**
- Interface limpa por padrão
- Funcionalidades avançadas sob demanda
- Consistência visual entre calculadoras
- Sistema cores: verde (simples), vermelho (complexidade)

**Commit**: `8f08d65` - 🎨 UI: Padronizar design forro-PVC igual divisória-drywall

---

#### 2025-08-12: Calculadora Forro PVC Completa
**Problemas Críticos Resolvidos:**
- **DrywallDrawing**: `parseFloat()` parava na vírgula (2,70m → 2,00m)
  - **Correção**: `parseFloat(medida.altura.replace(',', '.'))`
  - **Aplicado**: altura, largura, vãos, área

- **Descoberta valiosa**: Pasta `CalcPro/CalcPro/` com calculadora 2.220 linhas
  - Algoritmos únicos otimização recursiva
  - Funcionalidades que levariam semanas recriar

**Implementações Técnicas:**
- **Padronização UI**: 6 calculadoras seguindo padrão divisória drywall
- **Calculadora Forro PVC**: migração híbrida (interface nova + algoritmos antigos)
- **Módulos TypeScript**: `src/lib/calculators/forro-pvc/`
  - `calculator.ts`, `optimization.ts`, `types.ts`, `index.ts`

**Algoritmos Implementados:**
```typescript
// 3 níveis otimização cortes
export function otimizarCorteReguas(comprimento: number): SolucaoCorte
// Nível 1: Corte simples | Nível 2: Combinações | Nível 3: Emendas

// Rodaforro com aproveitamento
export function calcularRodaforroOtimizado(): ResultadoRodaforro
```

**Cálculos Precisos:**
- Parafuso 4.2x13: 4 por m² (pacotes 500)
- Parafuso GN25: 1 por metro linear (pacotes 100)
- Parafuso Bucha: 2 por metro linear (pacotes 50)
- Cantoneiras: perímetro completo
- Perfis Emenda: 10cm por emenda

**Commits**: `fab25e8`, `2b069a4`, `e3e15cb`, `1e4b22d`

---

#### 2025-08-02: Novo Padrão Abas - Forro Modular
**Revolução no Sistema de Abas:**
- **Tipos por material**: Ordem alfabética (Forrovid, Gesso, Isopor, Mineral, PVC, Rockfon)
- **Design navegador**: Abas conectadas, ativa se projeta (`-mb-px, z-10`)
- **Estados TypeScript**: Union types rigorosos

**Aba INFO Estruturada**:
- Seções: Como Usar (5 passos), Funcionalidades, Dicas, Versão
- Instruções específicas: "Configure especificações (Flags Vermelhas)"
- Navegação: "Tab nova célula, Enter calcular"

**Formatação Automática Brasileira**:
- `formatarNumero()`: aceita vírgula/ponto → saída brasileiro (4 → 4,00)
- `formatarQuantidade()`: remove não-numéricos → inteiros
- Campos: `type="number"` → `type="text"` + `inputMode="decimal"`

**Padrões Estabelecidos:**
1. Sistema abas por tipo material (alfabética)
2. Aba INFO obrigatória
3. Formatação automática brasileira
4. Design navegador web UX
5. Interface limpa sem redundâncias
6. Preparação integração ERP

**Commit**: `3a8a3c6` - ✨ Feature: Implementar novo padrão abas forro modular

## 📋 **CHECKLIST PARA NOVAS IMPLEMENTAÇÕES**

### **Ao Implementar Nova Funcionalidade:**
- [ ] Seguir padrão UI-Standards
- [ ] Aplicar formatação brasileira  
- [ ] Implementar navegação TAB/ENTER
- [ ] Usar círculos numerados (não nomes redundantes)
- [ ] Testar foco automático (:last-child)
- [ ] Verificar responsividade
- [ ] Compilar com `npm run build`
- [ ] Commit com emoji + contexto
- [ ] Push para deploy instantâneo

### **Ao Corrigir Problemas:**
- [ ] Identificar causa raiz
- [ ] Aplicar correção em todas calculadoras afetadas
- [ ] Atualizar hook centralizado se necessário
- [ ] Testar em múltiplas calculadoras
- [ ] Documentar decisão técnica

## 🎯 **PRÓXIMOS FOCOS PRIORITÁRIOS**

### **Alta Prioridade (Próximas Sessões)**
1. **Aplicar padrão v2.0** nas 5 calculadoras restantes
2. **Migrar UI-Standards** para todas (remover código duplicado)
3. **Unificar componentes** reutilizáveis
4. **Sistema PDF** baseado em implementação existente

### **Melhorias Contínuas**
1. **Performance** dos algoritmos complexos
2. **Testes automatizados** dos cálculos
3. **Componentes** ainda mais reutilizáveis
4. **Documentação** atualizada continuamente

## 💡 **LEMBRETES OPERACIONAIS**

### **Fluxo de Trabalho Padrão**
1. **Início sessão:** "Leia o CLAUDE.md e vamos trabalhar"
2. **Durante trabalho:** Desenvolvimento normal
3. **Final sessão:** "Atualize o CLAUDE.md com o que fizemos"

### **Comandos Frequentes**
- `npm run build` - Compilar e verificar
- `git add . && git commit -m "..." && git push` - Deploy
- Deploy automático: **não mencionar tempo**, é instantâneo!

### **Arquivos Críticos para Consulta**
- `docs/estado-projeto.md` - Status completo
- `docs/padroes/sistema-abas-calculadoras.md` - Padrões UI
- `docs/conversas/` - Histórico técnico detalhado
- `src/lib/ui-standards/` - Padrões implementados

## 🏆 **PONTOS FORTES DO PROJETO**

- **Arquitetura sólida:** Next.js 14 + TypeScript rigoroso
- **Algoritmos avançados:** Otimização Forro PVC, DrywallDrawing complexo  
- **Padrões consistentes:** UI-Standards universais
- **Deploy otimizado:** Cloudflare Pages instantâneo
- **Documentação completa:** Histórico técnico detalhado
- **Performance:** Build otimizado, módulos eficientes

---

**🎯 CalcPro é um sistema EXTREMAMENTE SOFISTICADO e BEM ARQUITETADO para calculadoras técnicas de construção civil. Manter qualidade e consistência em todas as implementações futuras!** 🚀✨