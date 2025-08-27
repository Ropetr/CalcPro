// Calculadora de Divisória Naval
// Sistema com painéis de miolo colmeia + perfis H e U de alumínio

import {
  MedidaDivisoria,
  ResultadoCalculoDivisoriaNaval,
  ResultadoParedeDivisoria,
  PainelNecessario,
  PerfilHNecessario,
  PerfilUNecessario,
  PoolsAproveitamento,
  SobraPainel,
  SobraPerfilH,
  SobraPerfilU,
  PAINEIS_DISPONIVEIS,
  PERFIS_H_DISPONIVEIS,
  PERFIS_U_DISPONIVEIS,
  APROVEITAMENTO_MINIMO
} from './types'

export class DivisoriaNavalCalculator {
  private pools: PoolsAproveitamento = {
    paineis: {
      altura_integral: [],
      recortes_altura: []
    },
    perfis_h: [],
    perfis_u: []
  }

  public calcular(medidas: MedidaDivisoria[]): ResultadoCalculoDivisoriaNaval {
    // Resetar pools para novo cálculo
    this.resetarPools()
    
    // Calcular cada parede
    const resultadosParedes = medidas.map(medida => 
      this.calcularParede(medida)
    )

    // Compilar resultado final
    return this.compilarResultado(resultadosParedes)
  }

  private resetarPools(): void {
    this.pools = {
      paineis: {
        altura_integral: [],
        recortes_altura: []
      },
      perfis_h: [],
      perfis_u: []
    }
  }

  private calcularParede(medida: MedidaDivisoria): ResultadoParedeDivisoria {
    // Expandir paredes com quantidade > 1
    const paredesIndividuais = Array(medida.quantidade).fill(null).map((_, index) => ({
      ...medida,
      id: `${medida.id}-${index + 1}`,
      quantidade: 1
    }))

    // Para cada parede individual, calcular materiais
    const resultadosIndividuais = paredesIndividuais.map(parede => {
      const paineis = this.calcularPaineis(parede)
      const perfisH = this.calcularPerfisH(parede, paineis.necessarios)
      const perfisU = this.calcularPerfisU(parede)
      
      const areaVaos = this.calcularAreaVaos(parede)
      const areaLiquida = (parede.altura * parede.largura) - areaVaos

      return {
        medida: parede,
        paineis,
        perfis_h: perfisH,
        perfis_u: perfisU,
        area_liquida: areaLiquida,
        area_vaos: areaVaos
      }
    })

    // Consolidar resultados das paredes idênticas
    return this.consolidarResultadosParedes(resultadosIndividuais, medida)
  }

  private calcularPaineis(parede: MedidaDivisoria) {
    const { largura, altura } = parede
    const necessarios: PainelNecessario[] = []
    let paineis_1_20_usados = 0
    let paineis_0_82_usados = 0
    const sobras_geradas: SobraPainel[] = []

    // 1. CALCULAR CAMADAS NECESSÁRIAS
    const camadas = this.calcularCamadas(altura)
    
    // 2. PARA CADA CAMADA, CALCULAR PAINÉIS NA LARGURA
    camadas.forEach((alturaCamada, indexCamada) => {
      const tipoCamada = indexCamada === 0 ? 'inferior' : 'superior'
      const paineisLargura = this.calcularPaineisLargura(largura, alturaCamada, tipoCamada)
      
      paineisLargura.forEach(painel => {
        necessarios.push(painel)
        
        if (painel.origem === 'painel_1_20') {
          paineis_1_20_usados++
          // Gerar sobra se foi cortado
          if (painel.posicao.includes('recorte')) {
            const sobraLargura = 1.20 - painel.largura
            const sobraAltura = alturaCamada === 2.10 ? 2.10 : alturaCamada
            
            if (sobraLargura >= APROVEITAMENTO_MINIMO.painel_largura) {
              sobras_geradas.push({
                largura: sobraLargura,
                altura: sobraAltura,
                origem: 'painel_1_20',
                disponivel: true
              })
              
              // Adicionar ao pool apropriado
              if (sobraAltura === 2.10) {
                this.pools.paineis.altura_integral.push(sobras_geradas[sobras_geradas.length - 1])
              } else {
                this.pools.paineis.recortes_altura.push(sobras_geradas[sobras_geradas.length - 1])
              }
            }
          }
        } else {
          paineis_0_82_usados++
          // Gerar sobra se foi cortado
          if (painel.posicao.includes('recorte')) {
            const sobraLargura = 0.82 - painel.largura
            const sobraAltura = alturaCamada === 2.10 ? 2.10 : alturaCamada
            
            if (sobraLargura >= APROVEITAMENTO_MINIMO.painel_largura) {
              sobras_geradas.push({
                largura: sobraLargura,
                altura: sobraAltura,
                origem: 'painel_0_82',
                disponivel: true
              })
              
              // Adicionar ao pool apropriado
              if (sobraAltura === 2.10) {
                this.pools.paineis.altura_integral.push(sobras_geradas[sobras_geradas.length - 1])
              } else {
                this.pools.paineis.recortes_altura.push(sobras_geradas[sobras_geradas.length - 1])
              }
            }
          }
        }
      })
    })

    return {
      necessarios,
      paineis_1_20_usados,
      paineis_0_82_usados,
      sobras_geradas
    }
  }

