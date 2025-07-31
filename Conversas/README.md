# 📋 PROJETO CALCPRO - DOCUMENTAÇÃO COMPLETA

> **Sistema SaaS de Calculadoras Técnicas para Construção Civil**  
> **Versão:** 2.0 | **Última Atualização:** 29/01/2025

---

## 🎯 VISÃO GERAL DO PROJETO

### O que é o CalcPro
O **CalcPro** é uma plataforma SaaS especializada em sistemas de cálculos técnicos para divisórias, forros e pisos na construção civil. Oferece **8 calculadoras especializadas** com gestão inteligente de cortes, geração de desenhos técnicos e otimização para reduzir desperdícios.

### Modelo de Negócio
- **Sistema SaaS** com planos mensais/anuais
- **Teste gratuito** de 5 dias para todos os usuários
- **Planos flexíveis**: 1 usuário/1 calculadora até usuários ilimitados/todas calculadoras
- **Gateway de pagamentos** recorrentes integrado
- **Painel administrativo** para gestão de acessos e módulos

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack Principal
- **Framework:** Next.js 14 com App Router
- **Linguagem:** TypeScript (100% tipado)
- **Estilização:** Tailwind CSS
- **Autenticação:** localStorage + React Context + SendGrid
- **Deploy:** Cloudflare Pages com SSL Let's Encrypt
- **Versionamento:** Git + GitHub
- **Domínio:** https://calcpro.app.br

### Estrutura do Projeto
```
CalcPro/
├── src/
│   ├── app/                     # App Router (Next.js 14)
│   │   ├── dashboard/           # Dashboard protegido
│   │   │   ├── calculadoras/    # 8 calculadoras
│   │   │   └── relatorios/      # Relatórios
│   │   ├── admin/               # Painel administrativo
│   │   ├── login/               # Autenticação
│   │   ├── registro/            # Cadastro
│   │   └── verificacao/         # Verificação email
│   ├── components/              # Componentes React
│   ├── lib/                     # Utilitários e calculadoras
│   │   └── calculators/         # Sistema modular
│   ├── types/                   # Definições TypeScript
│   └── contexts/               # Context API
├── public/                     # Assets estáticos
├── Logomarca/                  # Logos do projeto
├── Conversas/                  # Histórico de desenvolvimento
└── Documentação/              # README, DEPLOY, etc.
```

---

## 🧮 CALCULADORAS IMPLEMENTADAS

### Status de Implementação
| Calculadora | Status | Sistema Modular | Notas |
|-------------|--------|-----------------|--------|
| **Divisória Drywall** | ✅ Interface + Flags | ❌ | Sistema de flags inteligente implementado |
| **Divisória Naval** | ✅ Interface Básica | ❌ | Estrutura criada |
| **Forro Drywall** | ✅ Interface Básica | ❌ | Estrutura criada |
| **Forro Modular** | ✅ **COMPLETO** | ✅ **SIM** | **Sistema modular 100% implementado** |
| **Forro PVC** | ✅ Interface Básica | ❌ | Estrutura criada |
| **Piso Laminado** | ✅ Interface Básica | ❌ | Estrutura criada |
| **Piso Vinílico** | ✅ Interface Básica | ❌ | Estrutura criada |
| **Piso Wall** | ✅ Interface Básica | ❌ | Estrutura criada |

---

## 🚀 SISTEMA MODULAR - FORRO MODULAR (IMPLEMENTAÇÃO COMPLETA)

### Arquitetura Modular
```
src/lib/calculators/forro-modular/
├── index.ts                     # Exportações principais
├── placas/                      # Sistema de placas
│   ├── types.ts                 # Interfaces TypeScript
│   ├── base-calculator.ts       # Lógica base (JavaScript do usuário)
│   ├── grande.ts               # Placas 0.625×1.25m
│   ├── pequena.ts              # Placas 0.625×0.625m
│   ├── index.ts                # Exportações
│   └── test.ts                 # Testes
├── perfis/                     # Sistema de perfis T
│   ├── types.ts                # Interfaces TypeScript
│   ├── calculator.ts           # Otimização perfis T
│   └── index.ts                # Exportações
└── cantoneiras/                # Sistema de cantoneiras
    ├── types.ts                # Interfaces TypeScript
    ├── calculator.ts           # Otimização cantoneiras
    ├── index.ts                # Exportações
    └── test.ts                 # Testes
```

