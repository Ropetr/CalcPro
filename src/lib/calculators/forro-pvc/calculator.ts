// Calculadora principal para Forro PVC
// Implementação baseada no código original com otimizações avançadas

import {
  ComodoPVC,
  MedidaExtraPVC,
  EspecificacoesPVC,
  VaosPVC,
  ResultadoCalculoPVC,
  ResultadoComodoPVC,
  ResultadoMedidaExtraPVC,
  AmbientePVC
} from './types'
import {
  otimizarCorteReguas,
  calcularRodaforroOtimizado,
  REGUAS_DISPONIVEIS,
  ResultadoRodaforro
} from './optimization'

/**
 * Calculadora principal de Forro PVC
 */
export class ForroPVCCalculator {
  
  /**
   * Calcula materiais completos para forro PVC
   */
  public calcular(
    comodos: ComodoPVC[],
    medidasExtras: MedidaExtraPVC[] = [],
    especificacoes: EspecificacoesPVC,
    vaos: VaosPVC = { luminárias: [], ventiladores: [], acesso: [] }
  ): ResultadoCalculoPVC {
    
    const resultadosComodos: ResultadoComodoPVC[] = []
    const resultadosMedidasExtras: ResultadoMedidaExtraPVC[] = []
    let sobrasAcumuladas: Array<{ comprimento: number; origem: string }> = []
    
    // Processar cada cômodo
    for (const comodo of comodos) {
      const resultado = this.calcularComodo(comodo, especificacoes, vaos, sobrasAcumuladas)
      resultadosComodos.push(resultado)
      
      // Atualizar sobras para próximo cômodo
      if (resultado.instrucoesCorteRodaforro) {
        // Extrair sobras das instruções (implementação simplificada)
        // Na implementação completa, seria retornado do calcularRodaforroOtimizado
      }
    }
    
    // Processar medidas extras
    for (const medidaExtra of medidasExtras) {
      const resultado = this.calcularMedidaExtra(medidaExtra)
      resultadosMedidasExtras.push(resultado)
    }
    
    // Calcular totais
    const totais = this.calcularTotais(resultadosComodos, resultadosMedidasExtras)
    
    // Gerar resumo executivo
    const resumoExecutivo = this.gerarResumoExecutivo(totais, resultadosComodos.length, medidasExtras.length)
    
    return {
      comodos: resultadosComodos,
      medidasExtras: resultadosMedidasExtras,
      totais,
      resumoExecutivo,
      observacoes: this.gerarObservacoes(especificacoes, vaos)
    }
  }
  
  /**
   * Calcula materiais para um cômodo específico
   */
  private calcularComodo(
    comodo: ComodoPVC,
    especificacoes: EspecificacoesPVC,
    vaos: VaosPVC,
    sobrasAnteriores: Array<{ comprimento: number; origem: string }>
  ): ResultadoComodoPVC {
    
    // Calcular área total do cômodo
    const area = comodo.ambientes.reduce((total, amb) => total + (amb.largura * amb.comprimento), 0)
    
    // Calcular área de vãos
    const areaVaos = this.calcularAreaVaos(vaos)
    const areaLiquida = area - areaVaos
    
    // Calcular forro (réguas)
    const resultadoForro = this.calcularForroComodo(comodo, areaLiquida)
    
    // Calcular rodaforro (perímetro)
    const perimetro = this.calcularPerimetro(comodo.ambientes)
    const resultadoRodaforro = this.calcularRodaforro(perimetro, comodo.nome, sobrasAnteriores)
    
    // Calcular parafusos
    const parafusos = this.calcularParafusos(areaLiquida, perimetro, especificacoes)
    
    // Calcular perfis
    const perfis = this.calcularPerfis(perimetro, resultadoForro.emendas)
    
    return {
      nome: comodo.nome,
      area: areaLiquida,
      ambientes: comodo.ambientes,
      
      reguasForro: resultadoForro.reguas,
      desperdicioForro: resultadoForro.desperdicio,
      
      barrasRodaforro: resultadoRodaforro.barrasNovas,
      desperdicioRodaforro: resultadoRodaforro.sobraTotal,
      instrucoesCorteRodaforro: resultadoRodaforro.instrucoesCorte,
      
      emendas: resultadoForro.emendas,
      
      parafuso4213: parafusos.parafuso4213,
      parafusoGN25: parafusos.parafusoGN25,
      parafusoBucha: parafusos.parafusoBucha,
      
      cantoneiras: perfis.cantoneiras,
      perfisEmenda: perfis.emendas,
      
      planoCorte: [], // Será implementado na próxima fase
      instrucoesCorte: resultadoRodaforro.instrucoesCorte.map(texto => ({
        texto,
        tipo: 'corte_novo' as const
      }))
    }
  }
  
