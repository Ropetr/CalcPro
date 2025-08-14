import { 
  MedidaPisoWall, 
  EspecificacaoPainel, 
  ResultadoCalculo, 
  PlanoCorte,
  ESPECIFICACOES_PAINEIS,
  MaterialItem 
} from './types'
import { EngineAnalitico, MedidaAmbiente, PlanoCorteAmbiente } from '@/lib/ui-standards/aproveitamento/analitico'
import { MaterialPadrao, ConfigAproveitamento } from '@/lib/ui-standards/aproveitamento'

/**
 * Otimiza o corte dos painéis para aproveitar ao máximo o material
 */
export function otimizarCorte(medidas: MedidaPisoWall[], especificacao: EspecificacaoPainel): PlanoCorte {
  const painelLargura = especificacao.largura / 1000 // converter para metros
  const painelComprimento = especificacao.comprimento / 1000 // converter para metros
  const areaPainel = painelLargura * painelComprimento
  
  const posicoes = []
  let x = 0, y = 0
  let aproveitamento = 0
  
  for (const medida of medidas) {
    // Verificar se cabe no painel atual
    if (medida.largura <= painelLargura && medida.comprimento <= painelComprimento) {
      posicoes.push({
        x,
        y,
        largura: medida.largura,
        comprimento: medida.comprimento,
        rotacionado: false
      })
      aproveitamento += medida.area
    } else if (medida.comprimento <= painelLargura && medida.largura <= painelComprimento) {
      // Tentar rotacionado
      posicoes.push({
        x,
        y,
        largura: medida.comprimento,
        comprimento: medida.largura,
        rotacionado: true
      })
      aproveitamento += medida.area
    }
  }
  
  return {
    painel: especificacao,
    posicoes,
    aproveitamento: (aproveitamento / areaPainel) * 100,
    sobras: [] // Implementar lógica de sobras se necessário
  }
}

/**
 * Calcula o número de apoios necessários
 */
export function calcularApoios(medidas: MedidaPisoWall[]): { total: number; porPainel: number } {
  const areaTotal = medidas.reduce((total, medida) => total + medida.area, 0)
  
  // Calcular número de painéis necessários (considerando aproveitamento)
  const especificacaoPadrao = ESPECIFICACOES_PAINEIS[1] // PW40-2500 como padrão
  const areaPainel = (especificacaoPadrao.largura / 1000) * (especificacaoPadrao.comprimento / 1000)
  const numPaineis = Math.ceil(areaTotal / areaPainel)
  
  // Apoios por painel conforme especificação
  const apoiosPorPainel = especificacaoPadrao.apoios
  const totalApoios = numPaineis * apoiosPorPainel
  
  return {
    total: totalApoios,
    porPainel: apoiosPorPainel
  }
}

/**
 * Calcula materiais de fixação (parafusos específicos por painel)
 */
export function calcularFixacao(medidas: MedidaPisoWall[]): MaterialItem[] {
  // Agrupar por especificação para calcular parafusos corretos
  const agrupados = medidas.reduce((acc, medida) => {
    const key = medida.especificacao.codigo
    if (!acc[key]) {
      acc[key] = {
        especificacao: medida.especificacao,
        quantidade: 0,
        area: 0
      }
    }
    
    // Calcular quantos painéis completos necessários
    const areaPainel = (medida.especificacao.largura / 1000) * (medida.especificacao.comprimento / 1000)
    const paineisNecessarios = Math.ceil(medida.area / areaPainel)
    
    acc[key].quantidade += paineisNecessarios
    acc[key].area += medida.area
    
    return acc
  }, {} as Record<string, { especificacao: EspecificacaoPainel; quantidade: number; area: number }>)
  
  const materiais: MaterialItem[] = []
  let totalParafusos = 0
  
  // Calcular parafusos por tipo de painel
  Object.values(agrupados).forEach(grupo => {
    const parafusosPorGrupo = grupo.quantidade * grupo.especificacao.parafusosPorPainel
    totalParafusos += parafusosPorGrupo
    
    materiais.push({
      item: `Parafusos para ${grupo.especificacao.descricao}`,
      descricao: `${grupo.especificacao.parafusosPorPainel} parafusos por painel`,
      quantidade: parafusosPorGrupo,
      unidade: 'un',
      observacoes: `${grupo.quantidade} painéis × ${grupo.especificacao.parafusosPorPainel} parafusos`
    })
  })
  
  // Buchas: mesmo número total de parafusos
  materiais.push({
    item: 'Buchas de Fixação',
    descricao: 'Bucha para fixação na base',
    quantidade: totalParafusos,
    unidade: 'un',
    observacoes: 'Uma bucha por parafuso'
  })
  
  return materiais
}

