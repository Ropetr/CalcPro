// Algoritmos de otimização para Forro PVC
// Baseado no código original da calculadora CalcPro/CalcPro/

import { SolucaoCorte, SobraAproveitavel, ReguaDisponivel } from './types'

// Réguas disponíveis no mercado
export const REGUAS_DISPONIVEIS: number[] = [3, 4, 5, 6]
export const BARRA_RODAFORRO = 6 // metros

/**
 * Otimização de cortes para réguas de forro PVC
 * Implementa 3 níveis de otimização:
 * 1. Corte simples (sem emenda)
 * 2. Combinação recursiva 
 * 3. Emenda (quando necessário)
 */
export function otimizarCorteReguas(
  comprimentoNecessario: number,
  reguasDisponiveis: number[] = REGUAS_DISPONIVEIS
): SolucaoCorte | null {
  const solucoes: SolucaoCorte[] = []

  // 1. NÍVEL 1: Corte simples (régua única)
  reguasDisponiveis.forEach(regua => {
    if (regua >= comprimentoNecessario - 0.01) {
      const desperdicio = regua - comprimentoNecessario
      solucoes.push({
        tipo: 'simples',
        reguas: [{ comprimento: regua, quantidade: 1 }],
        desperdicioTotal: desperdicio,
        totalReguas: 1,
        descricao: `1 régua de ${regua}m`,
        temEmenda: false
      })
    }
  })

  // 2. NÍVEL 2: Combinações recursivas (múltiplas réguas)
  const gerarCombinacoesRecursivas = (
    restante: number, 
    combinacaoAtual: Array<{ comprimento: number; quantidade: number }>, 
    profundidade: number = 0
  ) => {
    if (profundidade > 10) return // Evitar recursão infinita
    
    if (Math.abs(restante) <= 0.01) {
      const desperdicioTotal = 0
      const totalReguas = combinacaoAtual.reduce((sum, r) => sum + r.quantidade, 0)
      
      solucoes.push({
        tipo: 'combinacao',
        reguas: [...combinacaoAtual],
        desperdicioTotal,
        totalReguas,
        descricao: combinacaoAtual
          .map(r => `${r.quantidade} régua(s) de ${r.comprimento}m`)
          .join(' + '),
        temEmenda: false
      })
      return
    }

    reguasDisponiveis.forEach(regua => {
      if (regua <= restante + 0.01) {
        const novaCombinacao = [...combinacaoAtual]
        const existente = novaCombinacao.find(r => r.comprimento === regua)
        
        if (existente) {
          existente.quantidade++
        } else {
          novaCombinacao.push({ comprimento: regua, quantidade: 1 })
        }
        
        gerarCombinacoesRecursivas(restante - regua, novaCombinacao, profundidade + 1)
      }
    })
  }

  gerarCombinacoesRecursivas(comprimentoNecessario, [])

  // 3. NÍVEL 3: Emendas (quando não há solução perfeita)
  if (solucoes.length === 0) {
    // Encontrar a melhor combinação com emenda
    const melhorEmenda = encontrarMelhorEmenda(comprimentoNecessario, reguasDisponiveis)
    if (melhorEmenda) {
      solucoes.push(melhorEmenda)
    }
  }

  // Ordenar soluções por qualidade
  solucoes.sort((a, b) => {
    // Prioridade: menor desperdício, depois menor número de réguas
    if (Math.abs(a.desperdicioTotal - b.desperdicioTotal) > 0.01) {
      return a.desperdicioTotal - b.desperdicioTotal
    }
    return a.totalReguas - b.totalReguas
  })

  return solucoes[0] || null
}

/**
 * Encontra a melhor solução com emenda
 */
