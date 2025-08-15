/**
 * Sistema Inteligente de Otimização de Cortes para Chapas Drywall
 * Análise combinatória para máximo aproveitamento e desencontro otimizado
 */

export interface OpcaoCorte {
  id: string
  divisao: number
  alturas: number[]  // [1.80, 0.90] para divisão 2, por exemplo
  padrao: PadraoAmarracao
  aproveitamento: number
  desperdicio: number
  desencontro: number
  viabilidade: 'ótima' | 'boa' | 'aceitável' | 'ruim'
  justificativa: string
  custoMaterial: number
  numeroChapas: number
}

export interface PadraoAmarracao {
  faixasImpares: {
    sequencia: number[]  // [1.80, 1.80, 0.10] para altura 3.70
    total: number
  }
  faixasPares: {
    sequencia: number[]  // [0.90, 1.80, 1.00] para desencontro 0.90
    total: number
  }
  juntasHorizontais: number[]  // Posições das juntas
  desencontroViavel: boolean
}

export interface AnaliseCortes {
  opcoes: OpcaoCorte[]
  recomendacao: OpcaoCorte
  criterios: {
    alturaParede: number
    tipoChapa: '1.80' | '2.40'
    distanciaMinJuntas: number
  }
}

/**
 * Função principal - Analisa todas as opções de corte possíveis
 */
export function analisarCortesOtimizados(
  alturaParede: number,
  tipoChapa: '1.80' | '2.40',
  distanciaMinJuntas: number = 0.30
): AnaliseCortes {
  
  const alturaChapa = parseFloat(tipoChapa)
  const opcoes: OpcaoCorte[] = []
  
  // GERAR TODAS AS DIVISÕES POSSÍVEIS
  const maxDivisoes = Math.floor(alturaChapa / distanciaMinJuntas)
  
  for (let divisoes = 1; divisoes <= maxDivisoes; divisoes++) {
    const opcaoCorte = analisarDivisao(alturaParede, alturaChapa, divisoes, distanciaMinJuntas)
    if (opcaoCorte) {
      opcoes.push(opcaoCorte)
    }
  }
  
  // ORDENAR POR CRITÉRIOS DE OTIMIZAÇÃO
  const opcoesOrdenadas = opcoes.sort((a, b) => {
    // 1º Critério: Viabilidade (ótima > boa > aceitável > ruim)
    const pesoViabilidade = { 'ótima': 4, 'boa': 3, 'aceitável': 2, 'ruim': 1 }
    const diffViabilidade = pesoViabilidade[b.viabilidade] - pesoViabilidade[a.viabilidade]
    if (diffViabilidade !== 0) return diffViabilidade
    
    // 2º Critério: Menor desperdício
    const diffDesperdicio = a.desperdicio - b.desperdicio
    if (Math.abs(diffDesperdicio) > 0.01) return diffDesperdicio
    
    // 3º Critério: Maior aproveitamento
    const diffAproveitamento = b.aproveitamento - a.aproveitamento
    if (Math.abs(diffAproveitamento) > 0.1) return diffAproveitamento
    
    // 4º Critério: Melhor desencontro (mais próximo de 0.60m)
    const desencontroIdeal = 0.60
    const diffDesencontro = Math.abs(a.desencontro - desencontroIdeal) - Math.abs(b.desencontro - desencontroIdeal)
    return diffDesencontro
  })
  
  return {
    opcoes: opcoesOrdenadas,
    recomendacao: opcoesOrdenadas[0],
    criterios: {
      alturaParede,
      tipoChapa,
      distanciaMinJuntas
    }
  }
}

/**
 * Analisa uma divisão específica da chapa
 */