### Regras de Negócio Críticas

#### 1. Placas (base-calculator.ts)
- **Lógica exata do usuário preservada** como fornecida
- Cálculo otimizado com aproveitamento de recortes
- Suporte a placas grandes (0.625×1.25m) e pequenas (0.625×0.625m)

#### 2. Perfis T (calculator.ts)
- **REGRA CRÍTICA**: Cada barra cortada pode ter **MÁXIMO 2 USOS**
- **Perfil T 3,12m**: Separação horizontal entre fileiras de placas
- **Perfil T 1,25m**: Separação vertical entre colunas de placas
- **Perfil T 0,625m**: Para placas pequenas (0.625×0.625m)
- **Otimização global**: Entre múltiplos ambientes do mesmo projeto

#### 3. Cantoneiras (calculator.ts)
- **SEQUÊNCIA DE PRIORIZAÇÃO OBRIGATÓRIA**:
  1. **PRIMEIRO**: Paredes > 3,00m
  2. **SEGUNDO**: Paredes ≤ 3,00m ordenadas da MAIOR para MENOR
- **REGRA CRÍTICA**: Cada barra cortada pode ter **MÁXIMO 2 USOS**
- **Aproveitamento global**: Sobras entre ambientes
- **Rastreamento de sobras**: Para uso em outros projetos

### Exemplo de Validação - Ambiente 3,80m × 2,70m
**Resultado esperado**: 5 cantoneiras
**Lógica**:
- Cantoneiras 1-4: usadas inteiras para paredes de 2,70m
- Cantoneira 5: cortada 2× 0,80m para completar paredes de 3,80m
- Sobra: 1,40m (disponível para outros ambientes)

---

## 🎨 INTERFACE E UX

### Sistema de Flags Inteligente (Divisória Drywall)
- 🔴 **Vermelho**: Estado padrão (não configurada)
- 🟢 **Verde**: Com informações/dados configurados
- 🟡 **Amarelo**: Modificada/personalizada (apenas especificações)

### Atalhos de Teclado
- **TAB** no campo descrição: Adiciona nova medida/ambiente
- **ENTER** em qualquer campo: Executa cálculo
- **Sistema de foco**: Automático para otimizar produtividade

