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
   * Calcula quantidade de chapas necessárias
   */
  private calcularChapas(paredes: MedidaParede[], areaLiquida: number, modalidade: 'abnt' | 'basica'): CalculoMaterial[] {
    const chapas: CalculoMaterial[] = []
    
    // Agrupar chapas por tipo e altura
    const chapasPorTipo: {[key: string]: {standard: number, ru: number, rf: number, altura: string}} = {}
    
    paredes.forEach(parede => {
      let chapasPorLado = 1
      
      if (modalidade === 'abnt') {
        // Em modo ABNT, usar configurações pré-definidas
        switch (parede.especificacoes.tipoMontante) {
          case '90':
            chapasPorLado = 2
            break
          case '70':
          case '48':
          default:
            chapasPorLado = 1
        }
      } else {
        // Modo básico - usar configuração do usuário
        switch (parede.especificacoes.chapasPorLado) {
          case 'simples':
            chapasPorLado = 1
            break
          case 'duplo':
            chapasPorLado = 2
            break
          case 'quadruplo':
            chapasPorLado = 4
            break
          default:
            chapasPorLado = 1
        }
      }
      
      // Área da chapa baseada na altura selecionada
      const alturaChapa = parseFloat(parede.especificacoes.tipoChapa)
      const areaChapa = 1.20 * alturaChapa // Largura sempre 1,20m
      
      const chapasNecessarias = Math.ceil((parede.area / areaChapa) * chapasPorLado * 2) // 2 lados da parede
      
      const tipoChapa = parede.especificacoes.tipoChapa
      
      if (!chapasPorTipo[tipoChapa]) {
        chapasPorTipo[tipoChapa] = {standard: 0, ru: 0, rf: 0, altura: alturaChapa.toString()}
      }
      
      // Classificar tipo de chapa baseado no ambiente
      const descricaoLower = parede.descricao.toLowerCase()
      
      if (descricaoLower.includes('sauna') || descricaoLower.includes('churrasqueira') || 
          descricaoLower.includes('forno') || descricaoLower.includes('lareira')) {
        // RF - Resistente ao Fogo para ambientes com alta temperatura
        chapasPorTipo[tipoChapa].rf += chapasNecessarias
      } else if (descricaoLower.includes('banheiro') || descricaoLower.includes('cozinha') ||
                 descricaoLower.includes('área') || descricaoLower.includes('lavanderia') ||
                 descricaoLower.includes('lavabo') || descricaoLower.includes('wc')) {
        // RU - Resistente à Umidade para ambientes molhados
        chapasPorTipo[tipoChapa].ru += chapasNecessarias
      } else {
        // ST - Standard para ambientes secos normais
        chapasPorTipo[tipoChapa].standard += chapasNecessarias
      }
    })
    
    // Criar itens de material para cada tipo de chapa
    Object.entries(chapasPorTipo).forEach(([altura, dados]) => {
      // Adicionar 10% de perda
      const standardComPerda = Math.ceil(dados.standard * 1.1)
      const ruComPerda = Math.ceil(dados.ru * 1.1)
      const rfComPerda = Math.ceil(dados.rf * 1.1)
      
      if (standardComPerda > 0) {
        chapas.push({
          item: 'Chapa Drywall ST',
          descricao: `1,20m x ${altura}m x 12,5mm (Standard)`,
          quantidade: standardComPerda,
          unidade: 'un',
          observacoes: 'Para ambientes secos - inclui 10% para perdas e recortes'
        })
      }
      
      if (ruComPerda > 0) {
        chapas.push({
          item: 'Chapa Drywall RU',
          descricao: `1,20m x ${altura}m x 12,5mm (Resistente à Umidade)`,
          quantidade: ruComPerda,
          unidade: 'un',
          observacoes: 'Para ambientes molhados - inclui 10% para perdas'
        })
      }
      
      if (rfComPerda > 0) {
        chapas.push({
          item: 'Chapa Drywall RF',
          descricao: `1,20m x ${altura}m x 12,5mm (Resistente ao Fogo)`,
          quantidade: rfComPerda,
          unidade: 'un',
          observacoes: 'Para ambientes com alta temperatura - inclui 10% para perdas'
        })
      }
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
    
    // Converter metros para barras (3m por barra) e adicionar 5% de perda
    const adicionarPerfil = (metros: number, tipo: string, largura: string) => {
      if (metros > 0) {
        const barras = Math.ceil((metros * 1.05) / 3)
        perfis.push({
          item: `Perfil ${tipo} ${largura}`,
          descricao: `Perfil ${tipo} ${largura} - 3,00m`,
          quantidade: barras,
          unidade: 'un',
          observacoes: `${metros.toFixed(1)}m necessários + 5% perda`
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