  /**
   * Calcula forro para um cômodo
   */
  private calcularForroComodo(comodo: ComodoPVC, areaLiquida: number): {
    reguas: Array<{ comprimento: number; quantidade: number }>,
    desperdicio: number,
    emendas: number
  } {
    const reguasMap = new Map<number, number>()
    let desperdicioTotal = 0
    let emendasTotal = 0
    
    // Para cada ambiente do cômodo
    for (const ambiente of comodo.ambientes) {
      // Determinar direção das réguas (sempre no sentido da largura para otimizar)
      const comprimentoRegua = ambiente.largura
      const numeroReguas = Math.ceil(ambiente.comprimento / 0.20) // Réguas a cada 20cm
      
      // Otimizar cortes para este comprimento
      const solucao = otimizarCorteReguas(comprimentoRegua, REGUAS_DISPONIVEIS)
      
      if (solucao) {
        // Multiplicar pela quantidade de réguas necessárias
        solucao.reguas.forEach(regua => {
          const chave = regua.comprimento
          const quantidadeTotal = regua.quantidade * numeroReguas
          reguasMap.set(chave, (reguasMap.get(chave) || 0) + quantidadeTotal)
        })
        
        desperdicioTotal += solucao.desperdicioTotal * numeroReguas
        
        if (solucao.temEmenda) {
          emendasTotal += numeroReguas
        }
      }
    }
    
    return {
      reguas: Array.from(reguasMap.entries()).map(([comprimento, quantidade]) => ({
        comprimento,
        quantidade
      })),
      desperdicio: desperdicioTotal,
      emendas: emendasTotal
    }
  }
  
  /**
   * Calcula rodaforro para um perímetro
   */
  private calcularRodaforro(
    perimetro: number,
    nomeComodo: string,
    sobrasAnteriores: Array<{ comprimento: number; origem: string }>
  ): ResultadoRodaforro {
    // Dividir perímetro em segmentos lógicos (máximo 6m cada)
    const segmentos: number[] = []
    let periметroRestante = perimetro
    
    while (periметroRestante > 6) {
      segmentos.push(6)
      periметroRestante -= 6
    }
    
    if (periметroRestante > 0.01) {
      segmentos.push(periметroRestante)
    }
    
    return calcularRodaforroOtimizado(segmentos, nomeComodo, sobrasAnteriores)
  }
  
  /**
   * Calcula quantidade de parafusos necessários
   */
  private calcularParafusos(area: number, perimetro: number, especificacoes: EspecificacoesPVC): {
    parafuso4213: number,
    parafusoGN25: number,
    parafusoBucha: number
  } {
    // Parafuso 4.2x13 (fixação das réguas): 4 por m²
    const parafuso4213Unidades = Math.ceil(area * 4)
    const parafuso4213Pacotes = Math.ceil(parafuso4213Unidades / 500) // 500 por pacote
    
    // Parafuso GN25 (fixação de perfis): 1 por metro linear de perímetro  
    const parafusoGN25Unidades = Math.ceil(perimetro)
    const parafusoGN25Pacotes = Math.ceil(parafusoGN25Unidades / 100) // 100 por pacote
    
    // Parafuso com bucha (fixação de cantoneiras): 2 por metro linear
    const parafusoBuchaUnidades = Math.ceil(perimetro * 2)
    const parafusoBuchaPacotes = Math.ceil(parafusoBuchaUnidades / 50) // 50 por pacote
    
    return {
      parafuso4213: parafuso4213Pacotes,
      parafusoGN25: parafusoGN25Pacotes,
      parafusoBucha: parafusoBuchaPacotes
    }
  }
  
  /**
   * Calcula perfis necessários
   */
  private calcularPerfis(perimetro: number, emendas: number): {
    cantoneiras: number,
    emendas: number
  } {
    // Cantoneiras: perímetro completo
    const cantoneiras = Math.ceil(perimetro)
    
    // Perfis de emenda: baseado no número de emendas calculadas
    const perfisEmenda = Math.ceil(emendas * 0.1) // 10cm por emenda
    
    return {
      cantoneiras,
      emendas: perfisEmenda
    }
  }
  
  /**
   * Calcula medida extra individual
   */
  private calcularMedidaExtra(medidaExtra: MedidaExtraPVC): ResultadoMedidaExtraPVC {
    const solucao = otimizarCorteReguas(medidaExtra.comprimento, REGUAS_DISPONIVEIS)
    
    const instrucoesCorte = solucao 
      ? [`${medidaExtra.nome}: ${solucao.descricao} (${medidaExtra.quantidade}x)`]
      : [`${medidaExtra.nome}: Não foi possível otimizar`]
    
    return {
      nome: medidaExtra.nome,
      comprimento: medidaExtra.comprimento,
      quantidade: medidaExtra.quantidade,
      solucaoCorte: solucao,
      instrucoesCorte
    }
  }
  