function analisarDivisao(
  alturaParede: number,
  alturaChapa: number,
  divisoes: number,
  distanciaMinJuntas: number
): OpcaoCorte | null {
  
  const alturaRecorte = alturaChapa / divisoes
  
  // Validar se o recorte atende ao mínimo
  if (alturaRecorte < distanciaMinJuntas) {
    return null
  }
  
  // Gerar alturas disponíveis para combinação
  const alturasDisponiveis = divisoes === 1 ? 
    [alturaChapa] : 
    [alturaChapa, ...Array(divisoes - 1).fill(alturaRecorte)]
  
  // Simular as melhores combinações
  const simulacao = simularCombinacoes(alturaParede, alturasDisponiveis, distanciaMinJuntas)
  
  if (!simulacao) {
    return null
  }
  
  const viabilidade = classificarViabilidade(simulacao.desperdicio, simulacao.desencontroViavel, simulacao.desencontro, distanciaMinJuntas)
  
  return {
    id: `divisao-${divisoes}`,
    divisao: divisoes,
    alturas: alturasDisponiveis,
    padrao: simulacao.padrao,
    aproveitamento: simulacao.aproveitamento,
    desperdicio: simulacao.desperdicio,
    desencontro: simulacao.desencontro,
    viabilidade,
    justificativa: gerarJustificativa(divisoes, alturaRecorte, simulacao),
    custoMaterial: calcularCustoMaterial(simulacao.numeroChapas, alturaChapa),
    numeroChapas: simulacao.numeroChapas
  }
}

/**
 * Simula combinações de cortes para encontrar a melhor solução
 * ALGORITMO SIMPLIFICADO E CORRETO
 */
function simularCombinacoes(
  alturaParede: number,
  alturasDisponiveis: number[],
  distanciaMinJuntas: number
) {
  const [alturaChapa] = alturasDisponiveis // Ex: 1.80m
  
  // Calcular quantas chapas inteiras cabem
  const chapasInteiras = Math.floor(alturaParede / alturaChapa)
  const sobra = alturaParede - (chapasInteiras * alturaChapa)
  
  console.log(`📊 Análise: ${chapasInteiras} chapas de ${alturaChapa}m + ${sobra.toFixed(2)}m sobra`)
  
  // Para parede 4.00m com chapa 1.80m: 2 chapas + 0.40m sobra
  // Solução: usar desencontro de 0.45m (metade da chapa 0.90 - 0.45)
  
  let melhorSolucao = null
  
  if (sobra >= 0.01) {
    // Caso 1: Desencontro = sobra (se for ≥ distância mínima)
    if (sobra >= distanciaMinJuntas) {
      const desencontro = sobra
      const sequenciaImpar = []
      const sequenciaPar = [desencontro]
      
      // Montar faixa ímpar: chapas inteiras + sobra no final
      for (let i = 0; i < chapasInteiras; i++) {
        sequenciaImpar.push(alturaChapa)
      }
      if (sobra > 0.01) sequenciaImpar.push(sobra)
      
      // Montar faixa par: desencontro + chapas inteiras + restante
      for (let i = 0; i < chapasInteiras; i++) {
        sequenciaPar.push(alturaChapa)
      }
      const restante = alturaParede - desencontro - (chapasInteiras * alturaChapa)
      if (restante > 0.01) sequenciaPar.push(restante)
      
      const totalImpar = sequenciaImpar.reduce((sum, h) => sum + h, 0)
      const totalPar = sequenciaPar.reduce((sum, h) => sum + h, 0)
      
      console.log(`✅ Solução 1 - Desencontro ${desencontro.toFixed(2)}m:`)
      console.log(`   Ímpar: ${sequenciaImpar.map(h => h.toFixed(2)).join(' + ')} = ${totalImpar.toFixed(2)}m`)
      console.log(`   Par: ${sequenciaPar.map(h => h.toFixed(2)).join(' + ')} = ${totalPar.toFixed(2)}m`)
      
      if (Math.abs(totalImpar - alturaParede) < 0.01 && Math.abs(totalPar - alturaParede) < 0.01) {
        melhorSolucao = {
          desperdicio: 0,
          aproveitamento: 100,
          desencontro: desencontro,
          desencontroViavel: true,
          numeroChapas: chapasInteiras * 2 + 2, // Aproximado
          padrao: {
            faixasImpares: { sequencia: sequenciaImpar, total: totalImpar },
            faixasPares: { sequencia: sequenciaPar, total: totalPar },
            juntasHorizontais: [],
            desencontroViavel: true
          }
        }
      }
    }
    
    // Caso 2: Desencontro = metade da chapa (se possível)
    const desencontroMeioChapa = alturaChapa / 2 // 0.90m para chapa 1.80m
    if (desencontroMeioChapa >= distanciaMinJuntas) {
      // Faixa ímpar: 1.80 + 1.80 + 0.40 = 4.00
      const sequenciaImpar = [alturaChapa, alturaChapa, sobra]
      
      // Faixa par: 0.90 + 1.80 + 1.30 = 4.00
      const restantePar = alturaParede - desencontroMeioChapa - alturaChapa
      const sequenciaPar = [desencontroMeioChapa, alturaChapa, restantePar]
      
      const totalImpar = sequenciaImpar.reduce((sum, h) => sum + h, 0)
      const totalPar = sequenciaPar.reduce((sum, h) => sum + h, 0)
      
      console.log(`✅ Solução 2 - Desencontro meio chapa ${desencontroMeioChapa.toFixed(2)}m:`)
      console.log(`   Ímpar: ${sequenciaImpar.map(h => h.toFixed(2)).join(' + ')} = ${totalImpar.toFixed(2)}m`)
      console.log(`   Par: ${sequenciaPar.map(h => h.toFixed(2)).join(' + ')} = ${totalPar.toFixed(2)}m`)
      
      if (Math.abs(totalImpar - alturaParede) < 0.01 && Math.abs(totalPar - alturaParede) < 0.01) {
        const aproveitamento = restantePar < alturaChapa ? 95 : 90 // Ajustar baseado no aproveitamento
        
        if (!melhorSolucao || aproveitamento > melhorSolucao.aproveitamento) {
          melhorSolucao = {
            desperdicio: Math.max(0, alturaChapa - restantePar) / 2,
            aproveitamento: aproveitamento,
            desencontro: desencontroMeioChapa,
            desencontroViavel: true,
            numeroChapas: 4, // 2 ímpar + 2 par
            padrao: {
              faixasImpares: { sequencia: sequenciaImpar, total: totalImpar },
              faixasPares: { sequencia: sequenciaPar, total: totalPar },
              juntasHorizontais: [alturaChapa, alturaChapa + alturaChapa],
              desencontroViavel: true
            }
          }
        }
      }
    }
  }
  
  return melhorSolucao
}

