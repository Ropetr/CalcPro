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
  protected nome: string
  protected dimensoes: DimensoesPlaca
  protected codigo: string

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
   * Cálculo principal de placas - implementação da lógica fornecida
   */
  calcular(larguraAmbiente: number, comprimentoAmbiente: number): ResultadoCalculoPlacas {
    // Calcular largura e comprimento
    const calculoLargura = this.calcularDimensao(larguraAmbiente, this.dimensoes.largura)
    const calculoComprimento = this.calcularDimensao(comprimentoAmbiente, this.dimensoes.comprimento)

    // Total de placas necessárias
    const totalPlacas = Math.ceil(calculoLargura.quantidade) * Math.ceil(calculoComprimento.quantidade)

    // Análise de recortes e aproveitamento
    const recortes: RecortesPlaca = {
      largura: null,
      comprimento: null,
      canto: null
    }

    // Se houver fração na largura
    if (calculoLargura.fracao > 0) {
      recortes.largura = {
        quantidade: Math.ceil(calculoComprimento.quantidade),
        tamanhoPorPeca: `${calculoLargura.pedacoNecessario}m × ${this.dimensoes.comprimento}m`,
        sobraPorPeca: `${calculoLargura.sobra}m × ${this.dimensoes.comprimento}m`,
        aproveitavel: calculoLargura.sobra >= 0.02 // Mínimo aproveitável
      }
    }

    // Se houver fração no comprimento
    if (calculoComprimento.fracao > 0) {
      recortes.comprimento = {
        quantidade: Math.ceil(calculoLargura.quantidade),
        tamanhoPorPeca: `${this.dimensoes.largura}m × ${calculoComprimento.pedacoNecessario}m`,
        sobraPorPeca: `${this.dimensoes.largura}m × ${calculoComprimento.sobra}m`,
        aproveitavel: calculoComprimento.sobra >= 0.02
      }
    }

    // Canto (interseção dos recortes)
    if (calculoLargura.fracao > 0 && calculoComprimento.fracao > 0) {
      recortes.canto = {
        tamanho: `${calculoLargura.pedacoNecessario}m × ${calculoComprimento.pedacoNecessario}m`
      }
    }

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
        placasInteiras: calculoLargura.inteiras * calculoComprimento.inteiras,
        placasComRecorte: totalPlacas - (calculoLargura.inteiras * calculoComprimento.inteiras)
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