  private calcularCamadas(altura: number): number[] {
    const camadas: number[] = []
    let alturaRestante = altura

    while (alturaRestante > 0) {
      if (alturaRestante >= 2.10) {
        camadas.push(2.10)
        alturaRestante -= 2.10
      } else {
        camadas.push(alturaRestante)
        alturaRestante = 0
      }
    }

    return camadas
  }

  private calcularPaineisLargura(
    largura: number, 
    altura: number, 
    camada: 'inferior' | 'superior'
  ): PainelNecessario[] {
    const paineis: PainelNecessario[] = []
    let larguraRestante = largura
    let contador = 1

    while (larguraRestante > 0) {
      // Tentar aproveitar sobra primeiro
      const sobraAproveitavel = this.buscarSobraAproveitavel(larguraRestante, altura)
      
      if (sobraAproveitavel) {
        paineis.push({
          id: `painel-${camada}-${contador}`,
          largura: larguraRestante,
          altura: altura,
          posicao: 'inteiro',
          camada,
          origem: sobraAproveitavel.origem,
          aproveitado: true
        })
        
        // Marcar sobra como usada
        sobraAproveitavel.disponivel = false
        larguraRestante = 0
      } else {
        // Decidir qual painel usar
        const decisao = this.decidirPainel(larguraRestante)
        
        paineis.push({
          id: `painel-${camada}-${contador}`,
          largura: Math.min(larguraRestante, decisao.largura),
          altura: altura,
          posicao: larguraRestante >= decisao.largura ? 'inteiro' : 'recorte_largura',
          camada,
          origem: decisao.origem,
          aproveitado: false
        })
        
        larguraRestante -= decisao.largura
        if (larguraRestante < 0) larguraRestante = 0
      }
      
      contador++
    }

    return paineis
  }

  private buscarSobraAproveitavel(largura: number, altura: number): SobraPainel | null {
    const pool = altura === 2.10 ? 
      this.pools.paineis.altura_integral : 
      this.pools.paineis.recortes_altura

    return pool.find(sobra => 
      sobra.disponivel && 
      sobra.largura >= largura && 
      sobra.altura >= altura
    ) || null
  }

  private decidirPainel(larguraRestante: number): { largura: number, origem: 'painel_1_20' | 'painel_0_82' } {
    // Se sobra exata do painel 0,82
    if (larguraRestante === 0.82) {
      return { largura: 0.82, origem: 'painel_0_82' }
    }
    
    // Se sobra menor que 0,82, usar painel 0,82 (vai gerar menos desperdício)
    if (larguraRestante < 0.82) {
      return { largura: 0.82, origem: 'painel_0_82' }
    }
    
    // Se sobra entre 0,82 e 1,20, usar painel 1,20
    if (larguraRestante <= 1.20) {
      return { largura: 1.20, origem: 'painel_1_20' }
    }
    
    // Se sobra maior que 1,20, usar painel 1,20 (será cortado)
    return { largura: 1.20, origem: 'painel_1_20' }
  }

