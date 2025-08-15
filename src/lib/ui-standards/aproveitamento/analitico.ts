/**
 * Engine Analítico de Aproveitamento - Baseado em Medidas Reais
 * Analisa cada ambiente individualmente e otimiza globalmente
 */

import { MaterialPadrao, RecorteDisponivel, ConfigAproveitamento } from './types'

export interface MedidaAmbiente {
  id: string
  ambiente: string  // "Sala", "Quarto 1", etc.
  parede?: string   // opcional para divisórias
  largura: number   // metros
  comprimento: number // metros
  area: number
}

export interface RecorteNecessario {
  largura: number
  comprimento: number
  quantidade: number
  posicao: 'completo' | 'recorte_largura' | 'recorte_comprimento' | 'recorte_canto'
}

export interface PlanoCorteAmbiente {
  ambiente: string
  parede?: string
  medidaOriginal: { largura: number; comprimento: number }
  recortesNecessarios: RecorteNecessario[]
  materiaisNovos: { material: MaterialPadrao; quantidade: number }[]
  recortesUsados: RecorteDisponivel[]
  sobrasGeradas: RecorteDisponivel[]
  aproveitamentoInterno: number // % de aproveitamento dentro do próprio ambiente
}

export class EngineAnalitico {
  private config: ConfigAproveitamento
  private materiaisPadrao: MaterialPadrao[]
  private poolSobras: RecorteDisponivel[] = []

  constructor(config: ConfigAproveitamento, materiaisPadrao: MaterialPadrao[]) {
    this.config = config
    this.materiaisPadrao = materiaisPadrao
  }

  /**
   * Analisar todas as medidas e calcular aproveitamento ótimo
   */
  analisarMedidas(medidas: MedidaAmbiente[]): PlanoCorteAmbiente[] {
    const planosCorte: PlanoCorteAmbiente[] = []
    
    // Processar cada ambiente individualmente
    for (const medida of medidas) {
      const plano = this.analisarAmbiente(medida)
      planosCorte.push(plano)
      
      // Adicionar sobras ao pool global
      this.poolSobras.push(...plano.sobrasGeradas)
    }
    
    return planosCorte
  }

  /**
   * Analisar um ambiente específico
   */
  private analisarAmbiente(medida: MedidaAmbiente): PlanoCorteAmbiente {
    const plano: PlanoCorteAmbiente = {
      ambiente: medida.ambiente,
      parede: medida.parede,
      medidaOriginal: { largura: medida.largura, comprimento: medida.comprimento },
      recortesNecessarios: [],
      materiaisNovos: [],
      recortesUsados: [],
      sobrasGeradas: [],
      aproveitamentoInterno: 0
    }

    // 1. Identificar que recortes são necessários
    plano.recortesNecessarios = this.identificarRecortesNecessarios(medida.largura, medida.comprimento)

    // 2. Tentar aproveitar sobras disponíveis PRIMEIRO
    this.tentarAproveitar(plano.recortesNecessarios, plano)

    // 3. Calcular material novo para recortes restantes
    this.calcularMaterialNovo(plano.recortesNecessarios, plano)

    // 4. Analisar aproveitamento interno (sobras do próprio ambiente)
    this.otimizarAproveitamentoInterno(plano)

    return plano
  }

  /**
   * Identificar todos os recortes necessários para cobrir a área
   */
  private identificarRecortesNecessarios(largura: number, comprimento: number): RecorteNecessario[] {
    const recortes: RecorteNecessario[] = []
    
    // Escolher melhor material padrão como base
    const materialBase = this.escolherMelhorMaterial(largura, comprimento)
    if (!materialBase) return recortes

    const matLargura = materialBase.largura
    const matComprimento = materialBase.comprimento

    // Calcular quantos painéis completos cabem
    const paineisLargura = Math.floor(largura / matLargura)
    const paineisComprimento = Math.floor(comprimento / matComprimento)

    // Painéis completos
    if (paineisLargura > 0 && paineisComprimento > 0) {
      recortes.push({
        largura: matLargura,
        comprimento: matComprimento,
        quantidade: paineisLargura * paineisComprimento,
        posicao: 'completo'
      })
    }

    // Recorte na largura (se sobrou)
    const sobraLargura = largura - (paineisLargura * matLargura)
    if (sobraLargura > this.config.aproveitamentoMinimo.largura) {
      recortes.push({
        largura: sobraLargura,
        comprimento: matComprimento,
        quantidade: paineisComprimento,
        posicao: 'recorte_largura'
      })
    }

    // Recorte no comprimento (se sobrou)
    const sobraComprimento = comprimento - (paineisComprimento * matComprimento)
    if (sobraComprimento > this.config.aproveitamentoMinimo.comprimento) {
      recortes.push({
        largura: matLargura,
        comprimento: sobraComprimento,
        quantidade: paineisLargura,
        posicao: 'recorte_comprimento'
      })
    }

    // Recorte do canto (se sobrou em ambos)
    if (sobraLargura > this.config.aproveitamentoMinimo.largura && 
        sobraComprimento > this.config.aproveitamentoMinimo.comprimento) {
      recortes.push({
        largura: sobraLargura,
        comprimento: sobraComprimento,
        quantidade: 1,
        posicao: 'recorte_canto'
      })
    }

    return recortes
  }