/**
 * Calcula materiais de acabamento
 */
export function calcularAcabamento(medidas: MedidaPisoWall[]): MaterialItem[] {
  // Calcular perímetro total para rodapé/acabamento
  const perimetroTotal = medidas.reduce((total, medida) => {
    return total + ((medida.largura + medida.comprimento) * 2)
  }, 0)
  
  return [
    {
      item: 'Perfil de Acabamento',
      descricao: 'Perfil para acabamento das bordas',
      quantidade: Math.ceil(perimetroTotal),
      unidade: 'm',
      observacoes: 'Para acabamento do perímetro'
    },
    {
      item: 'Massa de Rejunte',
      descricao: 'Massa para acabamento das juntas',
      quantidade: Math.ceil(perimetroTotal / 10),
      unidade: 'kg',
      observacoes: 'Aproximadamente 100g por metro linear'
    }
  ]
}

/**
 * Calcular materiais com aproveitamento inteligente
 */
export function calcularMateriaisComAproveitamento(medidas: MedidaPisoWall[]): ResultadoCalculo & {
  planosCorte: PlanoCorteAmbiente[]
  relatorioAproveitamento: {
    totalMaterialNovo: number
    totalSobrasGeradas: number
    totalSobrasAproveitadas: number
    economiaPercentual: number
  }
} {
  // Converter medidas para formato do engine analítico
  const medidasAmbiente: MedidaAmbiente[] = medidas.map((medida, index) => ({
    id: medida.id,
    ambiente: medida.id || `Ambiente ${index + 1}`,
    largura: medida.largura,
    comprimento: medida.comprimento,
    area: medida.area
  }))

  // Configurar engine para painéis
  const config: ConfigAproveitamento = {
    materialTipo: 'painel',
    aproveitamentoMinimo: {
      largura: 0.30,  // 30cm mínimo
      comprimento: 0.50  // 50cm mínimo  
    },
    permitirRotacao: true,  // painéis podem ser girados
    permitirEmenda: false,  // painéis não aceitam emenda
    prioridadeUso: 'otima'
  }

  // Converter especificações para MaterialPadrao
  const especificacaoUsada = medidas[0]?.especificacao || ESPECIFICACOES_PAINEIS[1] // padrão 40mm
  const materiaisPadrao: MaterialPadrao[] = ESPECIFICACOES_PAINEIS.map(spec => ({
    tipo: 'painel',
    largura: spec.largura / 1000, // converter mm para metros
    comprimento: spec.comprimento / 1000,
    espessura: spec.espessura,
    codigo: spec.codigo,
    descricao: spec.descricao
  }))

  // Criar engine e analisar
  const engine = new EngineAnalitico(config, materiaisPadrao)
  const planosCorte = engine.analisarMedidas(medidasAmbiente)
  const relatorio = engine.gerarRelatorio(planosCorte)

  // Calcular resultado no formato original  
  const resultadoOriginal = calcularMateriais(medidas)

  return {
    ...resultadoOriginal,
    planosCorte,
    relatorioAproveitamento: {
      totalMaterialNovo: relatorio.totalMaterialNovo,
      totalSobrasGeradas: relatorio.totalSobrasGeradas,
      totalSobrasAproveitadas: relatorio.totalSobrasAproveitadas,
      economiaPercentual: relatorio.economiaPercentual
    }
  }
}