  private calcularPerfisH(parede: MedidaDivisoria, paineis: PainelNecessario[]) {
    const necessarios: PerfilHNecessario[] = []
    let perfis_3_00_usados = 0
    let perfis_2_15_usados = 0
    let perfis_1_18_usados = 0
    const sobras_geradas: SobraPerfilH[] = []

    // 1. PERFIS H VERTICAIS (entre painéis na largura)
    const paineisInferiores = paineis.filter(p => p.camada === 'inferior')
    if (paineisInferiores.length > 1) {
      const quantidadeHVerticais = paineisInferiores.length - 1
      
      for (let i = 0; i < quantidadeHVerticais; i++) {
        const perfilH = this.selecionarPerfilH(parede.altura, 'vertical')
        necessarios.push({
          id: `h-vertical-${i + 1}`,
          comprimento: parede.altura,
          orientacao: 'pe',
          tipo: 'vertical',
          posicao: `Entre painéis ${i + 1} e ${i + 2}`,
          aproveitado: false
        })
        
        // Contabilizar uso e sobras
        if (perfilH.origem === '3_00') {
          perfis_3_00_usados++
          if (3.00 - parede.altura >= APROVEITAMENTO_MINIMO.perfil_h) {
            sobras_geradas.push({
              comprimento: 3.00 - parede.altura,
              origem: '3_00',
              orientacao: 'pe',
              disponivel: true
            })
            this.pools.perfis_h.push(sobras_geradas[sobras_geradas.length - 1])
          }
        } else {
          perfis_2_15_usados++
          if (2.15 - parede.altura >= APROVEITAMENTO_MINIMO.perfil_h) {
            sobras_geradas.push({
              comprimento: 2.15 - parede.altura,
              origem: '2_15',
              orientacao: 'pe',
              disponivel: true
            })
            this.pools.perfis_h.push(sobras_geradas[sobras_geradas.length - 1])
          }
        }
      }
    }

    // 2. PERFIS H HORIZONTAIS (entre camadas na altura)
    const camadas = this.calcularCamadas(parede.altura)
    if (camadas.length > 1) {
      // Usar H 1,18m deitados
      const quantidadeHHorizontais = paineisInferiores.length
      
      for (let i = 0; i < quantidadeHHorizontais; i++) {
        necessarios.push({
          id: `h-horizontal-${i + 1}`,
          comprimento: 1.18,
          orientacao: 'deitado',
          tipo: 'horizontal',
          posicao: `Entre camada inferior e superior - painel ${i + 1}`,
          aproveitado: false
        })
        
        perfis_1_18_usados++
      }
    }

    return {
      necessarios,
      perfis_3_00_usados,
      perfis_2_15_usados,
      perfis_1_18_usados,
      sobras_geradas
    }
  }

  private selecionarPerfilH(altura: number, tipo: 'vertical' | 'horizontal'): { origem: '3_00' | '2_15' | '1_18' } {
    if (tipo === 'horizontal') {
      return { origem: '1_18' }
    }
    
    // Para perfis verticais
    if (altura <= 2.10) {
      return { origem: '2_15' }
    } else if (altura <= 3.00) {
      return { origem: '3_00' }
    } else {
      // Para alturas > 3.00m, usar 3.00 + cálculo adicional
      return { origem: '3_00' }
    }
  }

  private calcularPerfisU(parede: MedidaDivisoria) {
    const necessarios: PerfilUNecessario[] = []
    let perfis_3_00_usados = 0
    let perfis_2_15_usados = 0
    const sobras_geradas: SobraPerfilU[] = []

    // LATERAIS (altura) - 2 peças
    const perfilLateral = this.selecionarPerfilU(parede.altura)
    for (let i = 0; i < 2; i++) {
      const lado = i === 0 ? 'lateral_esquerda' : 'lateral_direita'
      necessarios.push({
        id: `u-${lado}`,
        comprimento: parede.altura,
        posicao: lado,
        aproveitado: false
      })
      
      if (perfilLateral.origem === '3_00') {
        perfis_3_00_usados++
        if (3.00 - parede.altura >= APROVEITAMENTO_MINIMO.perfil_u) {
          sobras_geradas.push({
            comprimento: 3.00 - parede.altura,
            origem: '3_00',
            disponivel: true
          })
          this.pools.perfis_u.push(sobras_geradas[sobras_geradas.length - 1])
        }
      } else {
        perfis_2_15_usados++
        if (2.15 - parede.altura >= APROVEITAMENTO_MINIMO.perfil_u) {
          sobras_geradas.push({
            comprimento: 2.15 - parede.altura,
            origem: '2_15',
            disponivel: true
          })
          this.pools.perfis_u.push(sobras_geradas[sobras_geradas.length - 1])
        }
      }
    }

    // PISO E TETO (largura) - com aproveitamento inteligente
    const resultadoPisoTeto = this.calcularPerfisUPisoTeto(parede.largura)
    necessarios.push(...resultadoPisoTeto.necessarios)
    perfis_3_00_usados += resultadoPisoTeto.perfis_3_00_usados
    perfis_2_15_usados += resultadoPisoTeto.perfis_2_15_usados
    sobras_geradas.push(...resultadoPisoTeto.sobras_geradas)

    return {
      necessarios,
      perfis_3_00_usados,
      perfis_2_15_usados,
      sobras_geradas
    }
  }