function encontrarMelhorEmenda(
  comprimentoNecessario: number,
  reguasDisponiveis: number[]
): SolucaoCorte | null {
  const solucoesEmenda: SolucaoCorte[] = []
  
  // Tentar combinações de 2 réguas menores
  for (let i = 0; i < reguasDisponiveis.length; i++) {
    for (let j = i; j < reguasDisponiveis.length; j++) {
      const regua1 = reguasDisponiveis[i]
      const regua2 = reguasDisponiveis[j]
      const comprimentoTotal = regua1 + regua2
      
      if (comprimentoTotal >= comprimentoNecessario - 0.01) {
        const desperdicio = comprimentoTotal - comprimentoNecessario
        const reguas = regua1 === regua2 
          ? [{ comprimento: regua1, quantidade: 2 }]
          : [
              { comprimento: regua1, quantidade: 1 },
              { comprimento: regua2, quantidade: 1 }
            ]
        
        solucoesEmenda.push({
          tipo: 'emenda',
          reguas,
          desperdicioTotal: desperdicio,
          totalReguas: 2,
          descricao: `Emenda: ${regua1}m + ${regua2}m`,
          temEmenda: true
        })
      }
    }
  }

  // Retornar a melhor solução com emenda
  solucoesEmenda.sort((a, b) => {
    if (Math.abs(a.desperdicioTotal - b.desperdicioTotal) > 0.01) {
      return a.desperdicioTotal - b.desperdicioTotal
    }
    return a.totalReguas - b.totalReguas
  })

  return solucoesEmenda[0] || null
}

/**
 * Calcula rodaforro otimizado com aproveitamento de sobras
 */
export interface ResultadoRodaforro {
  barrasNovas: number
  sobraTotal: number
  instrucoesCorte: string[]
  sobrasGeradas: SobraAproveitavel[]
}

