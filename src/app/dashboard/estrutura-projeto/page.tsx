'use client'

import { useState } from 'react'
import { 
  Code2, 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown,
  Info,
  CheckCircle,
  Circle,
  AlertTriangle
} from 'lucide-react'

// Dados da estrutura atual REAL do projeto CalcPro
const estruturaAtual = {
  name: "CalcPro/",
  type: "folder",
  status: "atual",
  description: "Projeto completo - Next.js 14 + TypeScript",
  children: [
    {
      name: "src/",
      type: "folder", 
      status: "atual",
      description: "Código fonte principal - 71 arquivos TypeScript (16.022 linhas)",
      children: [
        {
          name: "app/",
          type: "folder",
          status: "atual", 
          description: "Páginas Next.js App Router + API Routes",
          children: [
            {
              name: "layout.tsx",
              type: "file",
              status: "atual",
              description: "Layout raiz da aplicação",
              size: "53 linhas"
            },
            {
              name: "page.tsx",
              type: "file",
              status: "atual",
              description: "Landing page principal",
              size: "20 linhas"
            },
            {
              name: "admin/",
              type: "folder",
              status: "atual",
              description: "Sistema administrativo completo",
              children: [
                {
                  name: "layout.tsx",
                  type: "file",
                  status: "atual",
                  description: "Layout admin",
                  size: "22 linhas"
                },
                {
                  name: "page.tsx",
                  type: "file",
                  status: "atual",
                  description: "Dashboard admin",
                  size: "204 linhas"
                },
                {
                  name: "assinaturas/page.tsx",
                  type: "file",
                  status: "atual",
                  description: "Gestão de assinaturas",
                  size: "254 linhas"
                },
                {
                  name: "empresas/page.tsx",
                  type: "file",
                  status: "atual",
                  description: "Gestão de empresas",
                  size: "204 linhas"
                },
                {
                  name: "usuarios/page.tsx",
                  type: "file",
                  status: "atual",
                  description: "Gestão de usuários",
                  size: "212 linhas"
                }
              ]
            },
            {
              name: "api/",
              type: "folder",
              status: "atual",
              description: "API Routes do Next.js",
              children: [
                {
                  name: "send-verification/route.ts",
                  type: "file",
                  status: "atual",
                  description: "Endpoint de verificação por email"
                }
              ]
            },
            {
              name: "dashboard/",
              type: "folder",
              status: "atual",
              description: "Sistema principal do usuário",
              children: [
                {
                  name: "layout.tsx",
                  type: "file",
                  status: "atual",
                  description: "Layout com sidebar e navegação",
                  size: "135 linhas"
                },
                {
                  name: "page.tsx",
                  type: "file",
                  status: "atual",
                  description: "Dashboard home com estatísticas",
                  size: "349 linhas"
                },
                {
                  name: "estrutura-projeto/page.tsx",
                  type: "file",
                  status: "atual",
                  description: "Página de estrutura do projeto",
                  size: "618 linhas",
                  problems: ["Arquivo grande - pode ser modularizado"]
                },
                {
                  name: "projeto/page.tsx",
                  type: "file",
                  status: "atual",
                  description: "Editor de projetos",
                  size: "510 linhas"
                },
                {
                  name: "projetos/page.tsx",
                  type: "file",
                  status: "atual",
                  description: "Lista de projetos",
                  size: "24 linhas"
                },
                {
                  name: "calculadoras/",
                  type: "folder",
                  status: "atual",
                  description: "Core do sistema - 8 calculadoras implementadas",
                  children: [
                    {
                      name: "page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Dashboard das calculadoras - 3 categorias",
                      size: "305 linhas"
                    },
                    {
                      name: "forro-modular/page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Calculadora mais complexa - SISTEMA V2.0",
                      size: "2.095 linhas",
                      problems: ["ARQUIVO MUITO GRANDE", "Candidato à modularização"],
                      features: ["Abas v2.0", "Formatação BR", "Sistema otimizado"]
                    },
                    {
                      name: "divisoria-drywall/page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Interface drywall complexa",
                      size: "1.105 linhas",
                      problems: ["Arquivo grande", "Pendente migração para v2.0"]
                    },
                    {
                      name: "forro-drywall/page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Calculadora forro drywall",
                      size: "313 linhas",
                      problems: ["Pendente migração para padrão v2.0"]
                    },
                    {
                      name: "piso-wall/page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Calculadora piso wall",
                      size: "303 linhas",
                      problems: ["Pendente migração para padrão v2.0"]
                    },
                    {
                      name: "piso-vinilico/page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Calculadora piso vinílico",
                      size: "286 linhas",
                      problems: ["Pendente migração para padrão v2.0"]
                    },
                    {
                      name: "piso-laminado/page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Calculadora piso laminado",
                      size: "268 linhas",
                      problems: ["Pendente migração para padrão v2.0"]
                    },
                    {
                      name: "divisoria-naval/page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Calculadora divisória naval",
                      size: "267 linhas",
                      problems: ["Pendente migração para padrão v2.0"]
                    },
                    {
                      name: "forro-pvc/page.tsx",
                      type: "file",
                      status: "atual",
                      description: "Calculadora forro PVC",
                      size: "260 linhas",
                      problems: ["Pendente migração para padrão v2.0"]
                    }
                  ]
                }
              ]
            },
            {
              name: "login/page.tsx",
              type: "file",
              status: "atual",
              description: "Página de login",
              size: "181 linhas"
            },
            {
              name: "registro/page.tsx",
              type: "file",
              status: "atual",
              description: "Página de registro",
              size: "297 linhas"
            },
            {
              name: "verificacao/page.tsx",
              type: "file",
              status: "atual",
              description: "Página de verificação",
              size: "273 linhas"
            }
          ]
        },
        {
          name: "lib/",
          type: "folder",
          status: "atual",
          description: "Lógicas de negócio e utilitários",
          children: [
            {
              name: "auth.ts",
              type: "file",
              status: "atual",
              description: "Sistema de autenticação completo",
              size: "401 linhas",
              problems: ["Arquivo grande - candidato à modularização"]
            },
            {
              name: "projetos.ts",
              type: "file",
              status: "atual",
              description: "Gestão de projetos",
              size: "381 linhas",
              problems: ["Arquivo grande - candidato à modularização"]
            },
            {
              name: "sendgrid.ts",
              type: "file",
              status: "atual",
              description: "Serviço de email",
              size: "200 linhas"
            },
            {
              name: "calculators/",
              type: "folder",
              status: "atual",
              description: "Motores de cálculo das calculadoras",
              children: [
                {
                  name: "divisoria-drywall/",
                  type: "folder",
                  status: "atual",
                  description: "Sistema drywall - arquitetura simples",
                  children: [
                    {
                      name: "calculator.ts",
                      type: "file",
                      status: "atual",
                      description: "DrywallCalculator - LÓGICA MUITO COMPLEXA",
                      size: "596 linhas",
                      problems: ["ARQUIVO MUITO GRANDE", "Lógica concentrada", "Difícil manutenção"]
                    },
                    {
                      name: "types.ts",
                      type: "file",
                      status: "atual",
                      description: "Tipos TypeScript",
                      size: "78 linhas"
                    },
                    {
                      name: "index.ts",
                      type: "file",
                      status: "atual",
                      description: "Exportações",
                      size: "3 linhas"
                    }
                  ]
                },
                {
                  name: "forro-modular/",
                  type: "folder",
                  status: "atual",
                  description: "Sistema modular bem organizado - EXEMPLO DE BOA ARQUITETURA",
                  features: ["Arquitetura modular", "Bem separado", "Fácil manutenção"],
                  children: [
                    {
                      name: "index.ts",
                      type: "file",
                      status: "atual",
                      description: "API principal integrada",
                      size: "77 linhas"
                    },
                    {
                      name: "placas/",
                      type: "folder",
                      status: "atual",
                      description: "Módulo de cálculo de placas",
                      children: [
                        {
                          name: "base-calculator.ts",
                          type: "file",
                          status: "atual",
                          description: "Calculadora base de placas",
                          size: "279 linhas",
                          problems: ["Arquivo grande - mas bem estruturado"]
                        },
                        {
                          name: "grande.ts",
                          type: "file",
                          status: "atual",
                          description: "Lógica placas grandes",
                          size: "80 linhas"
                        },
                        {
                          name: "pequena.ts",
                          type: "file",
                          status: "atual",
                          description: "Lógica placas pequenas",
                          size: "80 linhas"
                        },
                        {
                          name: "types.ts",
                          type: "file",
                          status: "atual",
                          description: "Tipos específicos",
                          size: "79 linhas"
                        },
                        {
                          name: "test.ts",
                          type: "file",
                          status: "atual",
                          description: "Testes automatizados",
                          size: "206 linhas"
                        }
                      ]
                    },
                    {
                      name: "perfis/",
                      type: "folder",
                      status: "atual",
                      description: "Módulo de cálculo de perfis T",
                      children: [
                        {
                          name: "calculator.ts",
                          type: "file",
                          status: "atual",
                          description: "Lógica de perfis T",
                          size: "185 linhas"
                        },
                        {
                          name: "types.ts",
                          type: "file",
                          status: "atual",
                          description: "Tipos específicos",
                          size: "42 linhas"
                        }
                      ]
                    },
                    {
                      name: "cantoneiras/",
                      type: "folder",
                      status: "atual",
                      description: "Módulo de aproveitamento de cantoneiras",
                      children: [
                        {
                          name: "calculator.ts",
                          type: "file",
                          status: "atual",
                          description: "Sistema de aproveitamento",
                          size: "181 linhas"
                        },
                        {
                          name: "types.ts",
                          type: "file",
                          status: "atual",
                          description: "Tipos específicos",
                          size: "33 linhas"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "ui-standards/",
              type: "folder",
              status: "atual",
              description: "Sistema de padronização UI - INOVAÇÃO RECENTE",
              features: ["Navegação por teclado", "Formatação automática", "Componentes padronizados"],
              children: [
                {
                  name: "index.ts",
                  type: "file",
                  status: "atual",
                  description: "API principal integrada",
                  size: "20 linhas"
                },
                {
                  name: "navigation/",
                  type: "folder",
                  status: "atual",
                  description: "Sistema de navegação por teclado",
                  children: [
                    {
                      name: "useKeyboardNavigation.ts",
                      type: "file",
                      status: "atual",
                      description: "Hook principal de navegação",
                      size: "172 linhas"
                    },
                    {
                      name: "components/NavigationHelp.tsx",
                      type: "file",
                      status: "atual",
                      description: "Componente de ajuda visual",
                      size: "85 linhas"
                    }
                  ]
                },
                {
                  name: "formatting/",
                  type: "folder",
                  status: "atual",
                  description: "Sistema de formatação automática",
                  children: [
                    {
                      name: "formatters.ts",
                      type: "file",
                      status: "atual",
                      description: "Funções de formatação brasileira",
                      size: "184 linhas"
                    },
                    {
                      name: "useAutoFormat.ts",
                      type: "file",
                      status: "atual",
                      description: "Hook de formatação automática",
                      size: "25 linhas"
                    }
                  ]
                },
                {
                  name: "components/",
                  type: "folder",
                  status: "atual",
                  description: "Componentes padronizados",
                  children: [
                    {
                      name: "StandardInput.tsx",
                      type: "file",
                      status: "atual",
                      description: "Input padronizado com formatação",
                      size: "50 linhas"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: "components/",
          type: "folder",
          status: "atual",
          description: "Componentes React reutilizáveis",
          children: [
            {
              name: "DrywallDrawing.tsx",
              type: "file",
              status: "atual",
              description: "ARQUIVO GIGANTE - Desenho técnico SVG completo",
              size: "~2000+ linhas",
              problems: [
                "ARQUIVO MUITO GRANDE",
                "Mistura múltiplas responsabilidades",
                "Sistema de abas complexo (A, A2, B, B2)",
                "Controles de zoom integrados", 
                "Renderização de placas + parafusos + vãos",
                "Cotas dimensionais",
                "Candidato URGENTE à modularização"
              ]
            },
            {
              name: "Calculators.tsx",
              type: "file",
              status: "atual",
              description: "Lista de calculadoras",
              size: "120 linhas"
            },
            {
              name: "Features.tsx",
              type: "file",
              status: "atual",
              description: "Seção de recursos da landing page",
              size: "80 linhas"
            },
            {
              name: "Header.tsx",
              type: "file",
              status: "atual",
              description: "Cabeçalho da aplicação",
              size: "90 linhas"
            },
            {
              name: "ProtectedRoute.tsx",
              type: "file",
              status: "atual",
              description: "Proteção de rotas",
              size: "45 linhas"
            },
            {
              name: "admin/",
              type: "folder",
              status: "atual",
              description: "Componentes administrativos",
              children: [
                {
                  name: "AdminHeader.tsx",
                  type: "file",
                  status: "atual",
                  description: "Cabeçalho admin",
                  size: "70 linhas"
                },
                {
                  name: "AdminSidebar.tsx",
                  type: "file",
                  status: "atual",
                  description: "Sidebar admin",
                  size: "85 linhas"
                }
              ]
            }
          ]
        },
        {
          name: "contexts/",
          type: "folder",
          status: "atual",
          description: "Contextos React",
          children: [
            {
              name: "AuthContext.tsx",
              type: "file",
              status: "atual",
              description: "Contexto de autenticação global",
              size: "150 linhas"
            }
          ]
        },
        {
          name: "types/",
          type: "folder",
          status: "atual",
          description: "Definições TypeScript globais",
          children: [
            {
              name: "auth.ts",
              type: "file",
              status: "atual",
              description: "Tipos de autenticação",
              size: "25 linhas"
            },
            {
              name: "projeto.ts",
              type: "file",
              status: "atual",
              description: "Tipos de projeto",
              size: "30 linhas"
            }
          ]
        },
        {
          name: "styles/",
          type: "folder",
          status: "atual",
          description: "Estilos globais",
          children: [
            {
              name: "globals.css",
              type: "file",
              status: "atual",
              description: "Estilos Tailwind CSS globais",
              size: "100 linhas"
            }
          ]
        }
      ]
    },
    {
      name: "docs/",
      type: "folder",
      status: "atual",
      description: "Documentação do projeto",
      children: [
        {
          name: "ESTRUTURA-PROJETO.md",
          type: "file",
          status: "atual",
          description: "Análise da estrutura atual vs proposta"
        },
        {
          name: "NAVEGACAO-PADRAO-EXEMPLO.md",
          type: "file",
          status: "atual",
          description: "Sistema de navegação padronizada"
        },
        {
          name: "SISTEMA-UI-STANDARDS-COMPLETO.md",
          type: "file",
          status: "atual",
          description: "Documentação completa do sistema UI"
        }
      ]
    },
    {
      name: "package.json",
      type: "file",
      status: "atual",
      description: "Dependências Next.js 14 + TypeScript + Tailwind"
    },
    {
      name: "tsconfig.json",
      type: "file",
      status: "atual",
      description: "Configuração TypeScript"
    },
    {
      name: "tailwind.config.js",
      type: "file",
      status: "atual",
      description: "Configuração Tailwind CSS"
    }
  ]
}

// Dados da estrutura proposta - baseada nas melhorias reais implementadas
const estruturaProposta = {
  name: "CalcPro/",
  type: "folder",
  status: "proposta",
  description: "Projeto reestruturado com padrões modernos",
  children: [
    {
      name: "src/",
      type: "folder",
      status: "proposta", 
      description: "Código fonte modularizado e padronizado",
      children: [
        {
          name: "lib/",
          type: "folder",
          status: "migrado",
          description: "Lógicas de negócio otimizadas",
          children: [
            {
              name: "ui-standards/",
              type: "folder", 
              status: "migrado",
              description: "✅ IMPLEMENTADO - Sistema de padronização UI",
              features: ["Navegação por teclado", "Formatação automática", "Componentes padronizados"],
              children: [
                {
                  name: "navigation/",
                  type: "folder",
                  status: "migrado",
                  description: "Sistema TAB/ENTER padronizado"
                },
                {
                  name: "formatting/",
                  type: "folder", 
                  status: "migrado",
                  description: "Auto formatação brasileira (1 → 1,00)"
                },
                {
                  name: "components/",
                  type: "folder",
                  status: "migrado",
                  description: "StandardInput, DimensionInput, etc."
                }
              ]
            },
            {
              name: "calculators/",
              type: "folder",
              status: "proposta",
              description: "Calculadoras modularizadas",
              children: [
                {
                  name: "forro-modular/",
                  type: "folder",
                  status: "migrado",
                  description: "✅ JÁ MODULARIZADO - Exemplo de boa arquitetura",
                  features: ["Módulos separados", "Bem documentado", "Fácil manutenção"]
                },
                {
                  name: "divisoria-drywall/",
                  type: "folder",
                  status: "proposta", 
                  description: "Estrutura modular proposta",
                  children: [
                    {
                      name: "core/",
                      type: "folder",
                      status: "proposta",
                      description: "Lógica principal separada",
                      children: [
                        {
                          name: "calculator.ts",
                          type: "file", 
                          status: "proposta",
                          description: "Lógica principal limpa (em vez de 596 linhas)"
                        },
                        {
                          name: "types.ts",
                          type: "file",
                          status: "proposta", 
                          description: "Interfaces principais"
                        },
                        {
                          name: "constants.ts",
                          type: "file",
                          status: "proposta",
                          description: "Constantes do sistema"
                        }
                      ]
                    },
                    {
                      name: "components/",
                      type: "folder",
                      status: "proposta",
                      description: "Módulos especializados",
                      children: [
                        {
                          name: "parafusos/",
                          type: "folder", 
                          status: "proposta",
                          description: "Sistema completo de parafusos modularizado",
                          children: [
                            {
                              name: "bordas/calculator.ts",
                              type: "file",
                              status: "proposta",
                              description: "Parafusos das bordas das faixas"
                            },
                            {
                              name: "guias/calculator.ts",
                              type: "file", 
                              status: "proposta",
                              description: "Parafusos das guias"
                            },
                            {
                              name: "montantes/calculator.ts",
                              type: "file",
                              status: "proposta", 
                              description: "Parafusos dos montantes"
                            },
                            {
                              name: "index.ts",
                              type: "file",
                              status: "proposta",
                              description: "ParafusosCalculator integrado"
                            }
                          ]
                        },
                        {
                          name: "chapas/",
                          type: "folder", 
                          status: "proposta",
                          description: "Sistema de cálculo de chapas"
                        },
                        {
                          name: "montantes/",
                          type: "folder",
                          status: "proposta",
                          description: "Sistema de montantes"
                        }
                      ]
                    },
                    {
                      name: "drawing/",
                      type: "folder",
                      status: "proposta",
                      description: "Componentes de desenho separados",
                      children: [
                        {
                          name: "components/",
                          type: "folder",
                          status: "proposta", 
                          description: "Renderizadores especializados (dividir 2000+ linhas)",
                          children: [
                            {
                              name: "PlacasRenderer.tsx",
                              type: "file",
                              status: "proposta",
                              description: "Só renderização de placas"
                            },
                            {
                              name: "ParafusosRenderer.tsx", 
                              type: "file",
                              status: "proposta",
                              description: "Só renderização de parafusos"
                            },
                            {
                              name: "VaosRenderer.tsx",
                              type: "file",
                              status: "proposta",
                              description: "Só renderização de vãos"
                            },
                            {
                              name: "ZoomControls.tsx",
                              type: "file",
                              status: "proposta",
                              description: "Controles de zoom separados"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  name: "[outras-calculadoras]/",
                  type: "folder",
                  status: "proposta",
                  description: "7 calculadoras migradas para padrão v2.0",
                  features: ["UI Standards aplicado", "Formatação automática", "Navegação padronizada"]
                }
              ]
            }
          ]
        },
        {
          name: "app/dashboard/calculadoras/",
          type: "folder",
          status: "proposta",
          description: "Interfaces padronizadas",
          children: [
            {
              name: "forro-modular/page.tsx",
              type: "file",
              status: "proposta",
              description: "Interface modularizada (em vez de 2.095 linhas)",
              size: "~300 linhas",
              improvements: ["Componentes extraídos", "Hooks customizados", "Lógica separada"]
            },
            {
              name: "divisoria-drywall/page.tsx",
              type: "file",
              status: "proposta",
              description: "Interface com UI Standards v2.0",
              size: "~400 linhas",
              improvements: ["DimensionInput", "NavigationHelp", "Formatação automática"]
            },
            {
              name: "[outras]/page.tsx",
              type: "file",
              status: "proposta",
              description: "7 calculadoras com padrão v2.0 aplicado",
              improvements: ["30 min implementação cada", "Consistência total"]
            }
          ]
        },
        {
          name: "components/",
          type: "folder",
          status: "proposta",
          description: "Componentes modularizados",
          children: [
            {
              name: "drywall/",
              type: "folder",
              status: "proposta",
              description: "Componentes drywall especializados",
              children: [
                {
                  name: "DrywallCore.tsx",
                  type: "file",
                  status: "proposta",
                  description: "Componente principal (~200 linhas)"
                },
                {
                  name: "PlacasRenderer.tsx",
                  type: "file",
                  status: "proposta",
                  description: "Renderização de placas (~300 linhas)"
                },
                {
                  name: "ParafusosRenderer.tsx",
                  type: "file",
                  status: "proposta",
                  description: "Sistema de parafusos (~400 linhas)"
                },
                {
                  name: "ZoomControls.tsx",
                  type: "file",
                  status: "proposta",
                  description: "Controles de zoom (~100 linhas)"
                }
              ]
            },
            {
              name: "ui/",
              type: "folder",
              status: "migrado",
              description: "✅ Componentes padronizados já criados",
              children: [
                {
                  name: "StandardInput.tsx",
                  type: "file",
                  status: "migrado",
                  description: "Input com formatação automática"
                },
                {
                  name: "NavigationHelp.tsx",
                  type: "file",
                  status: "migrado",
                  description: "Ajuda visual de navegação"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

interface TreeItemProps {
  item: any
  level: number
  onToggle?: (path: string) => void
  expanded?: boolean
}

const TreeItem: React.FC<TreeItemProps> = ({ item, level, onToggle, expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded)
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    onToggle?.(item.name)
  }

  const getIcon = () => {
    if (item.type === 'folder') {
      return isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
    }
    return <File className="h-4 w-4 text-gray-400" />
  }

  const getStatusIcon = () => {
    switch (item.status) {
      case 'atual':
        return <Circle className="h-3 w-3 text-blue-500" />
      case 'proposta': 
        return <AlertTriangle className="h-3 w-3 text-orange-500" />
      case 'migrado':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (item.status) {
      case 'atual':
        return 'border-l-blue-500 bg-blue-50'
      case 'proposta':
        return 'border-l-orange-500 bg-orange-50' 
      case 'migrado':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-300 bg-white'
    }
  }

  return (
    <div>
      <div 
        className={`flex items-start space-x-2 p-2 border-l-4 ${getStatusColor()} hover:bg-gray-50 cursor-pointer`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={item.children ? handleToggle : undefined}
      >
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${item.type === 'folder' ? 'text-gray-900' : 'text-gray-700'}`}>
              {item.name}
            </span>
            {item.size && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {item.size}
              </span>
            )}
          </div>
          
          {item.description && (
            <p className="text-sm text-gray-600 mt-0.5">
              {item.description}
            </p>
          )}
          
          {item.problems && item.problems.length > 0 && (
            <div className="mt-2 space-y-1">
              {item.problems.map((problem: string, index: number) => (
                <div key={index} className="flex items-start space-x-1">
                  <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-red-600">{problem}</span>
                </div>
              ))}
            </div>
          )}
          
          {item.features && item.features.length > 0 && (
            <div className="mt-2 space-y-1">
              {item.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-green-600">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          {item.improvements && item.improvements.length > 0 && (
            <div className="mt-2 space-y-1">
              {item.improvements.map((improvement: string, index: number) => (
                <div key={index} className="flex items-start space-x-1">
                  <Circle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-blue-600">{improvement}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isExpanded && item.children && (
        <div className="space-y-0.5">
          {item.children.map((child: any, index: number) => (
            <TreeItem 
              key={child.name + index} 
              item={child} 
              level={level + 1}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function EstruturaProjetoPage() {
  const [viewMode, setViewMode] = useState<'atual' | 'proposta' | 'comparacao'>('atual')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Code2 className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Estrutura do Projeto</h1>
                <p className="text-sm text-gray-600">Visualização da organização atual e proposta</p>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('atual')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'atual' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Estrutura Atual
              </button>
              <button
                onClick={() => setViewMode('proposta')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'proposta'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Estrutura Proposta
              </button>
              <button
                onClick={() => setViewMode('comparacao')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'comparacao'
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Comparação
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Legend */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Legenda</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3 text-blue-500" />
              <span className="text-gray-700">Estrutura Atual</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span className="text-gray-700">Estrutura Proposta</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-gray-700">Migrado</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'atual' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Info className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-medium text-gray-900">Estrutura Atual</h2>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Como o projeto está organizado hoje. Arquivos grandes e lógica concentrada.
              </p>
            </div>
            <div className="p-4">
              <TreeItem item={estruturaAtual} level={0} expanded={true} />
            </div>
          </div>
        )}

        {viewMode === 'proposta' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-medium text-gray-900">Estrutura Proposta</h2>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Nova organização modular. Cada funcionalidade em sua pasta com documentação.
              </p>
            </div>
            <div className="p-4">
              <TreeItem item={estruturaProposta} level={0} expanded={true} />
            </div>
          </div>
        )}

        {viewMode === 'comparacao' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Circle className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-medium text-gray-900">Estrutura Atual</h2>
                </div>
                <p className="mt-1 text-sm text-gray-600">Como está hoje</p>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <TreeItem item={estruturaAtual} level={0} expanded={true} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h2 className="text-lg font-medium text-gray-900">Estrutura Proposta</h2>
                </div>
                <p className="mt-1 text-sm text-gray-600">Como ficará depois</p>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <TreeItem item={estruturaProposta} level={0} expanded={true} />
              </div>
            </div>
          </div>
        )}

        {/* Benefits Summary */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Benefícios da Reestruturação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Localização Rápida</h4>
                <p className="text-sm text-gray-600 mt-1">
                  De 5 minutos procurando → 5 segundos localizando
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Manutenção Fácil</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cada módulo independente com documentação
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Escalabilidade</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Adicionar novas funcionalidades sem complexidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}