  private selecionarPerfilU(comprimento: number): { origem: '3_00' | '2_15' } {
    if (comprimento <= 2.15) {
      return { origem: '2_15' }
    } else {
      return { origem: '3_00' }
    }
  }

  private calcularPerfisUPisoTeto(largura: number) {
    const necessarios: PerfilUNecessario[] = []
    let perfis_3_00_usados = 0
    let perfis_2_15_usados = 0
    const sobras_geradas: SobraPerfilU[] = []

    // Verificar se pode aproveitar sobras para fazer piso + teto juntos
    if (largura <= 1.50) {
      // Pode usar 1 perfil U 3,00 para piso + teto
      necessarios.push(
        {
          id: 'u-piso',
          comprimento: largura,
          posicao: 'piso',
          aproveitado: false
        },
        {
          id: 'u-teto',
          comprimento: largura,
          posicao: 'teto',
          aproveitado: true // teto aproveita do mesmo perfil
        }
      )
      
      perfis_3_00_usados += 1
      
      // Sobra do perfil (se houver)
      const sobra = 3.00 - (largura * 2)
      if (sobra >= APROVEITAMENTO_MINIMO.perfil_u) {
        sobras_geradas.push({
          comprimento: sobra,
          origem: '3_00',
          disponivel: true
        })
        this.pools.perfis_u.push(sobras_geradas[sobras_geradas.length - 1])
      }
    } else {
      // Precisa de 2 perfis separados para piso e teto
      ['piso', 'teto'].forEach(posicao => {
        // Tentar aproveitar sobra primeiro
        const sobraAproveitavel = this.pools.perfis_u.find(sobra => 
          sobra.disponivel && sobra.comprimento >= largura
        )
        
        if (sobraAproveitavel) {
          necessarios.push({
            id: `u-${posicao}`,
            comprimento: largura,
            posicao: posicao as 'piso' | 'teto',
            aproveitado: true
          })
          sobraAproveitavel.disponivel = false
        } else {
          necessarios.push({
            id: `u-${posicao}`,
            comprimento: largura,
            posicao: posicao as 'piso' | 'teto',
            aproveitado: false
          })
          
          const perfilUsado = this.selecionarPerfilU(largura)
          if (perfilUsado.origem === '3_00') {
            perfis_3_00_usados++
            const sobra = 3.00 - largura
            if (sobra >= APROVEITAMENTO_MINIMO.perfil_u) {
              sobras_geradas.push({
                comprimento: sobra,
                origem: '3_00',
                disponivel: true
              })
              this.pools.perfis_u.push(sobras_geradas[sobras_geradas.length - 1])
            }
          } else {
            perfis_2_15_usados++
            const sobra = 2.15 - largura
            if (sobra >= APROVEITAMENTO_MINIMO.perfil_u) {
              sobras_geradas.push({
                comprimento: sobra,
                origem: '2_15',
                disponivel: true
              })
              this.pools.perfis_u.push(sobras_geradas[sobras_geradas.length - 1])
            }
          }
        }
      })
    }

    return {
      necessarios,
      perfis_3_00_usados,
      perfis_2_15_usados,
      sobras_geradas
    }
  }

  private calcularAreaVaos(parede: MedidaDivisoria): number {
    let areaVaos = 0
    
    // Vãos de vidro
    if (parede.vaos.vidros.quantidade > 0) {
      areaVaos += parede.vaos.vidros.quantidade * parede.vaos.vidros.largura * parede.vaos.vidros.altura
    }
    
    // Vãos de porta
    if (parede.vaos.portas.quantidade > 0) {
      areaVaos += parede.vaos.portas.quantidade * parede.vaos.portas.largura * parede.vaos.portas.altura
    }
    
    return areaVaos
  }

