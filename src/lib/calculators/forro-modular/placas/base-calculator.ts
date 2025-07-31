import { 
  DimensoesPlaca, 
  CalculoDimensao, 
  RecorteInfo, 
  RecortesPlaca, 
  ResultadoCalculoPlacas 
} from './types'

/**
 * Classe base para cálculo de placas de forro modular
 * Implementa a lógica genérica fornecida pelo usuário
 */
export class BasePlacaCalculator {
  public nome: string
  public dimensoes: DimensoesPlaca
  public codigo: string

  constructor(nome: string, dimensoes: DimensoesPlaca, codigo: string) {
    this.nome = nome
    this.dimensoes = dimensoes
    this.codigo = codigo
  }

  /**
   * Função auxiliar para calcular uma dimensão
   */
  private calcularDimensao(dimensaoAmbiente: number, dimensaoPlaca: number): CalculoDimensao {
    const quantidade = dimensaoAmbiente / dimensaoPlaca
    const inteiras = Math.floor(quantidade)
    const fracao = quantidade - inteiras
    const pedacoNecessario = fracao * dimensaoPlaca
    const sobra = fracao > 0 ? dimensaoPlaca - pedacoNecessario : 0

    return {
      quantidade: Math.round(quantidade * 100) / 100,
      inteiras: inteiras,
      fracao: Math.round(fracao * 100) / 100,
      pedacoNecessario: Math.round(pedacoNecessario * 1000) / 1000, // Em metros com 3 casas
      sobra: Math.round(sobra * 1000) / 1000
    }
  }

  /**
   * Função auxiliar para gerar observações
   */
  private gerarObservacoes(
    calculoLargura: CalculoDimensao, 
    calculoComprimento: CalculoDimensao, 
    recortes: RecortesPlaca
  ): string[] {
    const obs: string[] = []

    // Verificar aproveitamento de sobras
    if (recortes.largura && recortes.largura.aproveitavel) {
      obs.push(`Sobra na largura (${recortes.largura.sobraPorPeca}) pode ser aproveitada`)
    }

    if (recortes.comprimento && recortes.comprimento.aproveitavel) {
      obs.push(`Sobra no comprimento (${recortes.comprimento.sobraPorPeca}) pode ser aproveitada`)
    }

    // Informação sobre o canto
    if (recortes.canto) {
      if (recortes.canto.aproveitadoDaSobraLargura) {
        obs.push(`Canto (${recortes.canto.tamanho}) aproveitado da sobra dos recortes de largura`)
      } else if (recortes.canto.aproveitadoDaSobraComprimento) {
        obs.push(`Canto (${recortes.canto.tamanho}) aproveitado da sobra dos recortes de comprimento`)
      } else if (recortes.canto.precisaPlacaAdicional) {
        obs.push(`Canto (${recortes.canto.tamanho}) precisa de 1 placa adicional`)
      }
    }

    // Verificar se há encaixe perfeito
    if (calculoLargura.fracao === 0) {
      obs.push("Encaixe perfeito na largura - sem recortes")
    }

    if (calculoComprimento.fracao === 0) {
      obs.push("Encaixe perfeito no comprimento - sem recortes")
    }

    return obs
  }

