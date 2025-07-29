import { PerfilTInfo, RecorteNecessario, ResultadoPerfil, ResultadoPerfisT } from './types'

// Definição dos perfis T disponíveis
export const PERFIS_T: Record<string, PerfilTInfo> = {
  '312': { tamanho: 3.12, codigo: '312', nome: 'Perfil T 3,12m' },
  '125': { tamanho: 1.25, codigo: '125', nome: 'Perfil T 1,25m' },
  '0625': { tamanho: 0.625, codigo: '0625', nome: 'Perfil T 0,625m' }
}

/**
 * Calculadora de perfis T com lógica otimizada
 * Regra: cada barra cortada pode ter no máximo 2 usos
 */
export class PerfilTCalculator {
  
  /**
   * Calcula a quantidade de um tipo específico de perfil
   */
  private calcularPerfil(
    comprimentosNecessarios: number[], 
    tamanhoPerfilDisponivel: number
  ): ResultadoPerfil {
    
    // 1. CALCULAR PEÇAS INTEIRAS
    let totalInteiras = 0
    const recortesNecessarios: number[] = []
    
    comprimentosNecessarios.forEach(comprimento => {
      const inteirasParaEsteComprimento = Math.floor(comprimento / tamanhoPerfilDisponivel)
      totalInteiras += inteirasParaEsteComprimento
      
      // Verificar se sobrou recorte
      const sobra = comprimento - (inteirasParaEsteComprimento * tamanhoPerfilDisponivel)
      if (sobra > 0.01) { // Considerar tolerância mínima
        recortesNecessarios.push(sobra)
      }
    })
    
    // 2. OTIMIZAR RECORTES (máximo 2 usos por barra)
    const aproveitamento: Array<{
      barra: number
      uso1: number
      uso2?: number
      sobra?: number
    }> = []
    
    let barrasParaRecortes = 0
    let recortesRestantes = [...recortesNecessarios]
    
    while (recortesRestantes.length > 0) {
      barrasParaRecortes++
      const recorte1 = recortesRestantes.shift()!
      
      const aproveitamentoBarra: any = {
        barra: barrasParaRecortes,
        uso1: recorte1
      }
      
      // Verificar se sobra comporta outro recorte
      const sobra = tamanhoPerfilDisponivel - recorte1
      
      if (sobra > 0.01 && recortesRestantes.length > 0) {
        // Buscar recorte que caiba na sobra
        const indiceRecorteQueCabe = recortesRestantes.findIndex(r => r <= sobra)
        
        if (indiceRecorteQueCabe >= 0) {
          const recorte2 = recortesRestantes.splice(indiceRecorteQueCabe, 1)[0]
          aproveitamentoBarra.uso2 = recorte2
          aproveitamentoBarra.sobra = sobra - recorte2
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
      recortes: recortesNecessarios.length,
      total: totalInteiras + barrasParaRecortes,
      detalhamento: {
        barrasInteiras: totalInteiras,
        barrasParaRecortes: barrasParaRecortes,
        aproveitamento: aproveitamento
      }
    }
  }
  
  /**
   * Calcula perfis T para um ambiente específico
   */
  calcularAmbiente(
    larguraAmbiente: number,
    comprimentoAmbiente: number,
    dimensoesPlaca: { largura: number; comprimento: number }
  ): ResultadoPerfisT {
    
    // PERFIL T 3,12m (Horizontais - entre fileiras de placas)
    const fileirasPlacas = Math.ceil(comprimentoAmbiente / dimensoesPlaca.comprimento)
    const perfisHorizontais = fileirasPlacas - 1 // sempre 1 a menos
    const comprimentosHorizontais = Array(perfisHorizontais).fill(larguraAmbiente)
    
    // PERFIL T 1,25m (Verticais - entre colunas de placas)  
    const colunasPlacas = Math.ceil(larguraAmbiente / dimensoesPlaca.largura)
    const perfisVerticais = colunasPlacas - 1 // sempre 1 a menos
    const comprimentosVerticais = Array(perfisVerticais).fill(comprimentoAmbiente)
    
    // PERFIL T 0,625m (Para recortes menores ou detalhes específicos)
    // Por enquanto, vamos considerar que não há necessidade específica
    // Esta lógica pode ser expandida conforme necessidade do projeto
    const comprimentos0625: number[] = []
    
    // Calcular cada tipo de perfil
    const resultado312 = this.calcularPerfil(comprimentosHorizontais, PERFIS_T['312'].tamanho)
    const resultado125 = this.calcularPerfil(comprimentosVerticais, PERFIS_T['125'].tamanho)
    const resultado0625 = this.calcularPerfil(comprimentos0625, PERFIS_T['0625'].tamanho)
    
    return {
      perfil312: resultado312,
      perfil125: resultado125,
      perfil0625: resultado0625,
      resumo: {
        totalBarras312: resultado312.total,
        totalBarras125: resultado125.total,
        totalBarras0625: resultado0625.total
      }
    }
  }
  
  /**
   * Calcula perfis T para múltiplos ambientes com otimização global
   */
  calcularMultiplosAmbientes(
    ambientes: Array<{
      largura: number
      comprimento: number
      nome: string
    }>,
    dimensoesPlaca: { largura: number; comprimento: number }
  ): ResultadoPerfisT {
    
    // Coletar todos os comprimentos necessários
    const comprimentosHorizontais: number[] = []
    const comprimentosVerticais: number[] = []
    
    ambientes.forEach(ambiente => {
      // Horizontais (perfil 3,12m)
      const fileirasPlacas = Math.ceil(ambiente.comprimento / dimensoesPlaca.comprimento)
      const perfisHorizontais = fileirasPlacas - 1
      
      for (let i = 0; i < perfisHorizontais; i++) {
        comprimentosHorizontais.push(ambiente.largura)
      }
      
      // Verticais (perfil 1,25m)
      const colunasPlacas = Math.ceil(ambiente.largura / dimensoesPlaca.largura)
      const perfisVerticais = colunasPlacas - 1
      
      for (let i = 0; i < perfisVerticais; i++) {
        comprimentosVerticais.push(ambiente.comprimento)
      }
    })
    
    // Calcular com otimização global
    const resultado312 = this.calcularPerfil(comprimentosHorizontais, PERFIS_T['312'].tamanho)
    const resultado125 = this.calcularPerfil(comprimentosVerticais, PERFIS_T['125'].tamanho)
    const resultado0625 = this.calcularPerfil([], PERFIS_T['0625'].tamanho) // Por enquanto vazio
    
    return {
      perfil312: resultado312,
      perfil125: resultado125,
      perfil0625: resultado0625,
      resumo: {
        totalBarras312: resultado312.total,
        totalBarras125: resultado125.total,
        totalBarras0625: resultado0625.total
      }
    }
  }
}

// Instância única para uso
export const perfilTCalculator = new PerfilTCalculator()