  /**
   * Calcula área dos vãos
   */
  private calcularAreaVaos(vaos: VaosPVC): number {
    let areaTotal = 0
    
    // Luminárias
    vaos.luminárias.forEach(luminaria => {
      areaTotal += luminaria.quantidade * (luminaria.largura * luminaria.altura)
    })
    
    // Ventiladores  
    vaos.ventiladores.forEach(ventilador => {
      areaTotal += ventilador.quantidade * (ventilador.largura * ventilador.altura)
    })
    
    // Acessos
    vaos.acesso.forEach(acesso => {
      areaTotal += acesso.quantidade * (acesso.largura * acesso.altura)
    })
    
    return areaTotal
  }
  
  /**
   * Calcula perímetro de ambientes (suporte a cômodos em L)
   */
  private calcularPerimetro(ambientes: AmbientePVC[]): number {
    if (ambientes.length === 1) {
      // Cômodo retangular simples
      const amb = ambientes[0]
      return 2 * (amb.largura + amb.comprimento)
    }
    
    // Cômodo em L - cálculo aproximado
    // Na implementação completa, seria mais preciso
    let perimetroTotal = 0
    ambientes.forEach(amb => {
      perimetroTotal += 2 * (amb.largura + amb.comprimento)
    })
    
    // Descontar interfaces internas (estimativa)
    return perimetroTotal * 0.8
  }
  
  /**
   * Calcula totais consolidados
   */
  private calcularTotais(
    comodos: ResultadoComodoPVC[],
    medidasExtras: ResultadoMedidaExtraPVC[]
  ) {
    const reguasForro: Record<number, number> = {}
    let area = 0
    let barrasRodaforro = 0
    let desperdicioTotal = 0
    let parafuso4213 = 0
    let parafusoGN25 = 0
    let parafusoBucha = 0
    let cantoneiras = 0
    let perfisEmenda = 0
    
    // Consolidar cômodos
    comodos.forEach(comodo => {
      area += comodo.area
      barrasRodaforro += comodo.barrasRodaforro
      desperdicioTotal += comodo.desperdicioForro + comodo.desperdicioRodaforro
      parafuso4213 += comodo.parafuso4213
      parafusoGN25 += comodo.parafusoGN25
      parafusoBucha += comodo.parafusoBucha
      cantoneiras += comodo.cantoneiras
      perfisEmenda += comodo.perfisEmenda
      
      comodo.reguasForro.forEach(regua => {
        reguasForro[regua.comprimento] = (reguasForro[regua.comprimento] || 0) + regua.quantidade
      })
    })
    
    // Consolidar medidas extras
    medidasExtras.forEach(extra => {
      if (extra.solucaoCorte) {
        extra.solucaoCorte.reguas.forEach(regua => {
          const quantidade = regua.quantidade * extra.quantidade
          reguasForro[regua.comprimento] = (reguasForro[regua.comprimento] || 0) + quantidade
        })
        desperdicioTotal += extra.solucaoCorte.desperdicioTotal * extra.quantidade
      }
    })
    
    return {
      area,
      reguasForro,
      barrasRodaforro,
      desperdicioTotal,
      parafuso4213,
      parafusoGN25,
      parafusoBucha,
      cantoneiras,
      perfisEmenda
    }
  }
  
  /**
   * Gera resumo executivo
   */
  private gerarResumoExecutivo(
    totais: any,
    numeroComodos: number,
    numeroMedidasExtras: number
  ): string[] {
    const resumo = [
      `📏 Área total: ${totais.area.toFixed(2)}m²`,
      `🏠 ${numeroComodos} cômodo(s) calculado(s)`
    ]
    
    if (numeroMedidasExtras > 0) {
      resumo.push(`📐 ${numeroMedidasExtras} medida(s) extra(s)`)
    }
    
    resumo.push(`📦 ${Object.values(totais.reguasForro).reduce((a: any, b: any) => a + b, 0)} réguas de forro`)
    resumo.push(`🔨 ${totais.barrasRodaforro} barras de rodaforro`)
    
    if (totais.desperdicioTotal > 0) {
      resumo.push(`⚠️ Desperdício estimado: ${totais.desperdicioTotal.toFixed(2)}m²`)
    }
    
    return resumo
  }
  
  /**
   * Gera observações técnicas
   */
  private gerarObservacoes(especificacoes: EspecificacoesPVC, vaos: VaosPVC): string[] {
    const observacoes = [
      '• Cálculos baseados em réguas comerciais de 3m, 4m, 5m e 6m',
      '• Rodaforro calculado em barras de 6m com aproveitamento de sobras',
      '• Desperdício inclui recortes não aproveitáveis (<10cm)'
    ]
    
    if (especificacoes.instalacao === 'colada') {
      observacoes.push('• Instalação colada requer cola específica para PVC')
    }
    
    if (vaos.luminárias.length > 0 || vaos.ventiladores.length > 0 || vaos.acesso.length > 0) {
      observacoes.push('• Área de vãos descontada do cálculo total')
    }
    
    return observacoes
  }
}