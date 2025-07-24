# CalcPro - Calculadoras Técnicas para Construção Civil

Sistema completo de calculadoras especializadas para divisórias, forros e pisos, desenvolvido com Next.js e otimizado para deploy no Cloudflare Pages.

## 🚀 Características

- **8 Calculadoras Especializadas**: Drywall, Naval, Modulares, PVC, Laminado, Vinílico e Piso Wall
- **Gestão Inteligente de Cortes**: Otimização para reduzir desperdícios
- **Desenhos Técnicos**: Plantas e detalhes executivos gerados automaticamente
- **Modo ABNT**: Cálculos rigorosos seguindo normas técnicas
- **Sistema SaaS**: Planos flexíveis com teste gratuito de 5 dias

## 🛠️ Tecnologias

- **Framework**: Next.js 14 com App Router
- **Styling**: Tailwind CSS
- **Linguagem**: TypeScript
- **Deploy**: Cloudflare Pages
- **SSL**: Let's Encrypt (automático via Cloudflare)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Verificar tipos
npm run typecheck

# Linting
npm run lint
```

## 🌐 Deploy no Cloudflare Pages

1. **Conectar Repositório**: 
   - Acesse Cloudflare Dashboard → Pages → Create a project
   - Conecte seu repositório Git

2. **Configurações de Build**:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`

3. **Variáveis de Ambiente**:
   ```
   NODE_VERSION=18
   NEXT_PUBLIC_APP_URL=https://calcpro.app.br
   ```

4. **Domínio Personalizado**:
   - Adicione `calcpro.app.br` nas configurações de domínio
   - Configure DNS no Cloudflare apontando para o Pages

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router (Next.js 14)
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Página inicial
│   ├── login/           # Página de login
│   ├── registro/        # Página de registro
│   └── calculadoras/    # Páginas das calculadoras
├── components/          # Componentes React
├── lib/                 # Utilitários e helpers
├── types/               # Definições TypeScript
├── utils/               # Funções utilitárias
└── styles/              # Estilos globais
```

## 🎯 Funcionalidades Implementadas

### ✅ Concluído
- [x] Estrutura base do projeto
- [x] Layout responsivo com Tailwind CSS
- [x] Páginas de login e registro
- [x] Landing page com seções completas
- [x] Configuração para Cloudflare Pages
- [x] SEO otimizado
- [x] PWA ready

### 🚧 Em Desenvolvimento
- [ ] Sistema de autenticação
- [ ] Dashboard do usuário
- [ ] 8 calculadoras especializadas
- [ ] Geração de desenhos técnicos
- [ ] Sistema de pagamentos
- [ ] Painel administrativo

## 🔐 Segurança

- SSL/TLS automático via Cloudflare
- Headers de segurança configurados
- Proteção contra XSS e CSRF
- Validação de dados no frontend e backend

## 📊 Performance

- Static Site Generation (SSG)
- Otimização de imagens automática
- Code splitting automático
- Cache inteligente via Cloudflare

## 📞 Suporte

- Email: contato@calcpro.app.br
- Telefone: (11) 99999-9999

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.