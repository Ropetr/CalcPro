import { MedidaParede, CalculoMaterial, ResultadoCalculoDrywall, ConfiguracaoABNT } from './types'

/**
 * Calculadora de Divisória Drywall
 * Implementa cálculos conforme ABNT e modo básico
 */
export class DrywallCalculator {
  private configuracaoABNT: ConfiguracaoABNT = {
    montante48: {
      chapasPorLado: 1,
      isolamento: false,
      perfilGuia: '48mm',
      perfilMontante: '48mm'
    },
    montante70: {
      chapasPorLado: 1,
      isolamento: true,
      perfilGuia: '70mm',
      perfilMontante: '70mm'
    },
    montante90: {
      chapasPorLado: 2,
      isolamento: true,
      perfilGuia: '90mm',
      perfilMontante: '90mm'
    }
  }

  /**
   * Calcula materiais para divisória Drywall
   */
  calcular(paredes: MedidaParede[], modalidade: 'abnt' | 'basica'): ResultadoCalculoDrywall {
    const areaTotal = paredes.reduce((total, parede) => total + parede.area, 0)
    
    // Descontar área dos vãos (portas e janelas)
    const areaVaos = this.calcularAreaVaos(paredes)
    const areaLiquida = areaTotal - areaVaos
    
    const materiais = {
      chapas: this.calcularChapas(paredes, areaLiquida, modalidade),
      perfis: this.calcularPerfis(paredes, modalidade),
      fixacao: this.calcularFixacao(paredes, areaLiquida, modalidade),
      acabamento: this.calcularAcabamento(paredes, areaLiquida)
    }

    const resumo = {
      totalChapas: materiais.chapas.reduce((total, item) => total + item.quantidade, 0),
      totalPerfis: materiais.perfis.reduce((total, item) => total + item.quantidade, 0),
      totalParafusos: materiais.fixacao.reduce((total, item) => total + item.quantidade, 0)
    }

    return {
      modalidade,
      paredes,
      areaTotal: areaLiquida,
      materiais,
      resumo
    }
  }

  /**
   * Calcula área dos vãos (portas e janelas)
   */
  private calcularAreaVaos(paredes: MedidaParede[]): number {
    let areaVaos = 0
    
    paredes.forEach(parede => {
      // Área da porta (se houver)
      if (parede.vaos.porta.tipo !== 'nenhuma' && parede.vaos.porta.largura && parede.vaos.porta.altura) {
        areaVaos += parede.vaos.porta.largura * parede.vaos.porta.altura
      }
      
      // Área das janelas
      if (parede.vaos.janelas.quantidade > 0) {
        areaVaos += parede.vaos.janelas.largura * parede.vaos.janelas.altura
      }
    })
    
    return areaVaos
  }

  /**
   * Método auxiliar para adicionar recortes
   */
  private adicionarRecorte(recortes: Array<{largura: number, altura: number, quantidade: number}>, largura: number, altura: number, quantidade: number) {
    const recorteExistente = recortes.find(r => 
      Math.abs(r.largura - largura) < 0.01 && Math.abs(r.altura - altura) < 0.01
    )
    
    if (recorteExistente) {
      recorteExistente.quantidade += quantidade
    } else {
      recortes.push({ largura, altura, quantidade })
    }
  }

