/**
 * Engine Universal de Aproveitamento de Materiais
 * Sistema analítico baseado em medidas reais fornecidas pelo usuário
 */

import { 
  MaterialPadrao, 
  RecorteDisponivel, 
  ConfigAproveitamento, 
  GerenciadorAproveitamento,
  SolucaoAproveitamento 
} from './types'

export class AproveitamentoEngine implements GerenciadorAproveitamento {
  public config: ConfigAproveitamento
  public recortesDisponiveis: RecorteDisponivel[] = []
  private materiaisPadrao: MaterialPadrao[]

  constructor(config: ConfigAproveitamento, materiaisPadrao: MaterialPadrao[]) {
    this.config = config
    this.materiaisPadrao = materiaisPadrao.sort((a, b) => 
      (b.largura * b.comprimento) - (a.largura * a.comprimento) // Ordenar por área (maior primeiro)
    )
  }

  /**
   * Calcular necessidade de material para uma área específica
   */
  calcularNecessidade(
    largura: number, 
    comprimento: number, 
    ambiente: string, 
    parede?: string
  ) {
    const resultado = {
      materiaisNecessarios: [] as { material: MaterialPadrao; quantidade: number }[],
      recortesGerados: [] as RecorteDisponivel[],
      recortesUsados: [] as RecorteDisponivel[]
    }

    let larguraRestante = largura
    let comprimentoRestante = comprimento

    // Primeiro: tentar usar recortes disponíveis
    const recortesUsaveis = this.buscarRecortesUsaveis(larguraRestante, comprimentoRestante)
    
    for (const recorte of recortesUsaveis) {
      if (larguraRestante <= 0 && comprimentoRestante <= 0) break
      
      const usoRecorte = this.calcularUsoRecorte(recorte, larguraRestante, comprimentoRestante)
      
      if (usoRecorte.podeUsar) {
        // Marcar recorte como usado
        recorte.usado = true
        recorte.ondeUsado = {
          ambiente,
          parede,
          economia: usoRecorte.economia
        }
        
        resultado.recortesUsados.push(recorte)
        
        // Reduzir área necessária
        larguraRestante = Math.max(0, larguraRestante - usoRecorte.larguraUsada)
        comprimentoRestante = Math.max(0, comprimentoRestante - usoRecorte.comprimentoUsado)
      }
    }

    // Segundo: calcular material novo necessário
    if (larguraRestante > 0 || comprimentoRestante > 0) {
      const materiaisNovos = this.calcularMaterialNovo(larguraRestante, comprimentoRestante, ambiente, parede)
      resultado.materiaisNecessarios = materiaisNovos.materiaisNecessarios
      resultado.recortesGerados = materiaisNovos.recortesGerados
      
      // Adicionar novos recortes ao pool
      for (const recorte of resultado.recortesGerados) {
        this.adicionarRecorte(recorte)
      }
    }

    return resultado
  }

  /**
   * Buscar recortes que podem ser aproveitados
   */
  private buscarRecortesUsaveis(largura: number, comprimento: number): RecorteDisponivel[] {
    return this.recortesDisponiveis
      .filter(recorte => !recorte.usado && recorte.aproveitavel)
      .filter(recorte => {
        // Verificar se recorte serve (com ou sem rotação)
        const serveNormal = recorte.largura >= largura && recorte.comprimento >= comprimento
        const serveRotacionado = this.config.permitirRotacao && 
                                recorte.largura >= comprimento && recorte.comprimento >= largura
        return serveNormal || serveRotacionado
      })
      .sort((a, b) => {
        // Priorizar recortes que deixam menos sobra
        const sobraA = (a.largura * a.comprimento) - (largura * comprimento)
        const sobraB = (b.largura * b.comprimento) - (largura * comprimento)
        return sobraA - sobraB
      })
  }

  /**
   * Calcular como usar um recorte específico
   */
  private calcularUsoRecorte(
    recorte: RecorteDisponivel, 
    larguraNecessaria: number, 
    comprimentoNecessario: number
  ) {
    // Tentar usar sem rotação
    if (recorte.largura >= larguraNecessaria && recorte.comprimento >= comprimentoNecessario) {
      return {
        podeUsar: true,
        larguraUsada: larguraNecessaria,
        comprimentoUsado: comprimentoNecessario,
        economia: larguraNecessaria * comprimentoNecessario,
        rotacionado: false
      }
    }

    // Tentar com rotação se permitido
    if (this.config.permitirRotacao && 
        recorte.largura >= comprimentoNecessario && 
        recorte.comprimento >= larguraNecessaria) {
      return {
        podeUsar: true,
        larguraUsada: comprimentoNecessario,
        comprimentoUsado: larguraNecessaria,
        economia: larguraNecessaria * comprimentoNecessario,
        rotacionado: true
      }
    }

    return {
      podeUsar: false,
      larguraUsada: 0,
      comprimentoUsado: 0,
      economia: 0,
      rotacionado: false
    }
  }

  /**
   * Calcular material novo necessário
   */
  private calcularMaterialNovo(
    largura: number, 
    comprimento: number, 
    ambiente: string, 
    parede?: string
  ) {
    const resultado = {
      materiaisNecessarios: [] as { material: MaterialPadrao; quantidade: number }[],
      recortesGerados: [] as RecorteDisponivel[]
    }

    // Encontrar melhor material padrão
    const melhorMaterial = this.encontrarMelhorMaterial(largura, comprimento)
    
    if (melhorMaterial) {
      // Calcular quantas peças são necessárias
      const pecasLargura = Math.ceil(largura / melhorMaterial.largura)
      const pecasComprimento = Math.ceil(comprimento / melhorMaterial.comprimento)
      const quantidadeTotal = pecasLargura * pecasComprimento

      resultado.materiaisNecessarios.push({
        material: melhorMaterial,
        quantidade: quantidadeTotal
      })

      // Gerar recortes das sobras
      const sobras = this.calcularSobras(melhorMaterial, largura, comprimento, pecasLargura, pecasComprimento, ambiente, parede)
      resultado.recortesGerados = sobras
    }

    return resultado
  }