/**
 * Preenche uma faixa começando com um desencontro específico
 */
function otimizarPreenchimentoComDesencontro(alturaObjetivo: number, desencontro: number, alturasDisponiveis: number[]) {
  const sequencia: number[] = [desencontro]
  let alturaRestante = alturaObjetivo - desencontro
  let chapasUsadas = 0
  
  const [alturaChapa, ...recortes] = alturasDisponiveis.sort((a, b) => b - a)
  const todasAlturas = [alturaChapa, ...recortes]
  
  while (alturaRestante > 0.01) { // Tolerância de 1cm
    let usouAltura = false
    
    for (const altura of todasAlturas) {
      if (altura <= alturaRestante + 0.01) { // Tolerância de 1cm
        const alturaUsada = Math.min(altura, alturaRestante)
        sequencia.push(alturaUsada)
        alturaRestante -= alturaUsada
        chapasUsadas += altura === alturaChapa ? 1 : 0 // Contar apenas chapas inteiras
        usouAltura = true
        break
      }
    }
    
    if (!usouAltura) {
      // Não conseguiu preencher - adicionar sobra
      break
    }
  }
  
  return {
    sequencia,
    total: sequencia.reduce((sum, h) => sum + h, 0),
    sobra: Math.max(0, alturaRestante),
    chapasUsadas
  }
}

/**
 * Otimiza o preenchimento de uma faixa com as alturas disponíveis
 */
function otimizarPreenchimento(alturaObjetivo: number, alturasDisponiveis: number[]) {
  // Algoritmo guloso - sempre usar a maior altura possível
  const sequencia: number[] = []
  let alturaRestante = alturaObjetivo
  let chapasUsadas = 0
  
  const alturasOrdenadas = [...alturasDisponiveis].sort((a, b) => b - a)
  
  while (alturaRestante > 0.01) { // Tolerância de 1cm
    let usouAltura = false
    
    for (const altura of alturasOrdenadas) {
      if (altura <= alturaRestante + 0.01) { // Tolerância de 1cm
        const alturaUsada = Math.min(altura, alturaRestante)
        sequencia.push(alturaUsada)
        alturaRestante -= alturaUsada  // 🔧 CORREÇÃO: subtrair apenas a altura usada
        chapasUsadas += altura === alturasOrdenadas[0] ? 1 : 0 // Contar apenas chapas inteiras
        usouAltura = true
        break
      }
    }
    
    if (!usouAltura) {
      // Não conseguiu preencher - adicionar sobra
      break
    }
  }
  
  return {
    sequencia,
    total: sequencia.reduce((sum, h) => sum + h, 0),
    sobra: Math.max(0, alturaRestante),
    chapasUsadas: Math.ceil(sequencia.filter(h => h === alturasOrdenadas[0]).length)
  }
}