  /**
   * Calcula quantidade de chapas necessárias com precisão
   */
  private calcularChapas(paredes: MedidaParede[], areaLiquida: number, modalidade: 'abnt' | 'basica'): CalculoMaterial[] {
    const chapas: CalculoMaterial[] = []
    
    // Constantes da placa
    const PLACA_LARGURA = 1.2 // metros
    
    // Tipos para estrutura de dados
    interface RecorteInfo {
      largura: number
      altura: number
      quantidade: number
    }
    
    interface DadosAmbiente {
      placasInteiras: number
      recortes: RecorteInfo[]
    }
    
    interface TipoChapaDados {
      standard: DadosAmbiente
      ru: DadosAmbiente
      rf: DadosAmbiente
    }
    
    // Estrutura para acumular recortes por tipo de chapa e ambiente
    const recortesPorTipoEAmbiente: Record<string, TipoChapaDados> = {}
    
    // Processar cada parede individualmente
    paredes.forEach(parede => {
      let chapasPorLado = 1
      
      if (modalidade === 'abnt') {
        switch (parede.especificacoes.tipoMontante) {
          case '90': chapasPorLado = 2; break
          case '70':
          case '48':
          default: chapasPorLado = 1
        }
      } else {
        switch (parede.especificacoes.chapasPorLado) {
          case 'simples': chapasPorLado = 1; break
          case 'duplo': chapasPorLado = 2; break
          case 'quadruplo': chapasPorLado = 4; break
          default: chapasPorLado = 1
        }
      }
      
      // Altura da placa específica desta parede
      const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa) // 1.80 ou 2.40
      const tipoChapa = parede.especificacoes.tipoChapa
      
      // Determinar tipo de ambiente
      const descricaoLower = parede.descricao.toLowerCase()
      let tipoAmbiente: 'standard' | 'ru' | 'rf' = 'standard'
      
      if (descricaoLower.includes('sauna') || descricaoLower.includes('churrasqueira') || 
          descricaoLower.includes('forno') || descricaoLower.includes('lareira')) {
        tipoAmbiente = 'rf'
      } else if (descricaoLower.includes('banheiro') || descricaoLower.includes('cozinha') ||
                 descricaoLower.includes('área') || descricaoLower.includes('lavanderia') ||
                 descricaoLower.includes('lavabo') || descricaoLower.includes('wc')) {
        tipoAmbiente = 'ru'
      }
      
      // Inicializar estrutura se não existir
      if (!recortesPorTipoEAmbiente[tipoChapa]) {
        recortesPorTipoEAmbiente[tipoChapa] = {
          standard: { placasInteiras: 0, recortes: [] },
          ru: { placasInteiras: 0, recortes: [] },
          rf: { placasInteiras: 0, recortes: [] }
        }
      }
      
      // ALGORITMO SIMPLIFICADO E CORRETO
      
      // 1. Calcular faixas de largura
      const faixasCompletas = Math.floor(parede.largura / PLACA_LARGURA) // quantas faixas de 1,20m
      const sobraLargura = parede.largura % PLACA_LARGURA // sobra da largura
      
      // 2. Calcular para faixas completas (1,20m)
      if (faixasCompletas > 0) {
        const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
        const alturaRestante = parede.altura % PLACA_ALTURA
        
        // Placas inteiras das faixas completas
        recortesPorTipoEAmbiente[tipoChapa][tipoAmbiente].placasInteiras += 
          (placasInteirasNaAltura * faixasCompletas * chapasPorLado)
        
        // Recortes das faixas completas (se há sobra na altura)
        if (alturaRestante > 0.01) {
          this.adicionarRecorte(recortesPorTipoEAmbiente[tipoChapa][tipoAmbiente].recortes, 
            PLACA_LARGURA, alturaRestante, faixasCompletas * chapasPorLado)
        }
      }
      
      // 3. Calcular para faixa de sobra (se existe)
      if (sobraLargura > 0.01) {
        const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
        const alturaRestante = parede.altura % PLACA_ALTURA
        
        // Recortes da faixa de sobra (altura da placa inteira)
        if (placasInteirasNaAltura > 0) {
          this.adicionarRecorte(recortesPorTipoEAmbiente[tipoChapa][tipoAmbiente].recortes,
            sobraLargura, PLACA_ALTURA, placasInteirasNaAltura * chapasPorLado)
        }
        
        // Recortes da faixa de sobra (altura restante)
        if (alturaRestante > 0.01) {
          this.adicionarRecorte(recortesPorTipoEAmbiente[tipoChapa][tipoAmbiente].recortes,
            sobraLargura, alturaRestante, chapasPorLado)
        }
      }
    })
    
    
    // Calcular placas necessárias para cada tipo e ambiente
    Object.entries(recortesPorTipoEAmbiente).forEach(([tipoChapa, ambientes]) => {
      const alturaPlaca = parseFloat(tipoChapa)
      
      Object.entries(ambientes).forEach(([tipoAmbiente, dados]) => {
        const dadosTipados = dados as DadosAmbiente
        if (dadosTipados.placasInteiras === 0 && dadosTipados.recortes.length === 0) return
        
        let totalPlacas = dadosTipados.placasInteiras
        let placasParaRecortes = 0
        let detalhesRecortes: string[] = []
        
        // Calcular placas necessárias para cada tipo de recorte
        dadosTipados.recortes.forEach((recorte: RecorteInfo) => {
          let placasNecessarias = 0
          let recortesPorPlaca = 0
          
          // CÁLCULO MANUAL CORRETO
          if (Math.abs(recorte.largura - 1.2) < 0.01 && Math.abs(recorte.altura - 0.9) < 0.01) {
            // 4x (1,20×0,90): cabem 2 por placa (1,80÷0,90=2)
            recortesPorPlaca = 2
            placasNecessarias = Math.ceil(recorte.quantidade / 2)
          } 
          else if (Math.abs(recorte.largura - 0.6) < 0.01 && Math.abs(recorte.altura - 1.8) < 0.01) {
            // 2x (0,60×1,80): cabem 2 por placa (1,20÷0,60=2)
            recortesPorPlaca = 2
            placasNecessarias = Math.ceil(recorte.quantidade / 2)
          }
          else if (Math.abs(recorte.largura - 0.6) < 0.01 && Math.abs(recorte.altura - 0.9) < 0.01) {
            // 2x (0,60×0,90): cabem 4 por placa (1,20÷0,60=2, 1,80÷0,90=2, 2×2=4)
            recortesPorPlaca = 4
            placasNecessarias = Math.ceil(recorte.quantidade / 4)
          }
          else {
            // Fallback para outros casos
            const recortesPorLargura = Math.floor(PLACA_LARGURA / recorte.largura)
            const recortesPorAltura = Math.floor(alturaPlaca / recorte.altura)
            recortesPorPlaca = Math.max(1, recortesPorLargura * recortesPorAltura)
            placasNecessarias = Math.ceil(recorte.quantidade / recortesPorPlaca)
          }
          
          placasParaRecortes += placasNecessarias
          
          // Debug: mostrar cálculo detalhado
          let detalheCalculo = `${recorte.quantidade}x (${recorte.largura.toFixed(2)}×${recorte.altura.toFixed(2)}m)`
          detalheCalculo += ` → ${recortesPorPlaca} por placa = ${placasNecessarias} placas`
          
          detalhesRecortes.push(detalheCalculo)
        })
        
        totalPlacas += placasParaRecortes
        
        // Determinar nome e descrição do tipo
        let nomeChapa = 'Chapa Drywall ST'
        let descricaoTipo = '(Standard)'
        if (tipoAmbiente === 'ru') {
          nomeChapa = 'Chapa Drywall RU'
          descricaoTipo = '(Resistente à Umidade)'
        } else if (tipoAmbiente === 'rf') {
          nomeChapa = 'Chapa Drywall RF'
          descricaoTipo = '(Resistente ao Fogo)'
        }
        
        let observacoes = `${dadosTipados.placasInteiras} inteiras`
        if (placasParaRecortes > 0) {
          observacoes += ` + ${placasParaRecortes} para recortes`
        }
        if (detalhesRecortes.length > 0) {
          observacoes += ` (${detalhesRecortes.join(', ')})`
        }
        
        chapas.push({
          item: nomeChapa,
          descricao: `1,20m x ${tipoChapa}m x 12,5mm ${descricaoTipo}`,
          quantidade: totalPlacas,
          unidade: 'un',
          observacoes
        })
      })
    })
    
