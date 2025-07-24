# Deploy do CalcPro no Cloudflare Pages

## 🚀 Passos para Deploy

### 1. Preparação do Repositório
```bash
# Inicializar git (se ainda não foi feito)
git init
git add .
git commit -m "Initial commit - CalcPro v1.0"

# Conectar ao repositório remoto (GitHub/GitLab)
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

### 2. Configurar Cloudflare Pages

1. **Acesse o Cloudflare Dashboard**
   - Entre em https://dash.cloudflare.com
   - Vá para Pages → Create a project

2. **Conectar Repositório**
   - Selecione seu provedor Git (GitHub/GitLab)
   - Autorize o Cloudflare a acessar seus repositórios
   - Selecione o repositório do CalcPro

3. **Configurações de Build**
   ```
   Project name: calcpro
   Production branch: main
   Build command: npm run build
   Build output directory: out
   Root directory: / (deixe em branco)
   ```

4. **Variáveis de Ambiente**
   ```
   NODE_VERSION=18
   NEXT_PUBLIC_APP_URL=https://calcpro.app.br
   NODE_ENV=production
   ```

### 3. Configurar Domínio Personalizado

1. **No Cloudflare Pages**
   - Vá para seu projeto → Custom domains
   - Clique em "Set up a custom domain"
   - Digite: `calcpro.app.br`

2. **Configurar DNS**
   - No Cloudflare DNS, adicione:
   ```
   Type: CNAME
   Name: @
   Target: calcpro.pages.dev
   ```

3. **Configurar SSL**
   - SSL/TLS → Overview → Full (strict)
   - Edge Certificates → Universal SSL (automático)

### 4. Arquivos Importantes para Cloudflare

✅ `_headers` - Headers de segurança
✅ `_redirects` - Redirecionamentos e SPA fallback  
✅ `next.config.js` - Configurado para static export
✅ `wrangler.toml` - Configurações do Wrangler (opcional)

### 5. Verificar Deploy

Após o deploy:
- ✅ Site acessível em https://calcpro.pages.dev
- ✅ Domínio personalizado https://calcpro.app.br
- ✅ SSL ativo e funcionando
- ✅ Todas as páginas carregando
- ✅ Painel admin acessível em /admin

## 🔧 Comandos Úteis

```bash
# Testar build local
npm run build
npm run start

# Deploy manual via Wrangler (opcional)
npx wrangler pages deploy out

# Ver logs do deploy
npx wrangler pages deployment list
```

## 📊 Métricas Esperadas

- **Build time**: ~2-3 minutos
- **Deploy time**: ~30 segundos  
- **First Load**: <3 segundos
- **Lighthouse Score**: 90+

## 🐛 Troubleshooting

**Build falha?**
- Verificar se todas as dependências estão no package.json
- Rodar `npm run build` localmente primeiro

**404 em rotas?**
- Verificar se `_redirects` está na pasta `out/`
- Confirmar SPA fallback: `/* /index.html 200`

**CSS não carrega?**
- Verificar `_headers` para cache correto
- Confirmar assets em `out/_next/static/`

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs no Cloudflare Pages
2. Testar build local primeiro
3. Verificar DNS e SSL no Cloudflare

---

**Status**: ✅ Pronto para deploy
**Versão**: 1.0.0
**Build**: Estático (SSG)