  /**
   * Tentar aproveitar sobras disponíveis no pool
   */
  private tentarAproveitar(recortesNecessarios: RecorteNecessario[], plano: PlanoCorteAmbiente) {
    const recortesRestantes: RecorteNecessario[] = []

    for (const recorte of recortesNecessarios) {
      let quantidadeRestante = recorte.quantidade

      // Buscar sobras que sirvam para este recorte
      const sobrasUtiveis = this.poolSobras
        .filter(sobra => !sobra.usado)
        .filter(sobra => this.podeUsar(sobra, recorte.largura, recorte.comprimento))
        .sort((a, b) => {
          // Priorizar sobras com menor desperdício
          const desperdicioA = (a.largura * a.comprimento) - (recorte.largura * recorte.comprimento)
          const desperdicioB = (b.largura * b.comprimento) - (recorte.largura * recorte.comprimento)
          return desperdicioA - desperdicioB
        })

      // Usar sobras disponíveis
      for (const sobra of sobrasUtiveis) {
        if (quantidadeRestante <= 0) break

        sobra.usado = true
        sobra.ondeUsado = {
          ambiente: plano.ambiente,
          parede: plano.parede,
          economia: recorte.largura * recorte.comprimento
        }

        plano.recortesUsados.push(sobra)
        quantidadeRestante--
      }

      // Se ainda precisa de material novo
      if (quantidadeRestante > 0) {
        recortesRestantes.push({
          ...recorte,
          quantidade: quantidadeRestante
        })
      }
    }

    // Atualizar lista com recortes que ainda precisam de material novo
    plano.recortesNecessarios = recortesRestantes
  }

  /**
   * Verificar se uma sobra pode ser usada para um recorte
   */
  private podeUsar(sobra: RecorteDisponivel, larguraNecessaria: number, comprimentoNecessario: number): boolean {
    // Uso normal
    if (sobra.largura >= larguraNecessaria && sobra.comprimento >= comprimentoNecessario) {
      return true
    }
    
    // Uso com rotação (se permitido)
    if (this.config.permitirRotacao && 
        sobra.largura >= comprimentoNecessario && 
        sobra.comprimento >= larguraNecessaria) {
      return true
    }

    return false
  }

  /**
   * Calcular material novo necessário
   */
  private calcularMaterialNovo(recortesNecessarios: RecorteNecessario[], plano: PlanoCorteAmbiente) {
    for (const recorte of recortesNecessarios) {
      const materialNecessario = this.escolherMelhorMaterial(recorte.largura, recorte.comprimento)
      
      if (materialNecessario) {
        // Adicionar aos materiais novos
        const materialExistente = plano.materiaisNovos.find(m => m.material.codigo === materialNecessario.codigo)
        if (materialExistente) {
          materialExistente.quantidade += recorte.quantidade
        } else {
          plano.materiaisNovos.push({
            material: materialNecessario,
            quantidade: recorte.quantidade
          })
        }

        // Gerar sobras do material novo
        this.gerarSobras(materialNecessario, recorte, plano)
      }
    }
  }