### Design System
- **Cores Principais**: Blue (#2563eb), Gray (#64748b), Green (#10b981)
- **Typography**: Inter (Google Fonts)
- **Components**: Cards rounded-lg, shadow-md, padding p-6
- **Layout**: Mobile-first, totalmente responsivo

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

### Sistema de Autenticação
- **Frontend**: React Context + localStorage
- **Email**: SendGrid para verificação
- **Proteção de rotas**: ProtectedRoute component
- **Verificação obrigatória**: Via código enviado por email

### Headers de Segurança
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### SSL/TLS
- Let's Encrypt automático via Cloudflare
- Modo "Full (strict)" configurado
- HSTS headers para forçar HTTPS

---

## 📊 HISTÓRICO DE DESENVOLVIMENTO

### Sessão 1 - Estrutura Inicial (24/07/2025)
- ✅ **Criação da estrutura completa** Next.js 14
- ✅ **Landing page profissional** com todas as seções
- ✅ **Sistema de login/registro** (frontend)
- ✅ **Painel administrativo** com 4 seções
- ✅ **Configuração Cloudflare Pages**
- ✅ **Repositório GitHub** com versionamento

### Sessão 2 - Sistema de Flags (25/01/2025)
- ✅ **Sistema de flags inteligente** para divisória drywall
- ✅ **Correção atalhos de teclado** (TAB + ENTER)
- ✅ **Interface com 3 abas** (Medidas, Desenho, Materiais)
- ✅ **Sistema de cores intuitivo** (🔴🟢🟡)
- ✅ **Modais dinâmicos** para configurações

### Sessão 3 - Implementação de Logos (26/01/2025)
- ✅ **Logo horizontal** aplicada em headers e footers
- ✅ **Logo vertical** aplicada em páginas de auth e emails
- ✅ **Correção erro de build** na página de verificação
- ✅ **Deploy finalizado** em produção
- ✅ **Branding consistente** em todo o sistema

### Sessão 4 - Sistema Modular (29/01/2025)
- ✅ **Sistema modular completo** para Forro Modular
- ✅ **Calculadora de placas** com lógica exata do usuário
- ✅ **Calculadora de perfis T** com otimização (máx 2 usos)
- ✅ **Calculadora de cantoneiras** com priorização de paredes
- ✅ **Integração completa** na página principal
- ✅ **Deploy com correções** de TypeScript

---

## 🚀 DEPLOY E PRODUÇÃO

### URLs Oficiais
- **Produção**: https://calcpro.app.br
- **GitHub**: https://github.com/Ropetr/CalcPro
- **Deploy Staging**: https://calcpro-h08.pages.dev

### Comandos Úteis
```bash
# Desenvolvimento
npm run dev

# Build e verificações
npm run build
npm run typecheck
npm run lint

# Deploy manual
npx wrangler pages deploy out

# Testes específicos
npm run test:placas     # Testa calculadora de placas
npm run test:cantoneiras # Testa calculadora de cantoneiras
```

### Métricas de Performance
- **Build time**: ~25 segundos
- **First Load JS**: 87.2 kB shared
- **Lighthouse Score**: 90+ esperado
- **24 páginas estáticas** geradas com sucesso

---

## 📋 PRÓXIMOS PASSOS

### Prioridade Alta
1. **Implementar sistema modular** para outras calculadoras
2. **Sistema de pagamentos** (Stripe/PagSeguro)
3. **Lógica de cálculo** na divisória drywall
4. **Geração de desenhos técnicos** em escala

### Prioridade Média
1. **Backend com banco de dados** (Supabase)
2. **Sistema de projetos salvos**
3. **Relatórios PDF** para download
4. **API para integrações** externas

### Prioridade Baixa
1. **App mobile** (React Native)
2. **Modo escuro** na interface
3. **Integrações ERP**
4. **Analytics avançado**

---

## 📞 INFORMAÇÕES DE CONTATO

### Projeto
- **Nome**: CalcPro
- **Versão**: 2.0
- **Status**: Em desenvolvimento ativo
- **Email**: contato@calcpro.app.br

### Desenvolvedor
- **GitHub**: Ropetr
- **Repositório**: https://github.com/Ropetr/CalcPro

---

## 🏆 PRINCIPAIS CONQUISTAS

### ✅ **Sistema Modular Pioneiro**
Primeira implementação de sistema modular completo com:
- Lógica exata do usuário preservada
- Otimização automática de recortes
- Regras de negócio específicas por material
- Aproveitamento global entre ambientes

### ✅ **Interface UX Otimizada**
- Sistema de flags inteligente
- Atalhos de teclado produtivos  
- Design responsivo profissional
- Branding consistente

### ✅ **Arquitetura Escalável**
- TypeScript 100% tipado
- Componentes reutilizáveis
- Deploy automatizado
- Performance otimizada

---

## 📝 NOTAS IMPORTANTES

### Regras de Desenvolvimento
1. **Preservar lógica exata do usuário** para cálculos
2. **Priorizar otimização** sem comprometer precisão
3. **Manter retrocompatibilidade** com implementações existentes
4. **Testar com casos reais** fornecidos pelo usuário
5. **Documentar regras específicas** de cada material

### Convenções de Código
- **Idioma**: 100% Português-Brasil
- **Tipagem**: TypeScript obrigatório
- **Estilo**: Prettier + ESLint
- **Commits**: Conventional Commits com emojis

---

*Este documento é atualizado a cada sessão de desenvolvimento e serve como fonte única de verdade para o projeto CalcPro.*

**Última atualização:** 29/01/2025 - Sistema modular completo implementado