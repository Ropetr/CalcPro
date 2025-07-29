import { CantoneiraInfo, ParedeProjeto, ResultadoCantoneira, ResultadoCantoneiras } from './types'

// Definição das cantoneiras disponíveis
export const CANTONEIRAS: Record<string, CantoneiraInfo> = {
  '300': { tamanho: 3.00, codigo: '300', nome: 'Cantoneira 3,00m' }
}

/**
 * Calculadora de cantoneiras com lógica otimizada
 * Regra: cada barra cortada pode ter no máximo 2 usos
 */
export class CantoneiraCalculator {
  
  /**
   * Calcula cantoneiras para múltiplos ambientes com otimização global
   */
  calcularMultiplosAmbientes(
    ambientes: Array<{
      largura: number
      comprimento: number
      nome: string
    }>
  ): ResultadoCantoneiras {
    
    // Coletar todas as paredes necessárias
    const paredes: ParedeProjeto[] = []
    
    ambientes.forEach(ambiente => {
      // 2 paredes de largura + 2 paredes de comprimento por ambiente
      paredes.push(
        { medida: ambiente.largura, ambiente: ambiente.nome, tipo: 'largura' },
        { medida: ambiente.largura, ambiente: ambiente.nome, tipo: 'largura' },
        { medida: ambiente.comprimento, ambiente: ambiente.nome, tipo: 'comprimento' },
        { medida: ambiente.comprimento, ambiente: ambiente.nome, tipo: 'comprimento' }
      )
    })
    
    // Calcular com otimização
    const resultado = this.calcularCantoneiras(paredes, CANTONEIRAS['300'].tamanho)
    
    return {
      cantoneira300: resultado,
      resumo: {
        totalBarras300: resultado.total
      }
    }
  }
  
  /**
   * Calcula cantoneiras com otimização de aproveitamento
   * Sequência: 1º paredes > 3m, 2º paredes ordenadas maior→menor
   */
  private calcularCantoneiras(
    paredes: ParedeProjeto[], 
    tamanhoCantoneira: number
  ): ResultadoCantoneira {
    
    // 1. SEPARAR PAREDES > 3,00m E PAREDES ≤ 3,00m
    const paredesMaiores: Array<{medida: number, parede: string}> = []
    const paredesMenores: Array<{medida: number, parede: string}> = []
    
    paredes.forEach((parede, index) => {
      const identificacao = `${parede.ambiente} - ${parede.tipo} ${Math.floor(index/4)+1}`
      
      if (parede.medida > tamanhoCantoneira) {
        paredesMaiores.push({
          medida: parede.medida,
          parede: identificacao
        })
      } else {
        paredesMenores.push({
          medida: parede.medida,
          parede: identificacao
        })
      }
    })
    
    // 2. PROCESSAR PAREDES > 3,00m PRIMEIRO
    let totalInteiras = 0
    const recortesNecessarios: Array<{medida: number, parede: string}> = []
    
    paredesMaiores.forEach(parede => {
      // Cada parede > 3m precisa de cantoneiras inteiras + recorte
      const cantoneirasPorParede = Math.floor(parede.medida / tamanhoCantoneira)
      totalInteiras += cantoneirasPorParede
      
      // Calcular recorte necessário
      const recorte = parede.medida - (cantoneirasPorParede * tamanhoCantoneira)
      if (recorte > 0.01) {
        recortesNecessarios.push({
          medida: recorte,
          parede: `${parede.parede} (resto)`
        })
      }
    })
    
    // 3. ORDENAR PAREDES ≤ 3,00m DA MAIOR PARA MENOR
    paredesMenores.sort((a, b) => b.medida - a.medida)
    
    // 4. PROCESSAR PAREDES ≤ 3,00m
    paredesMenores.forEach(parede => {
      if (parede.medida === tamanhoCantoneira) {
        // Usa cantoneira inteira exata
        totalInteiras++
      } else {
        // Adiciona aos recortes para otimização
        recortesNecessarios.push({
          medida: parede.medida,
          parede: parede.parede
        })
      }
    })
    
    // 5. OTIMIZAR RECORTES (máximo 2 usos por barra)
    const aproveitamento: Array<{
      barra: number
      uso1: {
        medida: number
        parede: string
      }
      uso2?: {
        medida: number
        parede: string
      }
      sobra?: number
    }> = []
    
    let barrasParaRecortes = 0
    let recortesRestantes = [...recortesNecessarios]
    const totalRecortes = recortesNecessarios.length
    
    while (recortesRestantes.length > 0) {
      barrasParaRecortes++
      const recorte1 = recortesRestantes.shift()!
      
      const aproveitamentoBarra: any = {
        barra: barrasParaRecortes,
        uso1: {
          medida: recorte1.medida,
          parede: recorte1.parede
        }
      }
      
      // Verificar se sobra comporta outro recorte
      const sobra = tamanhoCantoneira - recorte1.medida
      
      if (sobra > 0.01 && recortesRestantes.length > 0) {
        // Buscar recorte que caiba na sobra
        const indiceRecorteQueCabe = recortesRestantes.findIndex(r => r.medida <= sobra)
        
        if (indiceRecorteQueCabe >= 0) {
          const recorte2 = recortesRestantes.splice(indiceRecorteQueCabe, 1)[0]
          aproveitamentoBarra.uso2 = {
            medida: recorte2.medida,
            parede: recorte2.parede
          }
          aproveitamentoBarra.sobra = sobra - recorte2.medida
        } else {
          aproveitamentoBarra.sobra = sobra
        }
      } else {
        aproveitamentoBarra.sobra = sobra
      }
      
      aproveitamento.push(aproveitamentoBarra)
    }
    
    return {
      inteiras: totalInteiras,
      recortes: totalRecortes,
      total: totalInteiras + barrasParaRecortes,
      detalhamento: {
        barrasInteiras: totalInteiras,
        barrasParaRecortes: barrasParaRecortes,
        aproveitamento: aproveitamento
      }
    }
  }
}

// Instância única para uso
export const cantoneiraCalculator = new CantoneiraCalculator()