// Sistema de gerenciamento de projetos com localStorage

import { Projeto, TemplateProjeto, FiltrosProjeto, EstatisticasProjeto, CalculoRealizado } from '@/types/projeto'

const STORAGE_KEY = 'calcpro_projetos'
const TEMPLATES_KEY = 'calcpro_templates'

export class ProjetoService {
  // Projetos
  static listarProjetos(): Projeto[] {
    try {
      const dados = localStorage.getItem(STORAGE_KEY)
      return dados ? JSON.parse(dados) : []
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
      return []
    }
  }

  static buscarProjeto(id: string): Projeto | null {
    const projetos = this.listarProjetos()
    return projetos.find(p => p.id === id) || null
  }

  static salvarProjeto(projeto: Projeto): void {
    const projetos = this.listarProjetos()
    const indice = projetos.findIndex(p => p.id === projeto.id)
    
    projeto.dataModificacao = new Date().toISOString()
    projeto.versao += 1
    
    if (indice >= 0) {
      projetos[indice] = projeto
    } else {
      projetos.push(projeto)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projetos))
  }

  static criarProjeto(dadosBase: Partial<Projeto>): Projeto {
    const agora = new Date().toISOString()
    const projeto: Projeto = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nome: dadosBase.nome || 'Novo Projeto',
      descricao: dadosBase.descricao || '',
      tipo: dadosBase.tipo || 'residencial',
      categoria: dadosBase.categoria || 'misto',
      status: 'rascunho',
      dataCriacao: agora,
      dataModificacao: agora,
      criadoPor: 'user_local', // TODO: Integrar com sistema de auth
      calculos: [],
      tags: dadosBase.tags || [],
      favorito: false,
      versao: 1,
      ...dadosBase
    }
    
    this.salvarProjeto(projeto)
    return projeto
  }

  static duplicarProjeto(id: string, novoNome?: string): Projeto | null {
    const original = this.buscarProjeto(id)
    if (!original) return null
    
    const duplicado = {
      ...original,
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nome: novoNome || `${original.nome} (Cópia)`,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString(),
      status: 'rascunho' as const,
      versao: 1
    }
    
    this.salvarProjeto(duplicado)
    return duplicado
  }

  static excluirProjeto(id: string): boolean {
    const projetos = this.listarProjetos()
    const novosProjetos = projetos.filter(p => p.id !== id)
    
    if (novosProjetos.length !== projetos.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosProjetos))
      return true
    }
    return false
  }

  static alternarFavorito(id: string): boolean {
    const projeto = this.buscarProjeto(id)
    if (!projeto) return false
    
    projeto.favorito = !projeto.favorito
    this.salvarProjeto(projeto)
    return true
  }

  static adicionarCalculo(idProjeto: string, calculo: CalculoRealizado): boolean {
    const projeto = this.buscarProjeto(idProjeto)
    if (!projeto) return false
    
    projeto.calculos.push({
      ...calculo,
      dataCalculo: new Date().toISOString()
    })
    
    this.salvarProjeto(projeto)
    return true
  }

  // Filtros e busca
  static filtrarProjetos(filtros: FiltrosProjeto): Projeto[] {
    let projetos = this.listarProjetos()
    
    if (filtros.categoria && filtros.categoria !== 'todos') {
      projetos = projetos.filter(p => p.categoria === filtros.categoria)
    }
    
    if (filtros.status && filtros.status !== 'todos') {
      projetos = projetos.filter(p => p.status === filtros.status)
    }
    
    if (filtros.tipo && filtros.tipo !== 'todos') {
      projetos = projetos.filter(p => p.tipo === filtros.tipo)
    }
    
    if (filtros.favoritos) {
      projetos = projetos.filter(p => p.favorito)
    }
    
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase()
      projetos = projetos.filter(p => 
        p.nome.toLowerCase().includes(termo) ||
        p.descricao?.toLowerCase().includes(termo) ||
        p.cliente?.nome.toLowerCase().includes(termo) ||
        p.tags.some(tag => tag.toLowerCase().includes(termo))
      )
    }
    
    if (filtros.periodo) {
      const inicio = new Date(filtros.periodo.inicio)
      const fim = new Date(filtros.periodo.fim)
      projetos = projetos.filter(p => {
        const data = new Date(p.dataCriacao)
        return data >= inicio && data <= fim
      })
    }
    
    // Ordenar por data de modificação (mais recente primeiro)
    return projetos.sort((a, b) => 
      new Date(b.dataModificacao).getTime() - new Date(a.dataModificacao).getTime()
    )
  }

  // Templates
  static listarTemplates(): TemplateProjeto[] {
    try {
      const dados = localStorage.getItem(TEMPLATES_KEY)
      const templates = dados ? JSON.parse(dados) : []
      
      // Se não há templates, criar os padrões
      if (templates.length === 0) {
        return this.criarTemplatesPadrao()
      }
      
      return templates
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
      return this.criarTemplatesPadrao()
    }
  }

  static criarTemplatesPadrao(): TemplateProjeto[] {
    const templates: TemplateProjeto[] = [
      {
        id: 'tpl_casa_padrao',
        nome: 'Casa Residencial Padrão',
        descricao: 'Template para casa de 3 quartos com drywall',
        categoria: 'divisoria',
        tipo: 'residencial',
        calculosPreConfigurados: [
          {
            tipo: 'divisoria-drywall',
            dados: {
              modalidade: 'basica',
              medidas: [
                { largura: 3.0, altura: 2.6, descricao: 'Quarto 1' },
                { largura: 3.5, altura: 2.6, descricao: 'Quarto 2' },
                { largura: 4.0, altura: 2.6, descricao: 'Sala/Cozinha' }
              ]
            }
          }
        ],
        tags: ['residencial', 'casa', 'drywall', '3-quartos'],
        icone: '🏠'
      },
      {
        id: 'tpl_escritorio_comercial',
        nome: 'Escritório Comercial',
        descricao: 'Template para divisórias de escritório',
        categoria: 'divisoria',
        tipo: 'comercial',
        calculosPreConfigurados: [
          {
            tipo: 'divisoria-drywall',
            dados: {
              modalidade: 'abnt',
              medidas: [
                { largura: 5.0, altura: 2.8, descricao: 'Sala reunião' },
                { largura: 8.0, altura: 2.8, descricao: 'Open office' },
                { largura: 2.5, altura: 2.8, descricao: 'Sala gerência' }
              ]
            }
          }
        ],
        tags: ['comercial', 'escritorio', 'corporativo'],
        icone: '🏢'
      },
      {
        id: 'tpl_forro_residencial',
        nome: 'Forro Residencial Completo',
        descricao: 'Forro modular para casa completa',
        categoria: 'forro',
        tipo: 'residencial',
        calculosPreConfigurados: [
          {
            tipo: 'forro-modular',
            dados: {
              ambientes: [
                { largura: 4.0, comprimento: 5.0, nome: 'Sala' },
                { largura: 3.0, comprimento: 3.5, nome: 'Quarto 1' },
                { largura: 3.5, comprimento: 4.0, nome: 'Quarto 2' }
              ]
            }
          }
        ],
        tags: ['residencial', 'forro', 'modular'],
        icone: '🏠'
      },
      {
        id: 'tpl_piso_apartamento',
        nome: 'Piso Apartamento 2 Quartos',
        descricao: 'Template para piso laminado em apartamento',
        categoria: 'piso',
        tipo: 'residencial',
        calculosPreConfigurados: [
          {
            tipo: 'piso-laminado',
            dados: {
              ambientes: [
                { largura: 4.5, comprimento: 6.0, nome: 'Sala/Cozinha' },
                { largura: 3.0, comprimento: 3.5, nome: 'Quarto 1' },
                { largura: 2.8, comprimento: 3.2, nome: 'Quarto 2' }
              ]
            }
          }
        ],
        tags: ['residencial', 'apartamento', 'laminado'],
        icone: '🏠'
      }
    ]
    
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
    return templates
  }

  static criarProjetoDeTemplate(templateId: string, nomePersonalizado?: string): Projeto | null {
    const templates = this.listarTemplates()
    const template = templates.find(t => t.id === templateId)
    
    if (!template) return null
    
    return this.criarProjeto({
      nome: nomePersonalizado || template.nome,
      descricao: template.descricao,
      categoria: template.categoria,
      tipo: template.tipo,
      tags: [...template.tags, 'template']
    })
  }

  // Estatísticas
  static obterEstatisticas(): EstatisticasProjeto {
    const projetos = this.listarProjetos()
    
    const stats: EstatisticasProjeto = {
      totalProjetos: projetos.length,
      projetosPorStatus: {},
      projetosPorCategoria: {},
      calculosMaisUsados: [],
      produtividadeMensal: []
    }
    
    // Contagem por status
    projetos.forEach(p => {
      stats.projetosPorStatus[p.status] = (stats.projetosPorStatus[p.status] || 0) + 1
    })
    
    // Contagem por categoria
    projetos.forEach(p => {
      stats.projetosPorCategoria[p.categoria] = (stats.projetosPorCategoria[p.categoria] || 0) + 1
    })
    
    // Cálculos mais usados
    const calculosCount: Record<string, number> = {}
    projetos.forEach(p => {
      p.calculos.forEach(c => {
        calculosCount[c.tipo] = (calculosCount[c.tipo] || 0) + 1
      })
    })
    
    stats.calculosMaisUsados = Object.entries(calculosCount)
      .map(([tipo, quantidade]) => ({ tipo, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5)
    
    // Produtividade mensal (últimos 6 meses)
    const agora = new Date()
    for (let i = 5; i >= 0; i--) {
      const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
      const proximoMes = new Date(agora.getFullYear(), agora.getMonth() - i + 1, 1)
      
      const projetosDoMes = projetos.filter(p => {
        const dataProjeto = new Date(p.dataCriacao)
        return dataProjeto >= data && dataProjeto < proximoMes
      })
      
      const calculosDoMes = projetosDoMes.reduce((total, p) => total + p.calculos.length, 0)
      
      stats.produtividadeMensal.push({
        mes: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        projetos: projetosDoMes.length,
        calculos: calculosDoMes
      })
    }
    
    return stats
  }

  // Import/Export
  static exportarProjeto(id: string): string | null {
    const projeto = this.buscarProjeto(id)
    if (!projeto) return null
    
    return JSON.stringify(projeto, null, 2)
  }

  static exportarTodosProjetos(): string {
    const projetos = this.listarProjetos()
    return JSON.stringify({
      versao: '1.0',
      dataExportacao: new Date().toISOString(),
      projetos
    }, null, 2)
  }

  static importarProjeto(dados: string): boolean {
    try {
      const projeto = JSON.parse(dados) as Projeto
      
      // Validação básica
      if (!projeto.id || !projeto.nome) {
        throw new Error('Dados do projeto inválidos')
      }
      
      // Gerar novo ID para evitar conflitos
      projeto.id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      projeto.dataModificacao = new Date().toISOString()
      
      this.salvarProjeto(projeto)
      return true
    } catch (error) {
      console.error('Erro ao importar projeto:', error)
      return false
    }
  }
}