  /**
   * Cálculo principal de placas - implementação da lógica correta do usuário
   */
  calcular(larguraAmbiente: number, comprimentoAmbiente: number): ResultadoCalculoPlacas {
    // Calcular largura e comprimento usando a lógica do usuário
    const calculoLargura = this.calcularDimensao(larguraAmbiente, this.dimensoes.largura)
    const calculoComprimento = this.calcularDimensao(comprimentoAmbiente, this.dimensoes.comprimento)

    // PLACAS INTEIRAS (sem recorte)
    const placasInteiras = calculoLargura.inteiras * calculoComprimento.inteiras

    // CÁLCULO DE PLACAS PARA RECORTES
    let placasParaRecortesLargura = 0
    let placasParaRecortesComprimento = 0
    let placasParaCanto = 0
    
    // Análise de recortes e aproveitamento
    const recortes: RecortesPlaca = {
      largura: null,
      comprimento: null,
      canto: null
    }

    // 1. RECORTES NA LARGURA - calcular quantas placas físicas precisa
    if (calculoLargura.fracao > 0) {
      const quantidadeRecortesLargura = calculoComprimento.inteiras
      const recortesPorPlaca = Math.floor(this.dimensoes.largura / calculoLargura.pedacoNecessario)
      placasParaRecortesLargura = Math.ceil(quantidadeRecortesLargura / recortesPorPlaca)
      
      // Detalhamento das peças necessárias
      const detalhamentoPecas = [{
        tamanho: `${calculoLargura.pedacoNecessario}m × ${this.dimensoes.comprimento}m`,
        quantidade: quantidadeRecortesLargura
      }]
      
      // Cálculo da sobra da placa
      const sobraLargura = this.dimensoes.largura - (calculoLargura.pedacoNecessario * recortesPorPlaca)
      const sobraTamanho = `${sobraLargura}m × ${this.dimensoes.comprimento}m`
      
      recortes.largura = {
        quantidade: placasParaRecortesLargura,
        tamanhoPorPeca: `${calculoLargura.pedacoNecessario}m × ${this.dimensoes.comprimento}m`,
        sobraPorPeca: sobraTamanho,
        aproveitavel: sobraLargura >= 0.02,
        detalhamentoPecas: detalhamentoPecas,
        detalhamentoAproveitamento: {
          placasNecessarias: placasParaRecortesLargura,
          pecasPorPlaca: recortesPorPlaca,
          totalPecas: quantidadeRecortesLargura,
          sobra: {
            tamanho: sobraTamanho,
            aproveitavel: sobraLargura >= 0.02
          }
        }
      }
    }

    // 2. RECORTES NO COMPRIMENTO - calcular quantas placas físicas precisa
    if (calculoComprimento.fracao > 0) {
      const quantidadeRecortesComprimento = calculoLargura.inteiras
      const recortesPorPlaca = Math.floor(this.dimensoes.comprimento / calculoComprimento.pedacoNecessario)
      placasParaRecortesComprimento = Math.ceil(quantidadeRecortesComprimento / recortesPorPlaca)
      
      // Detalhamento das peças necessárias
      const detalhamentoPecas = [{
        tamanho: `${this.dimensoes.largura}m × ${calculoComprimento.pedacoNecessario}m`,
        quantidade: quantidadeRecortesComprimento
      }]
      
      // Cálculo da sobra da placa
      const sobraComprimento = Math.round((this.dimensoes.comprimento - (calculoComprimento.pedacoNecessario * recortesPorPlaca)) * 100) / 100
      const sobraTamanho = `${this.dimensoes.largura}m × ${sobraComprimento}m`
      
      recortes.comprimento = {
        quantidade: placasParaRecortesComprimento,
        tamanhoPorPeca: `${this.dimensoes.largura}m × ${calculoComprimento.pedacoNecessario}m`,
        sobraPorPeca: sobraTamanho,
        aproveitavel: sobraComprimento >= 0.02,
        detalhamentoPecas: detalhamentoPecas,
        detalhamentoAproveitamento: {
          placasNecessarias: placasParaRecortesComprimento,
          pecasPorPlaca: recortesPorPlaca,
          totalPecas: quantidadeRecortesComprimento,
          sobra: {
            tamanho: sobraTamanho,
            aproveitavel: sobraComprimento >= 0.02
          }
        }
      }
    }

    // 3. CANTO - análise final para verificar se sobras conseguem cobrir
    if (calculoLargura.fracao > 0 && calculoComprimento.fracao > 0) {
      const cantoLargura = calculoLargura.pedacoNecessario
      const cantoComprimento = calculoComprimento.pedacoNecessario
      
      let aproveitadoDaSobraLargura = false
      let aproveitadoDaSobraComprimento = false
      let precisaPlacaAdicional = true
      
      // 1º Verificar se sobra da largura consegue cobrir o canto
      if (recortes.largura?.detalhamentoAproveitamento?.sobra.aproveitavel) {
        const sobraLarguraDimensoes = recortes.largura.detalhamentoAproveitamento.sobra.tamanho.split(' × ')
        const sobraL = parseFloat(sobraLarguraDimensoes[0].replace('m', ''))
        const sobraC = parseFloat(sobraLarguraDimensoes[1].replace('m', ''))
        
        // Verificar se consegue fazer o canto (considerando rotação)
        if ((sobraL >= cantoLargura && sobraC >= cantoComprimento) || 
            (sobraL >= cantoComprimento && sobraC >= cantoLargura)) {
          aproveitadoDaSobraLargura = true
          precisaPlacaAdicional = false
        }
      }
      
      // 2º Se não deu na largura, verificar sobra do comprimento
      if (!aproveitadoDaSobraLargura && recortes.comprimento?.detalhamentoAproveitamento?.sobra.aproveitavel) {
        const sobraComprimentoDimensoes = recortes.comprimento.detalhamentoAproveitamento.sobra.tamanho.split(' × ')
        const sobraL = parseFloat(sobraComprimentoDimensoes[0].replace('m', ''))
        const sobraC = parseFloat(sobraComprimentoDimensoes[1].replace('m', ''))
        
        // Verificar se consegue fazer o canto (considerando rotação)
        if ((sobraL >= cantoLargura && sobraC >= cantoComprimento) || 
            (sobraL >= cantoComprimento && sobraC >= cantoLargura)) {
          aproveitadoDaSobraComprimento = true
          precisaPlacaAdicional = false
        }
      }
      
      // 3º Se nenhuma sobra consegue, precisa de placa adicional
      let detalhamentoPlacaAdicional = undefined
      if (precisaPlacaAdicional) {
        // Processo: cortar largura inteira (0,625m) × comprimento necessário (0,20m)
        const sobra1Largura = this.dimensoes.largura
        const sobra1Comprimento = this.dimensoes.comprimento - cantoComprimento
        
        const sobra2Largura = this.dimensoes.largura - cantoLargura
        const sobra2Comprimento = cantoComprimento
        
        detalhamentoPlacaAdicional = {
          placasNecessarias: 1,
          tamanhoCorte: `${cantoLargura}m × ${cantoComprimento}m`,
          sobra1: `${sobra1Largura}m × ${Math.round(sobra1Comprimento * 100) / 100}m`,
          sobra2: `${sobra2Largura}m × ${sobra2Comprimento}m`
        }
        placasParaCanto = 1
      }
      
      recortes.canto = {
        tamanho: `${cantoLargura}m × ${cantoComprimento}m`,
        aproveitadoDaSobraLargura,
        aproveitadoDaSobraComprimento,
        precisaPlacaAdicional,
        detalhamentoPlacaAdicional
      }
    }

    // TOTAL DE PLACAS = inteiras + recortes largura + recortes comprimento + canto (se necessário)
    const totalPlacas = placasInteiras + placasParaRecortesLargura + placasParaRecortesComprimento + placasParaCanto
    const placasComRecorte = placasParaRecortesLargura + placasParaRecortesComprimento + placasParaCanto

    // Retornar resultado
    return {
      tipoPlaca: this.codigo,
      dimensoesPlaca: this.dimensoes,
      ambiente: {
        largura: larguraAmbiente,
        comprimento: comprimentoAmbiente,
        area: Math.round(larguraAmbiente * comprimentoAmbiente * 100) / 100
      },
      calculo: {
        largura: calculoLargura,
        comprimento: calculoComprimento
      },
      totalPlacas: totalPlacas,
      detalhamento: {
        placasInteiras: placasInteiras,
        placasComRecorte: placasComRecorte
      },
      recortes: recortes,
      observacoes: this.gerarObservacoes(calculoLargura, calculoComprimento, recortes)
    }
  }

  // Getters
  get nomeCalculator(): string {
    return this.nome
  }

  get dimensoesPlaca(): DimensoesPlaca {
    return this.dimensoes
  }

  get codigoPlaca(): string {
    return this.codigo
  }
}