  /**
   * Encontrar melhor material padrão para as dimensões
   */
  private encontrarMelhorMaterial(largura: number, comprimento: number): MaterialPadrao | null {
    // Filtrar materiais que servem
    const materiaisViaveis = this.materiaisPadrao.filter(material => 
      material.largura >= largura && material.comprimento >= comprimento ||
      (this.config.permitirRotacao && material.largura >= comprimento && material.comprimento >= largura)
    )

    if (materiaisViaveis.length === 0) return null

    // Escolher o que gera menos desperdício
    return materiaisViaveis.reduce((melhor, atual) => {
      const desperdicioMelhor = (melhor.largura * melhor.comprimento) - (largura * comprimento)
      const desperdicioAtual = (atual.largura * atual.comprimento) - (largura * comprimento)
      return desperdicioAtual < desperdicioMelhor ? atual : melhor
    })
  }

  /**
   * Calcular sobras geradas pelo corte
   */
  private calcularSobras(
    material: MaterialPadrao,
    larguraUsada: number,
    comprimentoUsado: number,
    pecasLargura: number,
    pecasComprimento: number,
    ambiente: string,
    parede?: string
  ): RecorteDisponivel[] {
    const recortes: RecorteDisponivel[] = []

    // Sobra na largura (se houver)
    const sobraLargura = (material.largura * pecasLargura) - larguraUsada
    if (sobraLargura >= this.config.aproveitamentoMinimo.largura) {
      recortes.push({
        id: `recorte-${Date.now()}-largura`,
        materialOrigem: material,
        largura: sobraLargura,
        comprimento: comprimentoUsado,
        origem: {
          ambiente,
          parede,
          posicao: 'largura'
        },
        aproveitavel: true,
        usado: false
      })
    }

    // Sobra no comprimento (se houver)
    const sobraComprimento = (material.comprimento * pecasComprimento) - comprimentoUsado
    if (sobraComprimento >= this.config.aproveitamentoMinimo.comprimento) {
      recortes.push({
        id: `recorte-${Date.now()}-comprimento`,
        materialOrigem: material,
        largura: larguraUsada,
        comprimento: sobraComprimento,
        origem: {
          ambiente,
          parede,
          posicao: 'comprimento'
        },
        aproveitavel: true,
        usado: false
      })
    }

    // Sobra canto (se houver sobra em ambas direções)
    if (sobraLargura >= this.config.aproveitamentoMinimo.largura && 
        sobraComprimento >= this.config.aproveitamentoMinimo.comprimento) {
      recortes.push({
        id: `recorte-${Date.now()}-canto`,
        materialOrigem: material,
        largura: sobraLargura,
        comprimento: sobraComprimento,
        origem: {
          ambiente,
          parede,
          posicao: 'ambas'
        },
        aproveitavel: true,
        usado: false
      })
    }

    return recortes
  }

  /**
   * Adicionar recorte ao pool de disponíveis
   */
  adicionarRecorte(recorte: RecorteDisponivel): void {
    // Verificar se é aproveitável
    recorte.aproveitavel = 
      recorte.largura >= this.config.aproveitamentoMinimo.largura &&
      recorte.comprimento >= this.config.aproveitamentoMinimo.comprimento

    this.recortesDisponiveis.push(recorte)
  }

  /**
   * Buscar melhor recorte para dimensões específicas
   */
  buscarMelhorRecorte(larguraNecessaria: number, comprimentoNecessario: number): RecorteDisponivel | null {
    const recortesUsaveis = this.buscarRecortesUsaveis(larguraNecessaria, comprimentoNecessario)
    return recortesUsaveis.length > 0 ? recortesUsaveis[0] : null
  }

  /**
   * Gerar relatório completo de aproveitamento
   */
  gerarRelatorioAproveitamento(): SolucaoAproveitamento {
    const recortesUsados = this.recortesDisponiveis.filter(r => r.usado)
    const sobrasFinais = this.recortesDisponiveis.filter(r => !r.usado && r.aproveitavel)
    
    const economiaTotal = recortesUsados.reduce((total, recorte) => 
      total + (recorte.ondeUsado?.economia || 0), 0
    )

    const totalMaterialNovo = this.recortesDisponiveis.length // Simplificado para exemplo
    const economiaPercentual = totalMaterialNovo > 0 ? (economiaTotal / totalMaterialNovo) * 100 : 0

    return {
      totalMaterialNovo,
      totalRecortesUsados: recortesUsados.length,
      economiaPercentual,
      detalhamento: [] // TODO: Implementar detalhamento por ambiente
    }
  }

  /**
   * Limpar recortes usados ou inaproveitáveis
   */
  limparRecortes(): void {
    this.recortesDisponiveis = this.recortesDisponiveis.filter(r => !r.usado && r.aproveitavel)
  }
}

/**
 * Factory para criar engine de aproveitamento
 */
export function criarEngineAproveitamento(
  tipoMaterial: ConfigAproveitamento['materialTipo'],
  materiaisPadrao: MaterialPadrao[],
  configCustom?: Partial<ConfigAproveitamento>
): AproveitamentoEngine {
  const { CONFIGS_APROVEITAMENTO } = require('./types')
  const configBase = CONFIGS_APROVEITAMENTO[tipoMaterial]
  const config = { ...configBase, ...configCustom }
  
  return new AproveitamentoEngine(config, materiaisPadrao)
}