  /**
   * Gerar sobras do material novo cortado
   */
  private gerarSobras(material: MaterialPadrao, recorte: RecorteNecessario, plano: PlanoCorteAmbiente) {
    const sobraLargura = material.largura - recorte.largura
    const sobraComprimento = material.comprimento - recorte.comprimento

    // Sobra na largura
    if (sobraLargura >= this.config.aproveitamentoMinimo.largura) {
      plano.sobrasGeradas.push({
        id: `sobra-${Date.now()}-${Math.random()}`,
        materialOrigem: material,
        largura: sobraLargura,
        comprimento: recorte.comprimento,
        origem: {
          ambiente: plano.ambiente,
          parede: plano.parede,
          posicao: 'largura'
        },
        aproveitavel: true,
        usado: false
      })
    }

    // Sobra no comprimento
    if (sobraComprimento >= this.config.aproveitamentoMinimo.comprimento) {
      plano.sobrasGeradas.push({
        id: `sobra-${Date.now()}-${Math.random()}`,
        materialOrigem: material,
        largura: recorte.largura,
        comprimento: sobraComprimento,
        origem: {
          ambiente: plano.ambiente,
          parede: plano.parede,
          posicao: 'comprimento'
        },
        aproveitavel: true,
        usado: false
      })
    }

    // Sobra do canto (se ambas existem)
    if (sobraLargura >= this.config.aproveitamentoMinimo.largura && 
        sobraComprimento >= this.config.aproveitamentoMinimo.comprimento) {
      plano.sobrasGeradas.push({
        id: `sobra-${Date.now()}-${Math.random()}`,
        materialOrigem: material,
        largura: sobraLargura,
        comprimento: sobraComprimento,
        origem: {
          ambiente: plano.ambiente,
          parede: plano.parede,
          posicao: 'ambas'
        },
        aproveitavel: true,
        usado: false
      })
    }
  }

  /**
   * Otimizar aproveitamento interno (usar sobras do próprio ambiente)
   */
  private otimizarAproveitamentoInterno(plano: PlanoCorteAmbiente) {
    // Implementar lógica para usar sobras geradas no mesmo ambiente
    // para satisfazer outros recortes necessários no mesmo ambiente
    
    const sobrasInternas = plano.sobrasGeradas.filter(s => !s.usado)
    const recortesRestantes = [...plano.recortesNecessarios]

    // Tentar usar sobras internas antes de considerar material novo
    for (const sobra of sobrasInternas) {
      for (let i = recortesRestantes.length - 1; i >= 0; i--) {
        const recorte = recortesRestantes[i]
        
        if (this.podeUsar(sobra, recorte.largura, recorte.comprimento)) {
          sobra.usado = true
          sobra.ondeUsado = {
            ambiente: plano.ambiente,
            parede: plano.parede,
            economia: recorte.largura * recorte.comprimento
          }
          
          plano.recortesUsados.push(sobra)
          
          // Reduzir quantidade necessária
          recorte.quantidade--
          if (recorte.quantidade <= 0) {
            recortesRestantes.splice(i, 1)
          }
          break
        }
      }
    }

    // Atualizar recortes necessários
    plano.recortesNecessarios = recortesRestantes.filter(r => r.quantidade > 0)
    
    // Calcular percentual de aproveitamento interno
    const totalRecortes = plano.recortesNecessarios.reduce((sum, r) => sum + r.quantidade, 0)
    const recortesAproveitados = plano.recortesUsados.length
    plano.aproveitamentoInterno = totalRecortes > 0 ? (recortesAproveitados / totalRecortes) * 100 : 0
  }

  /**
   * Escolher melhor material padrão para as dimensões
   */
  private escolherMelhorMaterial(largura: number, comprimento: number): MaterialPadrao | null {
    const materiaisViaveis = this.materiaisPadrao.filter(material => 
      material.largura >= largura && material.comprimento >= comprimento ||
      (this.config.permitirRotacao && material.largura >= comprimento && material.comprimento >= largura)
    )

    if (materiaisViaveis.length === 0) return null

    return materiaisViaveis.reduce((melhor, atual) => {
      const desperdicioMelhor = (melhor.largura * melhor.comprimento) - (largura * comprimento)
      const desperdicioAtual = (atual.largura * atual.comprimento) - (largura * comprimento)
      return desperdicioAtual < desperdicioMelhor ? atual : melhor
    })
  }

  /**
   * Gerar relatório de aproveitamento
   */
  gerarRelatorio(planos: PlanoCorteAmbiente[]): {
    totalMaterialNovo: number
    totalSobrasGeradas: number  
    totalSobrasAproveitadas: number
    economiaPercentual: number
    detalhePorAmbiente: PlanoCorteAmbiente[]
  } {
    const totalMaterialNovo = planos.reduce((sum, p) => 
      sum + p.materiaisNovos.reduce((ms, m) => ms + m.quantidade, 0), 0)
    
    const totalSobrasGeradas = planos.reduce((sum, p) => sum + p.sobrasGeradas.length, 0)
    const totalSobrasAproveitadas = planos.reduce((sum, p) => sum + p.recortesUsados.length, 0)
    
    const economiaPercentual = totalSobrasGeradas > 0 ? 
      (totalSobrasAproveitadas / totalSobrasGeradas) * 100 : 0

    return {
      totalMaterialNovo,
      totalSobrasGeradas,
      totalSobrasAproveitadas,
      economiaPercentual,
      detalhePorAmbiente: planos
    }
  }
}