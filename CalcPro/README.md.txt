# Calculadora de Forro PVC - Sistema de Otimização

Sistema profissional para cálculo otimizado de materiais para instalação de forro PVC, com algoritmos inteligentes de aproveitamento de materiais e redução de desperdício.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Calculadora de Forro PVC**
  - Cálculo otimizado de réguas com múltiplos algoritmos
  - Suporte para comprimentos maiores que 6m (com emendas)
  - Aproveitamento inteligente de sobras
  - Plano de corte detalhado

### 🔄 Em Desenvolvimento
- **Calculadora de Divisórias**
  - Drywall
  - Eucatex
  
- **Calculadora de Forros**
  - Drywall
  - Modulares
  
- **Calculadora de Pisos**
  - Laminados
  - Vinílicos

## 📋 Materiais Calculados

- Réguas de PVC (4m, 5m, 6m)
- Rodaforro (barras de 6m)
- Emendas de PVC
- Metalon
- Parafusos (4.2x13, GN 25, com bucha)

## 🛠️ Tecnologias Utilizadas

- **React** - Framework principal
- **Tailwind CSS** - Estilização
- **React Router** - Navegação
- **React Hot Toast** - Notificações

## 🏃‍♂️ Como Executar

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd calculadora-forro-pvc-app
```

2. Instale as dependências
```bash
npm install
```

3. Execute o projeto
```bash
npm start
```

4. Acesse no navegador
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
src/
├── contexts/          # Contextos React (autenticação)
├── pages/            # Páginas da aplicação
│   └── Calculadoras.js  # Menu e calculadora PVC
├── App.js            # Componente principal com rotas
├── index.js          # Entrada da aplicação
└── index.css         # Estilos globais (Tailwind)
```

## 🎯 Algoritmos de Otimização

O sistema utiliza 4 algoritmos diferentes para encontrar a melhor solução:

1. **Régua Inteira** - Uso integral sem cortes
2. **Corte Simples** - Uma régua cortada no tamanho necessário
3. **Divisão** - Uma régua dividida em múltiplas peças iguais
4. **Combinação** - Múltiplas réguas menores somadas

## 🔧 Recursos Especiais

- **Aproveitamento de Sobras**: O sistema memoriza sobras de rodaforro entre cômodos
- **Suporte a Emendas**: Cálculo automático para comprimentos maiores que 6m
- **Atalhos de Teclado**: 
  - `TAB` para adicionar novos campos
  - `ENTER` para calcular

## 📊 Estatísticas do Sistema

- **6** Calculadoras planejadas
- **1** Implementada (Forro PVC)
- **5** Em desenvolvimento

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para profissionais da construção civil

---

**Nota**: Este é um projeto em desenvolvimento ativo. Novas funcionalidades serão adicionadas regularmente.