    return chapas
  }

  /**
   * Calcula perfis metálicos necessários
   */
  private calcularPerfis(paredes: MedidaParede[], modalidade: 'abnt' | 'basica'): CalculoMaterial[] {
    const perfis: CalculoMaterial[] = []
    
    let totalGuias48 = 0, totalMontantes48 = 0
    let totalGuias70 = 0, totalMontantes70 = 0  
    let totalGuias90 = 0, totalMontantes90 = 0
    
    paredes.forEach(parede => {
      const largura = parede.largura
      const altura = parede.altura
      
      // Guias: 2 x largura (piso e teto)
      const metrosGuia = largura * 2
      
      // Montantes: espaçados conforme especificação + extremidades
      const espacamento = parseFloat(parede.especificacoes.espacamentoMontante)
      const quantidadeMontantes = Math.ceil(largura / espacamento) + 1
      const metrosMontante = quantidadeMontantes * altura
      
      const tipoMontante = parede.especificacoes.tipoMontante
      
      switch (tipoMontante) {
        case '48':
          totalGuias48 += metrosGuia
          totalMontantes48 += metrosMontante
          break
        case '70':
          totalGuias70 += metrosGuia
          totalMontantes70 += metrosMontante
          break
        case '90':
          totalGuias90 += metrosGuia
          totalMontantes90 += metrosMontante
          break
      }
    })
    
    // Converter metros para barras (3m por barra)
    const adicionarPerfil = (metros: number, tipo: string, largura: string) => {
      if (metros > 0) {
        const barras = Math.ceil(metros / 3)
        perfis.push({
          item: `Perfil ${tipo} ${largura}`,
          descricao: `Perfil ${tipo} ${largura} - 3,00m`,
          quantidade: barras,
          unidade: 'un',
          observacoes: `${metros.toFixed(1)}m necessários`
        })
      }
    }
    
    adicionarPerfil(totalGuias48, 'Guia', '48mm')
    adicionarPerfil(totalMontantes48, 'Montante', '48mm')
    adicionarPerfil(totalGuias70, 'Guia', '70mm')
    adicionarPerfil(totalMontantes70, 'Montante', '70mm')
    adicionarPerfil(totalGuias90, 'Guia', '90mm')
    adicionarPerfil(totalMontantes90, 'Montante', '90mm')
    
    return perfis
  }

  /**
   * Calcula materiais de fixação
   */
  private calcularFixacao(paredes: MedidaParede[], areaLiquida: number, modalidade: 'abnt' | 'basica'): CalculoMaterial[] {
    const fixacao: CalculoMaterial[] = []
    
    // Parafusos para chapa: 25 unidades por m²
    const parafusosChapa = Math.ceil(areaLiquida * 25 * 2) // 2 lados da parede
    
    // Parafusos para estrutura: 6 unidades por metro linear de montante
    const metrosLinearesMontante = paredes.reduce((total, parede) => {
      const espacamento = parseFloat(parede.especificacoes.espacamentoMontante)
      const quantidadeMontantes = Math.ceil(parede.largura / espacamento) + 1
      return total + (quantidadeMontantes * parede.altura)
    }, 0)
    
    const parafusosEstrutura = Math.ceil(metrosLinearesMontante * 6)
    
    fixacao.push({
      item: 'Parafuso para Chapa',
      descricao: 'Parafuso autobrocante 3,5x25mm',
      quantidade: parafusosChapa,
      unidade: 'un',
      observacoes: '25 parafusos por m² (ambos os lados)'
    })
    
    fixacao.push({
      item: 'Parafuso para Estrutura',
      descricao: 'Parafuso autobrocante 3,5x9,5mm',
      quantidade: parafusosEstrutura,
      unidade: 'un',
      observacoes: '6 parafusos por metro linear de montante'
    })
    
    return fixacao
  }

  /**
   * Calcula materiais de acabamento
   */
  private calcularAcabamento(paredes: MedidaParede[], areaLiquida: number): CalculoMaterial[] {
    const acabamento: CalculoMaterial[] = []
    
    // Fita para juntas: 4 metros por m² (juntas horizontais e verticais)
    const metrosFita = Math.ceil(areaLiquida * 4)
    
    // Massa para juntas: 1,2kg por m²
    const kgMassa = Math.ceil(areaLiquida * 1.2)
    
    acabamento.push({
      item: 'Fita para Juntas',
      descricao: 'Fita de papel microperfurada 50mm',
      quantidade: metrosFita,
      unidade: 'm',
      observacoes: '4m por m² de parede (juntas + cantos)'
    })
    
    acabamento.push({
      item: 'Massa para Juntas',
      descricao: 'Massa pronta para juntas de drywall',
      quantidade: kgMassa,
      unidade: 'kg',
      observacoes: '1,2kg por m² para acabamento completo'
    })
    
    return acabamento
  }
}