  private consolidarResultadosParedes(
    resultados: ResultadoParedeDivisoria[], 
    medidaOriginal: MedidaDivisoria
  ): ResultadoParedeDivisoria {
    // Para múltiplas paredes idênticas, somar os materiais
    const consolidado = resultados.reduce((acc, resultado) => {
      return {
        medida: medidaOriginal, // usar medida original com quantidade correta
        paineis: {
          necessarios: [...acc.paineis.necessarios, ...resultado.paineis.necessarios],
          paineis_1_20_usados: acc.paineis.paineis_1_20_usados + resultado.paineis.paineis_1_20_usados,
          paineis_0_82_usados: acc.paineis.paineis_0_82_usados + resultado.paineis.paineis_0_82_usados,
          sobras_geradas: [...acc.paineis.sobras_geradas, ...resultado.paineis.sobras_geradas]
        },
        perfis_h: {
          necessarios: [...acc.perfis_h.necessarios, ...resultado.perfis_h.necessarios],
          perfis_3_00_usados: acc.perfis_h.perfis_3_00_usados + resultado.perfis_h.perfis_3_00_usados,
          perfis_2_15_usados: acc.perfis_h.perfis_2_15_usados + resultado.perfis_h.perfis_2_15_usados,
          perfis_1_18_usados: acc.perfis_h.perfis_1_18_usados + resultado.perfis_h.perfis_1_18_usados,
          sobras_geradas: [...acc.perfis_h.sobras_geradas, ...resultado.perfis_h.sobras_geradas]
        },
        perfis_u: {
          necessarios: [...acc.perfis_u.necessarios, ...resultado.perfis_u.necessarios],
          perfis_3_00_usados: acc.perfis_u.perfis_3_00_usados + resultado.perfis_u.perfis_3_00_usados,
          perfis_2_15_usados: acc.perfis_u.perfis_2_15_usados + resultado.perfis_u.perfis_2_15_usados,
          sobras_geradas: [...acc.perfis_u.sobras_geradas, ...resultado.perfis_u.sobras_geradas]
        },
        area_liquida: acc.area_liquida + resultado.area_liquida,
        area_vaos: acc.area_vaos + resultado.area_vaos
      }
    }, resultados[0])

    return consolidado
  }

  private compilarResultado(resultadosParedes: ResultadoParedeDivisoria[]): ResultadoCalculoDivisoriaNaval {
    // Somar totais
    const totais = resultadosParedes.reduce((acc, parede) => ({
      area_total: acc.area_total + (parede.medida.largura * parede.medida.altura * parede.medida.quantidade),
      area_liquida: acc.area_liquida + parede.area_liquida,
      area_vaos: acc.area_vaos + parede.area_vaos,
      total_paredes: acc.total_paredes + parede.medida.quantidade,
      painel_1_20: acc.painel_1_20 + parede.paineis.paineis_1_20_usados,
      painel_0_82: acc.painel_0_82 + parede.paineis.paineis_0_82_usados,
      h_3_00: acc.h_3_00 + parede.perfis_h.perfis_3_00_usados,
      h_2_15: acc.h_2_15 + parede.perfis_h.perfis_2_15_usados,
      h_1_18: acc.h_1_18 + parede.perfis_h.perfis_1_18_usados,
      u_3_00: acc.u_3_00 + parede.perfis_u.perfis_3_00_usados,
      u_2_15: acc.u_2_15 + parede.perfis_u.perfis_2_15_usados
    }), {
      area_total: 0, area_liquida: 0, area_vaos: 0, total_paredes: 0,
      painel_1_20: 0, painel_0_82: 0, h_3_00: 0, h_2_15: 0, h_1_18: 0, u_3_00: 0, u_2_15: 0
    })

    // Calcular desperdícios
    const areaTheoreticaPaineis = (totais.painel_1_20 * 2.52) + (totais.painel_0_82 * 1.722)
    const desperdicioPercentual = ((areaTheoreticaPaineis - totais.area_liquida) / areaTheoreticaPaineis) * 100

    return {
      paredes: resultadosParedes,
      resumo: {
        area_total: totais.area_total,
        area_vaos: totais.area_vaos,
        area_liquida: totais.area_liquida,
        total_paredes: totais.total_paredes
      },
      materiais: {
        paineis: {
          painel_1_20: totais.painel_1_20,
          painel_0_82: totais.painel_0_82,
          desperdicio_paineis: desperdicioPercentual
        },
        perfis_h: {
          h_3_00: totais.h_3_00,
          h_2_15: totais.h_2_15,
          h_1_18: totais.h_1_18,
          desperdicio_h: 0 // calcular se necessário
        },
        perfis_u: {
          u_3_00: totais.u_3_00,
          u_2_15: totais.u_2_15,
          desperdicio_u: 0 // calcular se necessário
        },
        acessorios: {
          kit_fixacao: totais.total_paredes,
          parafusos_4_2_13: Math.ceil(totais.area_liquida * 6), // estimativa
          buchas: Math.ceil(totais.total_paredes * 8) // estimativa
        }
      },
      aproveitamento: {
        paineis_aproveitados: 0, // contar sobras aproveitadas
        perfis_h_aproveitados: 0,
        perfis_u_aproveitados: 0,
        economia_total: 0
      }
    }
  }
}