export function calcularRodaforroOtimizado(
  medidasNecessarias: number[],
  nomeAmbiente: string,
  sobrasAnteriores: SobraAproveitavel[] = []
): ResultadoRodaforro {
  const comprimentoBarra = BARRA_RODAFORRO
  
  // Separar medidas grandes (>6m) em partes
  const medidasProcessadas: number[] = []
  medidasNecessarias.forEach(medida => {
    if (medida > comprimentoBarra) {
      const barrasInteiras = Math.floor(medida / comprimentoBarra)
      const restante = medida - (barrasInteiras * comprimentoBarra)
      
      // Adicionar barras inteiras
      for (let i = 0; i < barrasInteiras; i++) {
        medidasProcessadas.push(comprimentoBarra)
      }
      
      // Adicionar restante se houver
      if (restante > 0.01) {
        medidasProcessadas.push(restante)
      }
    } else {
      medidasProcessadas.push(medida)
    }
  })

  // Agrupar medidas iguais
  const medidasAgrupadas = new Map<number, number>()
  medidasProcessadas.forEach(medida => {
    const key = Math.round(medida * 100) / 100 // Arredondar para 2 casas
    medidasAgrupadas.set(key, (medidasAgrupadas.get(key) || 0) + 1)
  })

  // Converter para array ordenado (maior para menor)
  const medidas = Array.from(medidasAgrupadas.entries())
    .map(([comprimento, quantidade]) => ({ comprimento, quantidade }))
    .sort((a, b) => b.comprimento - a.comprimento)

  // Primeiro: tentar usar sobras anteriores
  const pecasAproveitadas: Array<{medida: number, quantidade: number, origem: string}> = []
  const sobrasUsadas: number[] = []
  const sobrasRestantes = [...sobrasAnteriores]
  let comprimentoAproveitado = 0

  medidas.forEach(medida => {
    for (let i = 0; i < sobrasRestantes.length && medida.quantidade > 0; i++) {
      const sobra = sobrasRestantes[i]
      
      const pecasNaSobra = Math.floor(sobra.comprimento / medida.comprimento)
      
      if (pecasNaSobra > 0) {
        const pecasUsadas = Math.min(pecasNaSobra, medida.quantidade)
        medida.quantidade -= pecasUsadas
        
        pecasAproveitadas.push({
          medida: medida.comprimento,
          quantidade: pecasUsadas,
          origem: sobra.origem
        })
        
        const comprimentoUsado = pecasUsadas * medida.comprimento
        comprimentoAproveitado += comprimentoUsado
        sobra.comprimento -= comprimentoUsado
        
        if (sobra.comprimento <= 0.10) {
          sobrasUsadas.push(i)
        }
      }
    }
  })

  // Remover sobras totalmente usadas
  sobrasUsadas.sort((a, b) => b - a).forEach(index => {
    sobrasRestantes.splice(index, 1)
  })

  // Cortar barras novas para peças restantes
  let barrasNovas = 0
  let sobraTotal = 0
  const instrucoesCorte: string[] = []
  const sobrasGeradas: SobraAproveitavel[] = []

  const medidasRestantes = medidas.filter(m => m.quantidade > 0)

  while (medidasRestantes.some(m => m.quantidade > 0)) {
    const cortesDestaBarra: number[] = []
    let comprimentoRestante = comprimentoBarra
    
    // Algoritmo First-Fit Decreasing
    for (let i = 0; i < medidasRestantes.length; i++) {
      const medida = medidasRestantes[i]
      
      while (medida.quantidade > 0 && medida.comprimento <= comprimentoRestante + 0.01) {
        cortesDestaBarra.push(medida.comprimento)
        medida.quantidade--
        comprimentoRestante -= medida.comprimento
      }
    }

    if (cortesDestaBarra.length > 0) {
      barrasNovas++
      const sobra = comprimentoRestante
      sobraTotal += sobra
      
      // Agrupar cortes iguais para instrução
      const cortesAgrupados = new Map<number, number>()
      cortesDestaBarra.forEach(corte => {
        cortesAgrupados.set(corte, (cortesAgrupados.get(corte) || 0) + 1)
      })

      const descricaoCortes = Array.from(cortesAgrupados.entries())
        .map(([medida, qty]) => qty === 1 ? `${medida.toFixed(2)}m` : `${qty}x${medida.toFixed(2)}m`)
        .join(' + ')

      instrucoesCorte.push(
        `Barra ${barrasNovas}: cortar ${descricaoCortes}${sobra > 0.01 ? ` (sobra: ${sobra.toFixed(2)}m)` : ''}`
      )
      
      // Adicionar sobra aproveitável
      if (sobra > 0.10) {
        sobrasGeradas.push({
          comprimento: sobra,
          origem: nomeAmbiente
        })
      }
    }

    // Limpar medidas zeradas
    for (let i = medidasRestantes.length - 1; i >= 0; i--) {
      if (medidasRestantes[i].quantidade === 0) {
        medidasRestantes.splice(i, 1)
      }
    }
  }

  // Adicionar instruções de aproveitamento no início
  if (pecasAproveitadas.length > 0) {
    const aproveitamentosPorOrigem = new Map<string, Array<{medida: number, quantidade: number}>>()
    pecasAproveitadas.forEach(peca => {
      if (!aproveitamentosPorOrigem.has(peca.origem)) {
        aproveitamentosPorOrigem.set(peca.origem, [])
      }
      aproveitamentosPorOrigem.get(peca.origem)!.push(peca)
    })
    
    const instrucoesAproveitamento: string[] = []
    aproveitamentosPorOrigem.forEach((pecas, origem) => {
      const pecasTexto = pecas
        .map(p => p.quantidade === 1 ? `${p.medida.toFixed(2)}m` : `${p.quantidade}x${p.medida.toFixed(2)}m`)
        .join(' + ')
      instrucoesAproveitamento.push(`Aproveitar ${pecasTexto} da sobra do ${origem}`)
    })
    
    instrucoesCorte.unshift(...instrucoesAproveitamento)
  }

  return {
    barrasNovas,
    sobraTotal,
    instrucoesCorte,
    sobrasGeradas: [...sobrasRestantes, ...sobrasGeradas]
  }
}