/**
 * Função principal para calcular materiais do piso wall (versão original)
 */
export function calcularMateriais(medidas: MedidaPisoWall[]): ResultadoCalculo {
  const areaTotal = medidas.reduce((total, medida) => total + medida.area, 0)
  
  // Agrupar por especificação
  const agrupados = medidas.reduce((acc, medida) => {
    const key = medida.especificacao.codigo
    if (!acc[key]) {
      acc[key] = {
        especificacao: medida.especificacao,
        medidas: [],
        area: 0
      }
    }
    acc[key].medidas.push(medida)
    acc[key].area += medida.area
    return acc
  }, {} as Record<string, { especificacao: EspecificacaoPainel; medidas: MedidaPisoWall[]; area: number }>)
  
  // Calcular painéis por especificação
  const paineis = Object.values(agrupados).map(grupo => {
    const areaPainel = (grupo.especificacao.largura / 1000) * (grupo.especificacao.comprimento / 1000)
    const quantidade = Math.ceil(grupo.area / areaPainel * 1.1) // 10% perda
    
    return {
      especificacao: grupo.especificacao,
      quantidade,
      area: grupo.area
    }
  })
  
  // Calcular apoios
  const apoios = calcularApoios(medidas)
  
  // Materiais
  const materiaisPaineis: MaterialItem[] = paineis.map(p => ({
    item: p.especificacao.descricao,
    descricao: `${p.especificacao.peso}kg - ${p.especificacao.apoios} apoios - ${p.especificacao.parafusosPorPainel} parafusos`,
    quantidade: p.quantidade,
    unidade: 'un',
    observacoes: `Inclui 10% de perda - Carga máxima: ${p.especificacao.cargaMaxima}kg/m²`
  }))
  
  const materiaisApoios: MaterialItem[] = [
    {
      item: 'Apoios Estruturais',
      descricao: 'Apoios nas cabeceiras e centrais dos painéis',
      quantidade: apoios.total,
      unidade: 'un',
      observacoes: `Cabeceiras + apoio central por painel de 1,20m`
    }
  ]
  
  const materiaisFixacao = calcularFixacao(medidas)
  const materiaisAcabamento = calcularAcabamento(medidas)
  
  // Calcular totais para resumo
  const totalChapas = paineis.reduce((total, p) => total + p.quantidade, 0)
  const totalParafusos = materiaisFixacao.reduce((total, item) => 
    item.item.includes('Parafusos') ? total + item.quantidade : total, 0
  )
  const totalAcessorios = materiaisAcabamento.reduce((total, item) => total + item.quantidade, 0)

  return {
    areaTotal,
    paineis,
    apoios,
    resumo: {
      totalChapas,
      totalParafusos,
      totalAcessorios: 0 // Removido acessórios
    },
    materiais: {
      paineis: materiaisPaineis,
      fixacao: materiaisFixacao.filter(item => item.item.includes('Parafusos')) // Apenas parafusos
    }
  }
}

/**
 * Função para validar se as medidas estão dentro dos limites dos painéis
 */
export function validarMedidas(medidas: MedidaPisoWall[]): { valida: boolean; erros: string[] } {
  const erros: string[] = []
  
  medidas.forEach((medida, index) => {
    const especificacao = medida.especificacao
    const maxLargura = especificacao.largura / 1000 // converter para metros
    const maxComprimento = especificacao.comprimento / 1000
    
    if (medida.largura > maxLargura && medida.comprimento > maxComprimento) {
      erros.push(`Medida ${index + 1}: Dimensões excedem o tamanho do painel (${maxLargura}m x ${maxComprimento}m)`)
    }
    
    if (medida.area > (maxLargura * maxComprimento)) {
      erros.push(`Medida ${index + 1}: Área excede a área do painel`)
    }
  })
  
  return {
    valida: erros.length === 0,
    erros
  }
}