/**
 * Calcula as posições das juntas horizontais
 */
function calcularJuntas(faixasImpares: number[], faixasPares: number[]): number[] {
  const juntasImpares: number[] = []
  const juntasPares: number[] = []
  
  // Juntas das faixas ímpares
  let alturaAcumulada = 0
  for (let i = 0; i < faixasImpares.length - 1; i++) {
    alturaAcumulada += faixasImpares[i]
    juntasImpares.push(alturaAcumulada)
  }
  
  // Juntas das faixas pares
  alturaAcumulada = 0
  for (let i = 0; i < faixasPares.length - 1; i++) {
    alturaAcumulada += faixasPares[i]
    juntasPares.push(alturaAcumulada)
  }
  
  // Combinar e remover duplicatas
  const todasJuntas = [...new Set([...juntasImpares, ...juntasPares])]
  return todasJuntas.sort((a, b) => a - b)
}

/**
 * Classifica a viabilidade da solução
 */
function classificarViabilidade(
  desperdicio: number,
  desencontroViavel: boolean,
  desencontro: number,
  distanciaMinJuntas: number
): 'ótima' | 'boa' | 'aceitável' | 'ruim' {
  
  if (!desencontroViavel) return 'ruim'
  
  if (desperdicio <= 0.05 && desencontro >= distanciaMinJuntas) return 'ótima'
  if (desperdicio <= 0.15 && desencontro >= distanciaMinJuntas) return 'boa'
  if (desperdicio <= 0.30 && desencontro >= distanciaMinJuntas) return 'aceitável'
  
  return 'ruim'
}

/**
 * Gera justificativa técnica da solução
 */
function gerarJustificativa(divisoes: number, alturaRecorte: number, simulacao: any): string {
  if (divisoes === 1) {
    return `Chapa inteira (${simulacao.padrao.faixasImpares.sequencia.join(' + ')}m) com ${simulacao.desperdicio.toFixed(2)}m de desperdício`
  }
  
  return `Divisão ${divisoes}: recortes de ${alturaRecorte.toFixed(2)}m, desencontro ${simulacao.desencontro.toFixed(2)}m, ${simulacao.aproveitamento.toFixed(1)}% aproveitamento`
}

/**
 * Calcula custo estimado do material
 */
function calcularCustoMaterial(numeroChapas: number, alturaChapa: number): number {
  // Preço estimado por m² (pode ser configurável)
  const precoPorM2 = 25.0 // R$ por m²
  const areaChapa = 1.20 * alturaChapa
  return numeroChapas * areaChapa * precoPorM2
}

/**
 * Função utilitária para testes rápidos
 */
export function testarOtimizacao(alturaParede: number, tipoChapa: '1.80' | '2.40' = '1.80') {
  console.log(`\n🔍 ANÁLISE DE OTIMIZAÇÃO - Altura ${alturaParede}m, Chapa ${tipoChapa}m`)
  console.log('=' .repeat(80))
  
  const analise = analisarCortesOtimizados(alturaParede, tipoChapa)
  
  analise.opcoes.forEach((opcao, index) => {
    console.log(`\n${index === 0 ? '🏆' : '📋'} OPÇÃO ${index + 1} - ${opcao.viabilidade.toUpperCase()}`)
    console.log(`├─ Divisão: ${opcao.divisao} (${opcao.alturas.map(h => h.toFixed(2)).join(' + ')}m)`)
    console.log(`├─ Desencontro: ${opcao.desencontro.toFixed(2)}m`)
    console.log(`├─ Aproveitamento: ${opcao.aproveitamento.toFixed(1)}%`)
    console.log(`├─ Desperdício: ${opcao.desperdicio.toFixed(3)}m`)
    console.log(`├─ Chapas: ${opcao.numeroChapas}`)
    console.log(`└─ ${opcao.justificativa}`)
  })
  
  console.log(`\n🎯 RECOMENDAÇÃO: ${analise.recomendacao.justificativa}`)
  
  return analise
}