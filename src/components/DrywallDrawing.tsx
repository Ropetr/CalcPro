'use client'

import React, { useState } from 'react'
import { MedidaParede } from '@/lib/calculators/divisoria-drywall/types'

interface DrywallDrawingProps {
  parede: MedidaParede
  scale?: number
}

export default function DrywallDrawing({ parede, scale = 50 }: DrywallDrawingProps) {
  // Estado para controlar qual lado está sendo visualizado
  const [ladoAtivo, setLadoAtivo] = useState<'A' | 'A2' | 'B' | 'B2'>('A')
  // Estado para controlar o zoom
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  // Dimensões em pixels (escala: 1m = 50px por padrão)
  const larguraPx = parede.largura * scale
  const alturaPx = parede.altura * scale
  
  // Limitar tamanho máximo para não quebrar o layout
  const maxWidth = 600
  const maxHeight = 400
  let finalScale = scale * zoomLevel
  
  if ((larguraPx * zoomLevel) > maxWidth || (alturaPx * zoomLevel) > maxHeight) {
    if (zoomLevel === 1) {
      const scaleX = maxWidth / parede.largura
      const scaleY = maxHeight / parede.altura
      finalScale = Math.min(scaleX, scaleY)
    }
  }
  
  const finalWidth = parede.largura * finalScale
  const finalHeight = parede.altura * finalScale
  
  // SVG sempre do mesmo tamanho (apenas um lado por vez) 
  const svgWidth = Math.max(finalWidth + 120, 600) // Margem para cotas
  const svgHeight = Math.max(finalHeight + 100, 400) // Margem para cotas


  // Calcular vãos
  const vaos: any[] = []
  
  // Porta/Passagem - posição baseada no lado ativo
  if (parede.vaos.porta.tipo !== 'nenhuma' && parede.vaos.porta.largura && parede.vaos.porta.altura) {
    const portaLargura = parede.vaos.porta.largura * finalScale
    const portaAltura = parede.vaos.porta.altura * finalScale
    const distanciaBorda = 0.10 * finalScale // 0,10m da borda
    
    // Lado A/A2: porta à esquerda | Lado B/B2: porta à direita
    const posX = ((ladoAtivo === 'B' || ladoAtivo === 'B2') && (parede.especificacoes.chapasPorLado === 'duplo' || parede.especificacoes.chapasPorLado === 'quadruplo'))
      ? finalWidth - portaLargura - distanciaBorda // Lado B/B2: lado direito
      : distanciaBorda // Lado A/A2: lado esquerdo
    
    vaos.push({
      tipo: parede.vaos.porta.tipo === 'passagem' ? 'passagem' : 'porta',
      x: posX,
      y: finalHeight - portaAltura,
      width: portaLargura,
      height: portaAltura,
      label: parede.vaos.porta.tipo === 'passagem' ? 'PASSAGEM' : 'PORTA'
    })
  }
  
  // Janelas - distribuídas no espaço restante (após a porta se houver)
  if (parede.vaos.janelas.quantidade > 0) {
    const larguraPorJanela = parede.vaos.janelas.largura / parede.vaos.janelas.quantidade
    
    // Calcular espaço disponível para janelas
    let espacoInicial = 0
    let larguraDisponivel = finalWidth
    
    // Se há porta, reduzir espaço disponível baseado na posição
    if (parede.vaos.porta.tipo !== 'nenhuma' && parede.vaos.porta.largura) {
      const portaLargura = parede.vaos.porta.largura * finalScale
      const distanciaBorda = 0.10 * finalScale
      const espacoOcupadoPorPorta = distanciaBorda + portaLargura + (0.20 * finalScale) // 0,20m de distância
      
      if ((ladoAtivo === 'B' || ladoAtivo === 'B2') && (parede.especificacoes.chapasPorLado === 'duplo' || parede.especificacoes.chapasPorLado === 'quadruplo')) {
        // Lado B/B2: porta à direita, janelas usam lado esquerdo
        espacoInicial = 0
        larguraDisponivel = finalWidth - espacoOcupadoPorPorta
      } else {
        // Lado A/A2: porta à esquerda, janelas usam lado direito
        espacoInicial = espacoOcupadoPorPorta
        larguraDisponivel = finalWidth - espacoOcupadoPorPorta
      }
    }
    
    for (let i = 0; i < parede.vaos.janelas.quantidade; i++) {
      const janelaLargura = larguraPorJanela * finalScale
      const janelaAltura = parede.vaos.janelas.altura * finalScale
      
      // Distribuir janelas no espaço disponível
      const posX = espacoInicial + (i + 1) * (larguraDisponivel / (parede.vaos.janelas.quantidade + 1)) - janelaLargura / 2
      
      vaos.push({
        tipo: 'janela',
        x: Math.max(0, posX), // Garantir que não saia da parede
        y: finalHeight - janelaAltura - (1.05 * finalScale), // 1.05m do piso até a base
        width: Math.min(janelaLargura, finalWidth - Math.max(0, posX)), // Ajustar se necessário
        height: janelaAltura,
        label: `JANELA${parede.vaos.janelas.quantidade > 1 ? ` ${i + 1}` : ''}`
      })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">{parede.nome}</h3>
        <div className="text-sm text-gray-600">
          {parede.largura}m × {parede.altura}m | Montante {parede.especificacoes.tipoMontante}mm | {parede.especificacoes.chapasPorLado} chapa(s) por lado
        </div>
      </div>

      {/* Abas para escolher o lado - Padrão Forro Modular */}
      {(parede.especificacoes.chapasPorLado === 'duplo' || parede.especificacoes.chapasPorLado === 'quadruplo') && (
        <div className="bg-gray-100 mb-4">
          <div className="flex items-end justify-start px-4 pt-2">
            <div className="flex">
              <button
                onClick={() => setLadoAtivo('A')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  ladoAtivo === 'A'
                    ? 'bg-white text-gray-900 border-t border-l border-r border-gray-300 rounded-t-lg -mb-px z-10'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 border-t border-l border-r border-gray-300 rounded-t-lg mr-px'
                }`}
              >
                Lado A
              </button>
              {parede.especificacoes.chapasPorLado === 'quadruplo' && (
                <button
                  onClick={() => setLadoAtivo('A2')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    ladoAtivo === 'A2'
                      ? 'bg-white text-gray-900 border-t border-l border-r border-gray-300 rounded-t-lg -mb-px z-10'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 border-t border-l border-r border-gray-300 rounded-t-lg mr-px'
                  }`}
                >
                  Lado A2
                </button>
              )}
              <button
                onClick={() => setLadoAtivo('B')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  ladoAtivo === 'B'
                    ? 'bg-white text-gray-900 border-t border-l border-r border-gray-300 rounded-t-lg -mb-px z-10'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 border-t border-l border-r border-gray-300 rounded-t-lg mr-px'
                }`}
              >
                Lado B
              </button>
              {parede.especificacoes.chapasPorLado === 'quadruplo' && (
                <button
                  onClick={() => setLadoAtivo('B2')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    ladoAtivo === 'B2'
                      ? 'bg-white text-gray-900 border-t border-l border-r border-gray-300 rounded-t-lg -mb-px z-10'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 border-t border-l border-r border-gray-300 rounded-t-lg'
                  }`}
                >
                  Lado B2
                </button>
              )}
            </div>
          </div>
          <div className="border-b border-gray-300"></div>
        </div>
      )}
      
      {/* Controles de Zoom */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <button
          onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
          disabled={zoomLevel <= 0.5}
        >
          Zoom -
        </button>
        <span className="text-sm font-medium text-gray-700">
          Zoom: {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
          disabled={zoomLevel >= 3}
        >
          Zoom +
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
        >
          Reset
        </button>
      </div>
      
      <div className="overflow-auto max-h-96 border border-gray-300 rounded">
        <svg width={svgWidth} height={svgHeight} className="border border-gray-300">
          <defs>
            {/* Padrão para chapas */}
            <pattern id="chapa-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="0.5"/>
            </pattern>
            
            {/* Padrão para isolamento */}
            <pattern id="isolamento-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2" fill="#ffd43b" opacity="0.3"/>
            </pattern>
          </defs>
          
          {/* Estrutura da parede */}
          <g transform="translate(50, 50)">
            
            
            {/* Fundo da parede (estrutura interna) */}
            <rect 
              x="0" 
              y="0" 
              width={finalWidth} 
              height={finalHeight}
              fill={parede.especificacoes.tratamentoAcustico !== 'nenhum' ? "url(#isolamento-pattern)" : "#ffffff"}
              stroke="#6b7280" 
              strokeWidth="2"
            />
            
            
            {/* Placas Drywall - Lado A - ALGORITMO DE OTIMIZAÇÃO */}
            {(ladoAtivo === 'A' || parede.especificacoes.chapasPorLado === 'simples') && (() => {
              const placas: JSX.Element[] = []
              
              // Dimensões da placa de gesso
              const PLACA_LARGURA = 1.2 // metros - sempre 1,20m
              const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa) // 1,80m ou 2,40m
              const DISTANCIA_MIN_JUNTAS = 0.6 // metros - distância mínima entre juntas de 1,20m
              
              // Converter para pixels
              const placaLarguraPx = PLACA_LARGURA * finalScale
              const placaAlturaPx = PLACA_ALTURA * finalScale
              
              // ALGORITMO DE APROVEITAMENTO DE SOBRAS
              const calcularPadraoAmarracao = (larguraParede: number, alturaParede: number) => {
                const numFaixas = Math.ceil(larguraParede / PLACA_LARGURA)
                
                // Calcular a sobra real que vou ter na altura
                const placasInteirasNaAltura = Math.floor(alturaParede / PLACA_ALTURA)
                const sobraReal = alturaParede - (placasInteirasNaAltura * PLACA_ALTURA)
                
                const padroesPorFaixa: any[] = []
                
                // Determinar estratégia de amarração
                let recorteParaDesencontro = 0
                
                if (sobraReal >= (DISTANCIA_MIN_JUNTAS - 0.01)) {
                  // Usar a sobra real para desencontro (com tolerância de 1cm)
                  recorteParaDesencontro = sobraReal
                } else if (sobraReal === 0 && placasInteirasNaAltura >= 2) {
                  // Altura múltipla de 1,80m - usar regra de "meio da chapa" (0,90m)
                  recorteParaDesencontro = PLACA_ALTURA / 2 // 0,90m
                } else if (sobraReal > 0 && sobraReal < DISTANCIA_MIN_JUNTAS) {
                  // Sobra pequena - não faz desencontro
                  recorteParaDesencontro = 0
                } else {
                  // Parede muito baixa - sem desencontro
                  recorteParaDesencontro = 0
                }
                
                const podeFazerDesencontro = recorteParaDesencontro > 0
                
                for (let faixa = 0; faixa < numFaixas; faixa++) {
                  if (faixa % 2 === 0) {
                    // FAIXAS ÍMPARES (1ª, 3ª, 5ª...): sempre chapa inteira embaixo
                    padroesPorFaixa.push({
                      tipo: 'chapa_inteira_embaixo',
                      recorteInicial: 0,
                      recorteParaDesencontro: recorteParaDesencontro,
                      juntas: placasInteirasNaAltura > 0 ? [PLACA_ALTURA] : []
                    })
                  } else {
                    // FAIXAS PARES (2ª, 4ª, 6ª...): usar recorte embaixo se possível
                    if (podeFazerDesencontro) {
                      padroesPorFaixa.push({
                        tipo: 'recorte_embaixo',
                        recorteInicial: recorteParaDesencontro,
                        recorteParaDesencontro: recorteParaDesencontro,
                        juntas: placasInteirasNaAltura > 0 ? [recorteParaDesencontro + PLACA_ALTURA] : []
                      })
                    } else {
                      // Sem desencontro - usar padrão igual à faixa ímpar
                      padroesPorFaixa.push({
                        tipo: 'chapa_inteira_embaixo',
                        recorteInicial: 0,
                        recorteParaDesencontro: 0,
                        juntas: placasInteirasNaAltura > 0 ? [PLACA_ALTURA] : []
                      })
                    }
                  }
                }
                
                return padroesPorFaixa
              }
              
              // Calcular padrão de amarração para esta parede
              const padraoAmarracao = calcularPadraoAmarracao(parede.largura, parede.altura)
              
              // Função para desenhar placas de uma faixa baseada no padrão otimizado
              const desenharFaixa = (faixa: number, padrao: any) => {
                const xFaixa = faixa * placaLarguraPx
                const larguraFaixa = Math.min(placaLarguraPx, finalWidth - xFaixa)
                
                if (larguraFaixa <= 0) return
                
                let alturaAtual = 0
                let placaIndex = 0
                
                // Recorte inicial (se houver)
                if (padrao.recorteInicial > 0) {
                  const recorteInicialPx = padrao.recorteInicial * finalScale
                  
                  placas.push(
                    <g key={`faixa-${faixa}-recorte-inicial`}>
                      <rect
                        x={xFaixa}
                        y={finalHeight - recorteInicialPx}
                        width={larguraFaixa}
                        height={recorteInicialPx}
                        fill="url(#chapa-pattern)"
                        stroke="#6b7280"
                        strokeWidth="1"
                      />
                      <rect
                        x={xFaixa}
                        y={finalHeight - recorteInicialPx}
                        width={larguraFaixa}
                        height={recorteInicialPx}
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                    </g>
                  )
                  alturaAtual += padrao.recorteInicial
                }
                
                // Placas inteiras
                while (alturaAtual + PLACA_ALTURA <= parede.altura) {
                  const yPlaca = finalHeight - (alturaAtual + PLACA_ALTURA) * finalScale
                  
                  placas.push(
                    <g key={`faixa-${faixa}-inteira-${placaIndex}`}>
                      <rect
                        x={xFaixa}
                        y={yPlaca}
                        width={larguraFaixa}
                        height={placaAlturaPx}
                        fill="url(#chapa-pattern)"
                        stroke="#6b7280"
                        strokeWidth="1"
                      />
                      <rect
                        x={xFaixa}
                        y={yPlaca}
                        width={larguraFaixa}
                        height={placaAlturaPx}
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                    </g>
                  )
                  alturaAtual += PLACA_ALTURA
                  placaIndex++
                }
                
                // Recorte final no topo (se necessário)
                const alturaRestante = parede.altura - alturaAtual
                if (alturaRestante > 0) {
                  const alturaRestantePx = alturaRestante * finalScale
                  
                  placas.push(
                    <g key={`faixa-${faixa}-recorte-final`}>
                      <rect
                        x={xFaixa}
                        y={0}
                        width={larguraFaixa}
                        height={alturaRestantePx}
                        fill="url(#chapa-pattern)"
                        stroke="#6b7280"
                        strokeWidth="1"
                      />
                      <rect
                        x={xFaixa}
                        y={0}
                        width={larguraFaixa}
                        height={alturaRestantePx}
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                    </g>
                  )
                }
              }
              
              // Desenhar todas as faixas usando o padrão de aproveitamento de sobras
              const numFaixas = Math.ceil(parede.largura / PLACA_LARGURA)
              for (let faixa = 0; faixa < numFaixas; faixa++) {
                const padrao = padraoAmarracao[faixa] || padraoAmarracao[0] // fallback para primeiro padrão
                desenharFaixa(faixa, padrao)
              }
              
              return placas
            })()}
            
            {/* Placas Drywall - Lado B (se dupla ou quadrupla) - AMARRAÇÃO DESENCONTRADA DINÂMICA */}
            {ladoAtivo === 'B' && (parede.especificacoes.chapasPorLado === 'duplo' || parede.especificacoes.chapasPorLado === 'quadruplo') && (() => {
              const placas: JSX.Element[] = []
              
              // Dimensões da placa de gesso
              const PLACA_LARGURA = 1.2 // metros - sempre 1,20m
              const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa) // 1,80m ou 2,40m
              
              // Converter para pixels
              const placaLarguraPx = PLACA_LARGURA * finalScale
              const placaAlturaPx = PLACA_ALTURA * finalScale
              
              // LÓGICA DINÂMICA DE APROVEITAMENTO DE SOBRAS
              const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
              const sobraAltura = parede.altura - (placasInteirasNaAltura * PLACA_ALTURA)
              
              // ESTRATÉGIA SIMPLIFICADA DE DESENCONTRO
              let recorteDesencontro = 0
              
              if (sobraAltura >= 0.6) {
                // Usar a sobra real da parede se for >= 60cm
                recorteDesencontro = sobraAltura
              } else if (sobraAltura === 0 && placasInteirasNaAltura >= 2) {
                // Parede com altura múltipla da chapa - usar metade da altura
                recorteDesencontro = PLACA_ALTURA / 2 // 0,90m para 1,80m ou 1,20m para 2,40m
              } else if (sobraAltura > 0 && sobraAltura < 0.6) {
                // Usar sobra pequena mesmo sendo menor que 60cm
                recorteDesencontro = sobraAltura
              } else {
                // SEM DESENCONTRO: Parede muito baixa
                recorteDesencontro = 0
              }
              
              // LÓGICA DINÂMICA DE FAIXAS
              // Calcular número total de faixas baseado na largura da parede
              const numFaixas = Math.ceil(parede.largura / PLACA_LARGURA)
              
              // Função para desenhar uma faixa específica com padrão desencontrado
              const desenharFaixaB = (indexFaixa: number) => {
                // Calcular dimensões e posição da faixa
                const xFaixa = indexFaixa * PLACA_LARGURA
                const larguraRestante = parede.largura - xFaixa
                const larguraFaixa = Math.min(PLACA_LARGURA, larguraRestante)
                
                if (larguraFaixa <= 0) return
                
                const xFaixaPx = xFaixa * finalScale
                const larguraFaixaPx = larguraFaixa * finalScale
                
                // Determinar padrão baseado no índice da faixa
                // Faixas ímpares (0, 2, 4...): recorte embaixo + placas inteiras encima (INVERTIDO: era 1ª, 3ª, 5ª)
                // Faixas pares (1, 3, 5...): placas inteiras embaixo + recorte encima (INVERTIDO: era 2ª, 4ª, 6ª)
                const ehFaixaImpar = indexFaixa % 2 === 0 // invertido conforme solicitação
                
                if (ehFaixaImpar && recorteDesencontro > 0) {
                  // FAIXA ÍMPAR: recorte embaixo + placas inteiras encima
                  
                  // Recorte embaixo
                  const alturaRecortePx = recorteDesencontro * finalScale
                  placas.push(
                    <g key={`faixaB-${indexFaixa}-embaixo`}>
                      <rect
                        x={xFaixaPx}
                        y={finalHeight - alturaRecortePx}
                        width={larguraFaixaPx}
                        height={alturaRecortePx}
                        fill="url(#chapa-pattern)"
                        stroke="#6b7280"
                        strokeWidth="1"
                      />
                      <rect
                        x={xFaixaPx}
                        y={finalHeight - alturaRecortePx}
                        width={larguraFaixaPx}
                        height={alturaRecortePx}
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                    </g>
                  )
                  
                  // Placas inteiras encima
                  const alturaRestante = parede.altura - recorteDesencontro
                  let yAtual = 0
                  let placaIndex = 0
                  let alturaProcessada = 0
                  
                  while (alturaProcessada < alturaRestante) {
                    const alturaPlaca = Math.min(PLACA_ALTURA, alturaRestante - alturaProcessada)
                    const alturaPlacaPx = alturaPlaca * finalScale
                    
                    placas.push(
                      <g key={`faixaB-${indexFaixa}-encima-${placaIndex}`}>
                        <rect
                          x={xFaixaPx}
                          y={yAtual}
                          width={larguraFaixaPx}
                          height={alturaPlacaPx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                        />
                        <rect
                          x={xFaixaPx}
                          y={yAtual}
                          width={larguraFaixaPx}
                          height={alturaPlacaPx}
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                      </g>
                    )
                    
                    yAtual += alturaPlacaPx
                    alturaProcessada += alturaPlaca
                    placaIndex++
                  }
                  
                } else {
                  // FAIXA PAR ou sem desencontro: placas inteiras embaixo + recorte encima (se houver)
                  
                  // Placas inteiras embaixo
                  let alturaColocada = 0
                  let placaIndex = 0
                  
                  const alturaDisponivel = parede.altura - recorteDesencontro
                  while (alturaColocada + PLACA_ALTURA <= alturaDisponivel && alturaDisponivel > 0) {
                    const yPlaca = finalHeight - (alturaColocada + PLACA_ALTURA) * finalScale
                    
                    placas.push(
                      <g key={`faixaB-${indexFaixa}-embaixo-${placaIndex}`}>
                        <rect
                          x={xFaixaPx}
                          y={yPlaca}
                          width={larguraFaixaPx}
                          height={placaAlturaPx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                        />
                        <rect
                          x={xFaixaPx}
                          y={yPlaca}
                          width={larguraFaixaPx}
                          height={placaAlturaPx}
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                      </g>
                    )
                    
                    alturaColocada += PLACA_ALTURA
                    placaIndex++
                  }
                  
                  // Recorte encima (se houver desencontro)
                  if (recorteDesencontro > 0) {
                    const alturaRecortePx = recorteDesencontro * finalScale
                    placas.push(
                      <g key={`faixaB-${indexFaixa}-encima`}>
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRecortePx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                        />
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRecortePx}
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                      </g>
                    )
                  }
                  
                  // Se não há desencontro mas sobra altura, preencher com recorte no topo
                  const alturaRestante = parede.altura - alturaColocada
                  if (alturaRestante > 0 && recorteDesencontro === 0) {
                    const alturaRestantePx = alturaRestante * finalScale
                    placas.push(
                      <g key={`faixaB-${indexFaixa}-topo`}>
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRestantePx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                        />
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRestantePx}
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                      </g>
                    )
                  }
                }
              }
              
              // Desenhar todas as faixas dinamicamente
              for (let i = 0; i < numFaixas; i++) {
                desenharFaixaB(i)
              }
              
              return placas
            })()}
            
            {/* Placas Drywall - Lado A2 (espelhamento horizontal exato do Lado B) */}
            {ladoAtivo === 'A2' && parede.especificacoes.chapasPorLado === 'quadruplo' && (() => {
              const placas: JSX.Element[] = []
              
              // Usar exatamente a mesma lógica do Lado B
              const PLACA_LARGURA = 1.2 // metros - sempre 1,20m
              const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa) // 1,80m ou 2,40m
              
              // Converter para pixels
              const placaLarguraPx = PLACA_LARGURA * finalScale
              const placaAlturaPx = PLACA_ALTURA * finalScale
              
              // LÓGICA IDÊNTICA AO LADO B
              const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
              const sobraAltura = parede.altura - (placasInteirasNaAltura * PLACA_ALTURA)
              
              // ESTRATÉGIA IDÊNTICA AO LADO B
              let recorteDesencontro = 0
              
              if (sobraAltura >= 0.6) {
                recorteDesencontro = sobraAltura
              } else if (sobraAltura === 0 && placasInteirasNaAltura >= 2) {
                recorteDesencontro = PLACA_ALTURA / 2
              } else if (sobraAltura > 0 && sobraAltura < 0.6) {
                recorteDesencontro = sobraAltura
              } else {
                recorteDesencontro = 0
              }
              
              const numFaixas = Math.ceil(parede.largura / PLACA_LARGURA)
              
              // Função IDÊNTICA AO LADO B
              const desenharFaixaA2 = (indexFaixa: number) => {
                const xFaixa = indexFaixa * PLACA_LARGURA
                const larguraRestante = parede.largura - xFaixa
                const larguraFaixa = Math.min(PLACA_LARGURA, larguraRestante)
                
                if (larguraFaixa <= 0) return
                
                const xFaixaPx = xFaixa * finalScale
                const larguraFaixaPx = larguraFaixa * finalScale
                
                // LÓGICA IDÊNTICA: Faixas ímpares (0, 2, 4...): recorte embaixo
                const ehFaixaImpar = indexFaixa % 2 === 0
                
                if (ehFaixaImpar && recorteDesencontro > 0) {
                  // FAIXA ÍMPAR: recorte embaixo + placas inteiras encima
                  
                  // Recorte embaixo
                  const alturaRecortePx = recorteDesencontro * finalScale
                  placas.push(
                    <g key={`faixaA2-${indexFaixa}-embaixo`}>
                      <rect
                        x={xFaixaPx}
                        y={finalHeight - alturaRecortePx}
                        width={larguraFaixaPx}
                        height={alturaRecortePx}
                        fill="url(#chapa-pattern)"
                        stroke="#6b7280"
                        strokeWidth="1"
                        opacity="0.8"
                      />
                      <rect
                        x={xFaixaPx}
                        y={finalHeight - alturaRecortePx}
                        width={larguraFaixaPx}
                        height={alturaRecortePx}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                    </g>
                  )
                  
                  // Placas inteiras encima
                  const alturaRestante = parede.altura - recorteDesencontro
                  let yAtual = 0
                  let placaIndex = 0
                  let alturaProcessada = 0
                  
                  while (alturaProcessada < alturaRestante) {
                    const alturaPlaca = Math.min(PLACA_ALTURA, alturaRestante - alturaProcessada)
                    const alturaPlacaPx = alturaPlaca * finalScale
                    
                    placas.push(
                      <g key={`faixaA2-${indexFaixa}-encima-${placaIndex}`}>
                        <rect
                          x={xFaixaPx}
                          y={yAtual}
                          width={larguraFaixaPx}
                          height={alturaPlacaPx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                        <rect
                          x={xFaixaPx}
                          y={yAtual}
                          width={larguraFaixaPx}
                          height={alturaPlacaPx}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                      </g>
                    )
                    
                    yAtual += alturaPlacaPx
                    alturaProcessada += alturaPlaca
                    placaIndex++
                  }
                } else {
                  // FAIXA PAR ou sem desencontro: placas inteiras embaixo + recorte encima
                  let alturaColocada = 0
                  let placaIndex = 0
                  
                  const alturaDisponivel = parede.altura - recorteDesencontro
                  while (alturaColocada + PLACA_ALTURA <= alturaDisponivel && alturaDisponivel > 0) {
                    const yPlaca = finalHeight - (alturaColocada + PLACA_ALTURA) * finalScale
                    
                    placas.push(
                      <g key={`faixaA2-${indexFaixa}-embaixo-${placaIndex}`}>
                        <rect
                          x={xFaixaPx}
                          y={yPlaca}
                          width={larguraFaixaPx}
                          height={placaAlturaPx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                        <rect
                          x={xFaixaPx}
                          y={yPlaca}
                          width={larguraFaixaPx}
                          height={placaAlturaPx}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                      </g>
                    )
                    
                    alturaColocada += PLACA_ALTURA
                    placaIndex++
                  }
                  
                  // Recorte encima (se houver desencontro)
                  if (recorteDesencontro > 0) {
                    const alturaRecortePx = recorteDesencontro * finalScale
                    placas.push(
                      <g key={`faixaA2-${indexFaixa}-encima`}>
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRecortePx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRecortePx}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                      </g>
                    )
                  }
                  
                  // Se não há desencontro mas sobra altura, preencher com recorte no topo
                  const alturaRestante = parede.altura - alturaColocada
                  if (alturaRestante > 0 && recorteDesencontro === 0) {
                    const alturaRestantePx = alturaRestante * finalScale
                    placas.push(
                      <g key={`faixaA2-${indexFaixa}-topo`}>
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRestantePx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRestantePx}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                      </g>
                    )
                  }
                }
              }
              
              // Desenhar todas as faixas e aplicar espelhamento horizontal
              for (let i = 0; i < numFaixas; i++) {
                desenharFaixaA2(i)
              }
              
              // Aplicar transformação de espelhamento horizontal (flip 180°)
              return (
                <g transform={`scale(-1, 1) translate(-${finalWidth}, 0)`}>
                  {placas}
                </g>
              )
            })()}
            
            {/* Placas Drywall - Lado B2 (rotação 180° vertical do lado A2) */}
            {ladoAtivo === 'B2' && parede.especificacoes.chapasPorLado === 'quadruplo' && (() => {
              const placas: JSX.Element[] = []
              
              // Usar exatamente a mesma lógica do Lado A2 (que já é B espelhado horizontalmente)
              const PLACA_LARGURA = 1.2 // metros - sempre 1,20m
              const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa) // 1,80m ou 2,40m
              
              // Converter para pixels
              const placaLarguraPx = PLACA_LARGURA * finalScale
              const placaAlturaPx = PLACA_ALTURA * finalScale
              
              // LÓGICA IDÊNTICA AO LADO A2 (que é idêntica ao B)
              const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
              const sobraAltura = parede.altura - (placasInteirasNaAltura * PLACA_ALTURA)
              
              // ESTRATÉGIA IDÊNTICA AO LADO A2
              let recorteDesencontro = 0
              
              if (sobraAltura >= 0.6) {
                recorteDesencontro = sobraAltura
              } else if (sobraAltura === 0 && placasInteirasNaAltura >= 2) {
                recorteDesencontro = PLACA_ALTURA / 2
              } else if (sobraAltura > 0 && sobraAltura < 0.6) {
                recorteDesencontro = sobraAltura
              } else {
                recorteDesencontro = 0
              }
              
              const numFaixas = Math.ceil(parede.largura / PLACA_LARGURA)
              
              // Função IDÊNTICA AO LADO A2
              const desenharFaixaB2 = (indexFaixa: number) => {
                const xFaixa = indexFaixa * PLACA_LARGURA
                const larguraRestante = parede.largura - xFaixa
                const larguraFaixa = Math.min(PLACA_LARGURA, larguraRestante)
                
                if (larguraFaixa <= 0) return
                
                const xFaixaPx = xFaixa * finalScale
                const larguraFaixaPx = larguraFaixa * finalScale
                
                // LÓGICA IDÊNTICA: Faixas ímpares (0, 2, 4...): recorte embaixo
                const ehFaixaImpar = indexFaixa % 2 === 0
                
                if (ehFaixaImpar && recorteDesencontro > 0) {
                  // FAIXA ÍMPAR: recorte embaixo + placas inteiras encima
                  
                  // Recorte embaixo
                  const alturaRecortePx = recorteDesencontro * finalScale
                  placas.push(
                    <g key={`faixaB2-${indexFaixa}-embaixo`}>
                      <rect
                        x={xFaixaPx}
                        y={finalHeight - alturaRecortePx}
                        width={larguraFaixaPx}
                        height={alturaRecortePx}
                        fill="url(#chapa-pattern)"
                        stroke="#6b7280"
                        strokeWidth="1"
                        opacity="0.8"
                      />
                      <rect
                        x={xFaixaPx}
                        y={finalHeight - alturaRecortePx}
                        width={larguraFaixaPx}
                        height={alturaRecortePx}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeDasharray="6,3"
                      />
                    </g>
                  )
                  
                  // Placas inteiras encima
                  const alturaRestante = parede.altura - recorteDesencontro
                  let yAtual = 0
                  let placaIndex = 0
                  let alturaProcessada = 0
                  
                  while (alturaProcessada < alturaRestante) {
                    const alturaPlaca = Math.min(PLACA_ALTURA, alturaRestante - alturaProcessada)
                    const alturaPlacaPx = alturaPlaca * finalScale
                    
                    placas.push(
                      <g key={`faixaB2-${indexFaixa}-encima-${placaIndex}`}>
                        <rect
                          x={xFaixaPx}
                          y={yAtual}
                          width={larguraFaixaPx}
                          height={alturaPlacaPx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                        <rect
                          x={xFaixaPx}
                          y={yAtual}
                          width={larguraFaixaPx}
                          height={alturaPlacaPx}
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="6,3"
                        />
                      </g>
                    )
                    
                    yAtual += alturaPlacaPx
                    alturaProcessada += alturaPlaca
                    placaIndex++
                  }
                } else {
                  // FAIXA PAR ou sem desencontro: placas inteiras embaixo + recorte encima
                  let alturaColocada = 0
                  let placaIndex = 0
                  
                  const alturaDisponivel = parede.altura - recorteDesencontro
                  while (alturaColocada + PLACA_ALTURA <= alturaDisponivel && alturaDisponivel > 0) {
                    const yPlaca = finalHeight - (alturaColocada + PLACA_ALTURA) * finalScale
                    
                    placas.push(
                      <g key={`faixaB2-${indexFaixa}-embaixo-${placaIndex}`}>
                        <rect
                          x={xFaixaPx}
                          y={yPlaca}
                          width={larguraFaixaPx}
                          height={placaAlturaPx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                        <rect
                          x={xFaixaPx}
                          y={yPlaca}
                          width={larguraFaixaPx}
                          height={placaAlturaPx}
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="6,3"
                        />
                      </g>
                    )
                    
                    alturaColocada += PLACA_ALTURA
                    placaIndex++
                  }
                  
                  // Recorte encima (se houver desencontro)
                  if (recorteDesencontro > 0) {
                    const alturaRecortePx = recorteDesencontro * finalScale
                    placas.push(
                      <g key={`faixaB2-${indexFaixa}-encima`}>
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRecortePx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRecortePx}
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="6,3"
                        />
                      </g>
                    )
                  }
                  
                  // Se não há desencontro mas sobra altura, preencher com recorte no topo
                  const alturaRestante = parede.altura - alturaColocada
                  if (alturaRestante > 0 && recorteDesencontro === 0) {
                    const alturaRestantePx = alturaRestante * finalScale
                    placas.push(
                      <g key={`faixaB2-${indexFaixa}-topo`}>
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRestantePx}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                        <rect
                          x={xFaixaPx}
                          y={0}
                          width={larguraFaixaPx}
                          height={alturaRestantePx}
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="6,3"
                        />
                      </g>
                    )
                  }
                }
              }
              
              // Desenhar todas as faixas
              for (let i = 0; i < numFaixas; i++) {
                desenharFaixaB2(i)
              }
              
              // Aplicar primeiro espelhamento horizontal (como A2) e depois rotação vertical 180°
              return (
                <g transform={`scale(-1, -1) translate(-${finalWidth}, -${finalHeight})`}>
                  {placas}
                </g>
              )
            })()}
            
            {/* Vãos (portas e janelas) */}
            {vaos.map((vao, index) => (
              <g key={index}>
                {/* Vão */}
                <rect 
                  x={vao.x} 
                  y={vao.y} 
                  width={vao.width} 
                  height={vao.height}
                  fill="white"
                  stroke={vao.tipo === 'janela' ? "#2563eb" : vao.tipo === 'passagem' ? "#16a34a" : "#dc2626"} 
                  strokeWidth="2"
                  strokeDasharray={vao.tipo === 'janela' ? "5,5" : vao.tipo === 'passagem' ? "3,3" : "none"}
                />
                
                {/* Label do vão */}
                <text 
                  x={vao.x + vao.width / 2} 
                  y={vao.y + vao.height / 2} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fontSize="10" 
                  fill={vao.tipo === 'janela' ? "#2563eb" : vao.tipo === 'passagem' ? "#16a34a" : "#dc2626"}
                  fontWeight="bold"
                >
                  {vao.label}
                </text>
              </g>
            ))}
            

            {/* Parafusos nas guias (piso e teto) */}
            {(() => {
              const parafusosGuias: JSX.Element[] = []
              const PLACA_LARGURA_GUIA = 1.2 // 1,20m por faixa
              // Padrão de parafusos por faixa de 1,20m: 0,20 - 0,40 - [pula 0,60] - 0,80 - 1,00
              const padraoParafusosPorFaixa = [0.20, 0.40, 0.80, 1.00]
              
              const numFaixasGuia = Math.ceil(parede.largura / PLACA_LARGURA_GUIA)
              
              for (let faixa = 0; faixa < numFaixasGuia; faixa++) {
                const inicioFaixa = faixa * PLACA_LARGURA_GUIA
                const fimFaixa = Math.min((faixa + 1) * PLACA_LARGURA_GUIA, parede.largura)
                
                padraoParafusosPorFaixa.forEach((posicaoRelativa, index) => {
                  const xParafuso = (inicioFaixa + posicaoRelativa) * finalScale
                  
                  // Verificar se está dentro dos limites desta faixa e da parede
                  if (xParafuso <= fimFaixa * finalScale && xParafuso <= finalWidth) {
                    // Verificar se não está dentro de um vão (porta ou janela)
                    let dentroDeVaoPiso = false
                    let dentroDeVaoTeto = false
                    
                    for (const vao of vaos) {
                      // Para guia do piso - verificar se está na altura da porta
                      if (vao.tipo === 'porta' || vao.tipo === 'passagem') {
                        if (xParafuso >= vao.x && xParafuso <= vao.x + vao.width) {
                          dentroDeVaoPiso = true
                        }
                      }
                      
                      // Para guia do teto - verificar se está na área das janelas altas
                      if (vao.tipo === 'janela' && parede.vaos.janelas.altura > 2.1) {
                        if (xParafuso >= vao.x && xParafuso <= vao.x + vao.width) {
                          dentroDeVaoTeto = true
                        }
                      }
                    }
                    
                    // Parafuso na guia do PISO
                    if (!dentroDeVaoPiso) {
                      parafusosGuias.push(
                        <circle
                          key={`parafuso-guia-piso-${faixa}-${index}`}
                          cx={xParafuso}
                          cy={finalHeight - (0.025 * finalScale)} // 2,5cm do piso
                          r={(0.005 * finalScale)} // 0.5cm de raio
                          fill="#374151" // cinza padrão
                          stroke="#1f2937"
                          strokeWidth={0.5}
                        />
                      )
                    }
                    
                    // Parafuso na guia do TETO
                    if (!dentroDeVaoTeto) {
                      parafusosGuias.push(
                        <circle
                          key={`parafuso-guia-teto-${faixa}-${index}`}
                          cx={xParafuso}
                          cy={0.025 * finalScale} // 2,5cm do teto
                          r={(0.005 * finalScale)} // 0.5cm de raio
                          fill="#374151" // cinza padrão
                          stroke="#1f2937"
                          strokeWidth={0.5}
                        />
                      )
                    }
                  }
                })
              }
              
              return parafusosGuias
            })()}

            {/* SISTEMA COMPLETO PARA LADO A - FAIXAS ÍMPARES E PARES COM SUBDIVISÃO */}
            {ladoAtivo === 'A' && (() => {
              const parafusosLadoA: JSX.Element[] = []
              const numFaixas = Math.ceil(parede.largura / 1.2)
              
              // FUNÇÃO PARA DISTRIBUIR PARAFUSOS EM UM SEGMENTO
              const distribuirParafusosSegmento = (yInicio: number, yFim: number, xPixel: number, chave: string) => {
                // PARAFUSOS FIXOS: base e topo do segmento
                const posicoes = [yInicio + 0.05, yFim - 0.05]
                
                // SUBDIVIR SE NECESSÁRIO
                const distanciaTotal = (yFim - 0.05) - (yInicio + 0.05)
                if (distanciaTotal > 0.30) { // Mais de 30cm
                  const numDivisoes = Math.ceil(distanciaTotal / 0.30)
                  const espacamento = distanciaTotal / numDivisoes
                  
                  // Adicionar parafusos intermediários
                  for (let i = 1; i < numDivisoes; i++) {
                    const yIntermediario = (yInicio + 0.05) + (i * espacamento)
                    posicoes.push(yIntermediario)
                  }
                }
                
                // CRIAR OS PARAFUSOS
                posicoes.forEach((y, index) => {
                  if (y >= 0 && y <= parede.altura) {
                    const yPixel = finalHeight - (y * finalScale)
                    parafusosLadoA.push(
                      <circle
                        key={`parafuso-${chave}-${index}`}
                        cx={xPixel}
                        cy={yPixel}
                        r={(0.005 * finalScale)}
                        fill="#374151"
                        stroke="#1f2937"
                        strokeWidth={0.5}
                      />
                    )
                  }
                })
              }
              
              // FUNÇÃO PARA CALCULAR JUNTAS (LADO A COM DESENCONTRO)
              const calcularJuntasHorizontaisPorFaixa = (numeroFaixa: number) => {
                const juntas = []
                const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa) // 1.80 ou 2.40
                const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
                const sobraAltura = parede.altura - (placasInteirasNaAltura * PLACA_ALTURA)
                
                // LADO A: DESENCONTRO ENTRE FAIXAS PARES E ÍMPARES
                if (numeroFaixa % 2 === 0) {
                  // FAIXA ÍMPAR (0, 2, 4...): placa inteira embaixo + recorte em cima
                  // Junta na altura da placa inteira
                  juntas.push(PLACA_ALTURA) // Ex: 1.80m
                  
                  // Se há mais placas acima
                  for (let nivel = 2; nivel <= placasInteirasNaAltura; nivel++) {
                    const alturaJunta = nivel * PLACA_ALTURA
                    if (alturaJunta < parede.altura) {
                      juntas.push(alturaJunta)
                    }
                  }
                } else {
                  // FAIXA PAR (1, 3, 5...): recorte embaixo + placa inteira em cima
                  // Junta na altura do recorte (sobra)
                  if (sobraAltura > 0) {
                    juntas.push(sobraAltura) // Ex: 0.90m
                  }
                  
                  // Juntas das placas inteiras acima do recorte
                  for (let nivel = 1; nivel <= placasInteirasNaAltura; nivel++) {
                    const alturaJunta = sobraAltura + (nivel * PLACA_ALTURA)
                    if (alturaJunta < parede.altura) {
                      juntas.push(alturaJunta)
                    }
                  }
                }
                
                return juntas
              }

              // Para cada faixa individual
              for (let faixa = 0; faixa < numFaixas; faixa++) {
                const inicioFaixa = faixa * 1.2
                const fimFaixa = Math.min((faixa + 1) * 1.2, parede.largura)
                
                // USAR A FUNÇÃO REAL DE CÁLCULO DE JUNTAS
                const juntasHorizontais = calcularJuntasHorizontaisPorFaixa(faixa)
                
                // BORDA ESQUERDA DA FAIXA (2cm da borda esquerda da faixa)
                const xEsquerda = inicioFaixa + 0.02
                if (xEsquerda <= parede.largura) {
                  const xEsquerdaPixel = xEsquerda * finalScale
                  const segmentos = [0, ...juntasHorizontais, parede.altura]
                  
                  for (let i = 0; i < segmentos.length - 1; i++) {
                    distribuirParafusosSegmento(
                      segmentos[i], 
                      segmentos[i + 1], 
                      xEsquerdaPixel, 
                      `faixa-${faixa}-esquerda-${i}`
                    )
                  }
                }
                
                // BORDA DIREITA DA FAIXA (2cm da borda direita da faixa)
                const xDireita = fimFaixa - 0.02
                if (xDireita > inicioFaixa && xDireita <= parede.largura) {
                  const xDireitaPixel = xDireita * finalScale
                  const segmentos = [0, ...juntasHorizontais, parede.altura]
                  
                  for (let i = 0; i < segmentos.length - 1; i++) {
                    distribuirParafusosSegmento(
                      segmentos[i], 
                      segmentos[i + 1], 
                      xDireitaPixel, 
                      `faixa-${faixa}-direita-${i}`
                    )
                  }
                }
                
                // MEIO DA FAIXA (onde passa o montante intermediário)
                const xMeio = inicioFaixa + 0.60 // Meio da faixa de 1,20m
                if (xMeio <= parede.largura && (fimFaixa - inicioFaixa) >= 1.0) { // Só se a faixa tiver pelo menos 1m
                  const xMeioPixel = xMeio * finalScale
                  const segmentos = [0, ...juntasHorizontais, parede.altura]
                  
                  for (let i = 0; i < segmentos.length - 1; i++) {
                    distribuirParafusosSegmento(
                      segmentos[i], 
                      segmentos[i + 1], 
                      xMeioPixel, 
                      `faixa-${faixa}-meio-${i}`
                    )
                  }
                }
              }
              
              return parafusosLadoA
            })()}



            {/* Parafusos periféricos das bordas e entorno dos recortes */}
            {ladoAtivo !== 'A' && (() => {
              const parafusosPeriferia: JSX.Element[] = []
              const PLACA_LARGURA = 1.2
              const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa)
              const MARGEM_BASE = 0.05 // 5cm da base
              const MARGEM_JUNTA = 0.05 // 5cm da junta horizontal
              const ESPACAMENTO_MAXIMO = 0.30 // 30cm máximo entre parafusos
              
              // Função para calcular posições das juntas horizontais específicas para cada faixa
              const calcularJuntasHorizontaisPorFaixa = (numeroFaixa: number) => {
                const juntas = []
                
                if ((ladoAtivo as string) === 'A' || (ladoAtivo as string) === 'A2' || parede.especificacoes.chapasPorLado === 'simples') {
                  // LADO A/A2: CÓDIGO COPIADO 100% DO LADO B - SEM DESENCONTRO
                  const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
                  const sobraAltura = parede.altura - (placasInteirasNaAltura * PLACA_ALTURA)
                  
                  // LADO A = SEM DESENCONTRO (todas as faixas iguais)
                  let recorteDesencontro = 0 // SEMPRE ZERO para Lado A
                  
                  // LÓGICA IDÊNTICA AO LADO B - MAS SEM DESENCONTRO
                  const ehFaixaImpar = false // LADO A nunca tem desencontro, então sempre false
                  
                  if (ehFaixaImpar && recorteDesencontro > 0) {
                    // Esta seção nunca executa no Lado A
                    juntas.push(recorteDesencontro)
                    
                    const alturaRestante = parede.altura - recorteDesencontro
                    const placasAcima = Math.floor(alturaRestante / PLACA_ALTURA)
                    for (let nivel = 1; nivel <= placasAcima; nivel++) {
                      const alturaJunta = recorteDesencontro + (nivel * PLACA_ALTURA)
                      if (alturaJunta < parede.altura) {
                        juntas.push(alturaJunta)
                      }
                    }
                  } else {
                    // LADO A sempre executa ESTA seção (igual faixas pares do Lado B)
                    // Juntas das placas inteiras
                    for (let nivel = 1; nivel <= placasInteirasNaAltura; nivel++) {
                      const alturaJunta = nivel * PLACA_ALTURA
                      if (alturaJunta < parede.altura) {
                        juntas.push(alturaJunta)
                      }
                    }
                  }
                  
                } else {
                  // LADO B/B2: Juntas desencontradas - DIFERENTES ENTRE FAIXAS ÍMPARES E PARES
                  const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
                  const sobraAltura = parede.altura - (placasInteirasNaAltura * PLACA_ALTURA)
                  
                  let recorteDesencontro = 0
                  if (sobraAltura >= 0.6) {
                    recorteDesencontro = sobraAltura
                  } else if (sobraAltura === 0 && placasInteirasNaAltura >= 2) {
                    recorteDesencontro = PLACA_ALTURA / 2
                  } else if (sobraAltura > 0 && sobraAltura < 0.6) {
                    recorteDesencontro = sobraAltura
                  }
                  
                  const ehFaixaImpar = numeroFaixa % 2 === 0 // faixas 0, 2, 4... (ímpares na contagem)
                  
                  if (ehFaixaImpar && recorteDesencontro > 0) {
                    // FAIXA ÍMPAR: recorte embaixo + placas inteiras encima
                    // Junta baixa do desencontro
                    juntas.push(recorteDesencontro)
                    
                    // Juntas das placas inteiras acima
                    const alturaRestante = parede.altura - recorteDesencontro
                    const placasAcima = Math.floor(alturaRestante / PLACA_ALTURA)
                    for (let nivel = 1; nivel <= placasAcima; nivel++) {
                      const alturaJunta = recorteDesencontro + (nivel * PLACA_ALTURA)
                      if (alturaJunta < parede.altura) {
                        juntas.push(alturaJunta)
                      }
                    }
                  } else {
                    // FAIXA PAR ou sem desencontro: placas inteiras embaixo + recorte encima
                    // Juntas das placas inteiras
                    for (let nivel = 1; nivel <= placasInteirasNaAltura; nivel++) {
                      const alturaJunta = nivel * PLACA_ALTURA
                      if (alturaJunta < parede.altura) {
                        juntas.push(alturaJunta)
                      }
                    }
                    
                    // Se há recorte encima (desencontro), não adiciona junta no topo
                    // porque o recorte fica encima
                  }
                }
                
                return juntas
              }
              
              // Função para distribuir parafusos em um segmento vertical
              const distribuirParafusosSegmento = (alturaInicio: number, alturaFim: number, xPixel: number, chave: string) => {
                const alturaSegmento = alturaFim - alturaInicio
                
                
                // Sempre colocar parafusos a 5cm do início e fim do segmento
                const posicoes = [alturaInicio + MARGEM_BASE]
                
                // Se o segmento for grande o suficiente, colocar parafuso no fim
                if (alturaSegmento > MARGEM_BASE * 2) {
                  posicoes.push(alturaFim - MARGEM_BASE)
                }
                
                // Calcular quantos parafusos intermediários são necessários
                const espacoIntermedio = alturaSegmento - (2 * MARGEM_BASE)
                if (espacoIntermedio > ESPACAMENTO_MAXIMO) {
                  const numIntermediarios = Math.floor(espacoIntermedio / ESPACAMENTO_MAXIMO)
                  const espacamentoReal = espacoIntermedio / (numIntermediarios + 1)
                  
                  for (let i = 1; i <= numIntermediarios; i++) {
                    posicoes.push(alturaInicio + MARGEM_BASE + (i * espacamentoReal))
                  }
                }
                
                // Ordenar posições e desenhar parafusos
                posicoes.sort((a, b) => a - b)
                posicoes.forEach((altura, index) => {
                  const yPixel = finalHeight - (altura * finalScale)
                  
                  // FORÇAR CRIAÇÃO DOS PARAFUSOS - REMOVER TODAS AS CONDIÇÕES BLOQUEADORAS
                  if (yPixel >= 0 && yPixel <= finalHeight) {
                    parafusosPeriferia.push(
                      <circle
                        key={`parafuso-periferia-${chave}-${index}`}
                        cx={xPixel}
                        cy={yPixel}
                        r={(0.005 * finalScale)}
                        fill="#374151"
                        stroke="#1f2937"
                        strokeWidth={0.5}
                      />
                    )
                  }
                })
              }
              
              // BORDAS DE CADA FAIXA DE CHAPA (1,20m) - COM JUNTAS ESPECÍFICAS POR FAIXA
              const numFaixas = Math.ceil(parede.largura / PLACA_LARGURA)
              
              for (let faixa = 0; faixa < numFaixas; faixa++) {
                const inicioFaixa = faixa * PLACA_LARGURA
                const fimFaixa = Math.min((faixa + 1) * PLACA_LARGURA, parede.largura)
                
                // Calcular juntas horizontais específicas para esta faixa
                const juntasHorizontaisFaixa = calcularJuntasHorizontaisPorFaixa(faixa)
                
                
                
                // BORDA ESQUERDA da faixa
                const xEsquerda = (inicioFaixa + 0.02) * finalScale // 2cm da borda esquerda da faixa
                const segmentosEsquerda = [0, ...juntasHorizontaisFaixa, parede.altura]
                for (let i = 0; i < segmentosEsquerda.length - 1; i++) {
                  distribuirParafusosSegmento(
                    segmentosEsquerda[i], 
                    segmentosEsquerda[i + 1], 
                    xEsquerda, 
                    `faixa-${faixa}-esquerda-${i}`
                  )
                }
                
                // BORDA DIREITA da faixa (só se não for a última faixa OU se for a última e tiver largura suficiente)
                const larguraFaixa = fimFaixa - inicioFaixa
                if (faixa < numFaixas - 1 || larguraFaixa > 0.1) { // Só se tiver pelo menos 10cm
                  const xDireita = (fimFaixa - 0.02) * finalScale // 2cm da borda direita da faixa
                  const segmentosDireita = [0, ...juntasHorizontaisFaixa, parede.altura]
                  for (let i = 0; i < segmentosDireita.length - 1; i++) {
                    distribuirParafusosSegmento(
                      segmentosDireita[i], 
                      segmentosDireita[i + 1], 
                      xDireita, 
                      `faixa-${faixa}-direita-${i}`
                    )
                  }
                }
                
                // MEIO DA FAIXA (onde passa o montante intermediário)
                const xMeio = inicioFaixa + 0.60 // Meio da faixa de 1,20m
                if (xMeio <= parede.largura && (fimFaixa - inicioFaixa) >= 1.0) { // Só se a faixa tiver pelo menos 1m
                  const xMeioPixel = xMeio * finalScale
                  const segmentosMeio = [0, ...juntasHorizontaisFaixa, parede.altura]
                  
                  for (let i = 0; i < segmentosMeio.length - 1; i++) {
                    distribuirParafusosSegmento(
                      segmentosMeio[i], 
                      segmentosMeio[i + 1], 
                      xMeioPixel, 
                      `faixa-${faixa}-meio-${i}`
                    )
                  }
                }
              }
              
              // ENTORNO DOS RECORTES (vãos)
              vaos.forEach((vao, vaoIndex) => {
                // Bordas verticais do vão (esquerda e direita)
                const alturaVao = vao.height / finalScale
                
                // Borda esquerda do vão
                distribuirParafusosSegmento(
                  0, 
                  alturaVao, 
                  vao.x - (0.05 * finalScale), 
                  `vao-esq-${vaoIndex}`
                )
                
                // Borda direita do vão
                distribuirParafusosSegmento(
                  0, 
                  alturaVao, 
                  vao.x + vao.width + (0.05 * finalScale), 
                  `vao-dir-${vaoIndex}`
                )
              })
              
              return parafusosPeriferia
            })()}

            {/* Linhas tracejadas das juntas dentro dos vãos */}
            {vaos.map((vao, vaoIndex) => {
              const linhasJuntas: JSX.Element[] = []
              
              // Calcular quais juntas verticais (faixas) passam pelo vão
              const PLACA_LARGURA = 1.2
              const numFaixas = Math.ceil(parede.largura / PLACA_LARGURA)
              const juntasVerticais = []
              
              for (let faixa = 1; faixa < numFaixas; faixa++) {
                const xJunta = (faixa * PLACA_LARGURA) * finalScale
                
                // Verificar se a junta passa pelo vão
                if (xJunta >= vao.x && xJunta <= vao.x + vao.width) {
                  juntasVerticais.push(xJunta)
                  linhasJuntas.push(
                    <line
                      key={`junta-vertical-${vaoIndex}-${faixa}`}
                      x1={xJunta}
                      y1={vao.y}
                      x2={xJunta}
                      y2={vao.y + vao.height}
                      stroke="#9ca3af"
                      strokeWidth="0.75"
                      strokeDasharray="3,2"
                      opacity="0.7"
                    />
                  )
                }
              }
              
              // Calcular juntas horizontais baseadas no lado ativo
              const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa)
              
              if ((ladoAtivo as string) === 'A' || (ladoAtivo as string) === 'A2' || parede.especificacoes.chapasPorLado === 'simples') {
                // LADO A/A2: Juntas padrão (múltiplos da altura da chapa)
                const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
                
                for (let nivel = 1; nivel <= placasInteirasNaAltura; nivel++) {
                  const yJunta = finalHeight - (nivel * PLACA_ALTURA * finalScale)
                  
                  // Verificar se a junta horizontal passa pelo vão
                  if (yJunta >= vao.y && yJunta <= vao.y + vao.height) {
                    // Desenhar apenas segmentos entre juntas verticais (não até bordas do vão)
                    if (juntasVerticais.length === 0) {
                      // Sem juntas verticais - desenhar linha completa
                      linhasJuntas.push(
                        <line
                          key={`junta-horizontal-${vaoIndex}-${nivel}`}
                          x1={vao.x}
                          y1={yJunta}
                          x2={vao.x + vao.width}
                          y2={yJunta}
                          stroke="#9ca3af"
                          strokeWidth="0.75"
                          strokeDasharray="3,2"
                          opacity="0.7"
                        />
                      )
                    } else {
                      // Com juntas verticais - desenhar APENAS segmentos entre elas
                      const juntasOrdenadas = juntasVerticais.sort((a, b) => a - b)
                      
                      // APENAS segmentos entre juntas verticais (não da borda até junta)
                      for (let i = 0; i < juntasOrdenadas.length - 1; i++) {
                        linhasJuntas.push(
                          <line
                            key={`junta-horizontal-${vaoIndex}-${nivel}-${i}`}
                            x1={juntasOrdenadas[i]}
                            y1={yJunta}
                            x2={juntasOrdenadas[i + 1]}
                            y2={yJunta}
                            stroke="#9ca3af"
                            strokeWidth="0.75"
                            strokeDasharray="3,2"
                            opacity="0.7"
                          />
                        )
                      }
                    }
                  }
                }
              } else {
                // LADO B/B2: Juntas desencontradas baseadas no padrão do desencontro
                const placasInteirasNaAltura = Math.floor(parede.altura / PLACA_ALTURA)
                const sobraAltura = parede.altura - (placasInteirasNaAltura * PLACA_ALTURA)
                
                // Calcular recorte de desencontro (lógica simplificada)
                let recorteDesencontro = 0
                if (sobraAltura >= 0.6) {
                  recorteDesencontro = sobraAltura
                } else if (sobraAltura === 0 && placasInteirasNaAltura >= 2) {
                  recorteDesencontro = PLACA_ALTURA / 2 // 0,90m para 1,80m ou 1,20m para 2,40m
                } else if (sobraAltura > 0 && sobraAltura < 0.6) {
                  recorteDesencontro = sobraAltura
                } else {
                  recorteDesencontro = 0
                }
                
                // Juntas do Lado B - padrão desencontrado
                if (recorteDesencontro > 0) {
                  // Junta baixa do desencontro
                  const yJuntaBaixa = finalHeight - (recorteDesencontro * finalScale)
                  if (yJuntaBaixa >= vao.y && yJuntaBaixa <= vao.y + vao.height) {
                    // Desenhar APENAS segmentos entre juntas verticais para junta baixa
                    if (juntasVerticais.length === 0) {
                      // Sem juntas verticais - desenhar linha completa
                      linhasJuntas.push(
                        <line
                          key={`junta-horizontal-baixa-${vaoIndex}`}
                          x1={vao.x}
                          y1={yJuntaBaixa}
                          x2={vao.x + vao.width}
                          y2={yJuntaBaixa}
                          stroke="#9ca3af"
                          strokeWidth="0.75"
                          strokeDasharray="3,2"
                          opacity="0.7"
                        />
                      )
                    } else {
                      // APENAS segmentos entre juntas verticais
                      const juntasOrdenadas = juntasVerticais.sort((a, b) => a - b)
                      
                      for (let i = 0; i < juntasOrdenadas.length - 1; i++) {
                        linhasJuntas.push(
                          <line
                            key={`junta-horizontal-baixa-${vaoIndex}-${i}`}
                            x1={juntasOrdenadas[i]}
                            y1={yJuntaBaixa}
                            x2={juntasOrdenadas[i + 1]}
                            y2={yJuntaBaixa}
                            stroke="#9ca3af"
                            strokeWidth="0.75"
                            strokeDasharray="3,2"
                            opacity="0.7"
                          />
                        )
                      }
                    }
                  }
                  
                  // Juntas das placas inteiras acima do desencontro
                  const alturaRestante = parede.altura - recorteDesencontro
                  const placasAcima = Math.floor(alturaRestante / PLACA_ALTURA)
                  
                  for (let nivel = 1; nivel <= placasAcima; nivel++) {
                    const yJunta = finalHeight - (recorteDesencontro + (nivel * PLACA_ALTURA)) * finalScale
                    
                    if (yJunta >= vao.y && yJunta <= vao.y + vao.height && yJunta >= 0) {
                      // Desenhar APENAS segmentos entre juntas verticais
                      if (juntasVerticais.length === 0) {
                        // Sem juntas verticais - desenhar linha completa
                        linhasJuntas.push(
                          <line
                            key={`junta-horizontal-acima-${vaoIndex}-${nivel}`}
                            x1={vao.x}
                            y1={yJunta}
                            x2={vao.x + vao.width}
                            y2={yJunta}
                            stroke="#9ca3af"
                            strokeWidth="0.75"
                            strokeDasharray="3,2"
                            opacity="0.7"
                          />
                        )
                      } else {
                        // APENAS segmentos entre juntas verticais
                        const juntasOrdenadas = juntasVerticais.sort((a, b) => a - b)
                        
                        for (let i = 0; i < juntasOrdenadas.length - 1; i++) {
                          linhasJuntas.push(
                            <line
                              key={`junta-horizontal-acima-${vaoIndex}-${nivel}-${i}`}
                              x1={juntasOrdenadas[i]}
                              y1={yJunta}
                              x2={juntasOrdenadas[i + 1]}
                              y2={yJunta}
                              stroke="#9ca3af"
                              strokeWidth="0.75"
                              strokeDasharray="3,2"
                              opacity="0.7"
                            />
                          )
                        }
                      }
                    }
                  }
                } else {
                  // Sem desencontro - usar juntas padrão segmentadas
                  for (let nivel = 1; nivel <= placasInteirasNaAltura; nivel++) {
                    const yJunta = finalHeight - (nivel * PLACA_ALTURA * finalScale)
                    
                    if (yJunta >= vao.y && yJunta <= vao.y + vao.height) {
                      // Desenhar APENAS segmentos entre juntas verticais
                      if (juntasVerticais.length === 0) {
                        // Sem juntas verticais - desenhar linha completa
                        linhasJuntas.push(
                          <line
                            key={`junta-horizontal-${vaoIndex}-${nivel}`}
                            x1={vao.x}
                            y1={yJunta}
                            x2={vao.x + vao.width}
                            y2={yJunta}
                            stroke="#9ca3af"
                            strokeWidth="0.75"
                            strokeDasharray="3,2"
                            opacity="0.7"
                          />
                        )
                      } else {
                        // APENAS segmentos entre juntas verticais
                        const juntasOrdenadas = juntasVerticais.sort((a, b) => a - b)
                        
                        for (let i = 0; i < juntasOrdenadas.length - 1; i++) {
                          linhasJuntas.push(
                            <line
                              key={`junta-horizontal-${vaoIndex}-${nivel}-${i}`}
                              x1={juntasOrdenadas[i]}
                              y1={yJunta}
                              x2={juntasOrdenadas[i + 1]}
                              y2={yJunta}
                              stroke="#9ca3af"
                              strokeWidth="0.75"
                              strokeDasharray="3,2"
                              opacity="0.7"
                            />
                          )
                        }
                      }
                    }
                  }
                }
              }
              
              return <g key={`juntas-vao-${vaoIndex}`}>{linhasJuntas}</g>
            })}
            
            {/* Cotas dimensionais */}
            
            {/* Cotas dimensionais */}
            
            {/* Cota horizontal (largura) */}
            <g>
              <line 
                x1="0" 
                y1={finalHeight + 20} 
                x2={finalWidth} 
                y2={finalHeight + 20}
                stroke="#374151" 
                strokeWidth="1"
              />
              <line x1="0" y1={finalHeight + 15} x2="0" y2={finalHeight + 25} stroke="#374151" strokeWidth="1"/>
              <line x1={finalWidth} y1={finalHeight + 15} x2={finalWidth} y2={finalHeight + 25} stroke="#374151" strokeWidth="1"/>
              <text 
                x={finalWidth / 2} 
                y={finalHeight + 35} 
                textAnchor="middle" 
                fontSize="12" 
                fill="#374151"
                fontWeight="bold"
              >
                {parede.largura}m
              </text>
            </g>
            
            {/* Cota vertical (altura) */}
            <g>
              <line 
                x1={finalWidth + 20} 
                y1="0" 
                x2={finalWidth + 20} 
                y2={finalHeight}
                stroke="#374151" 
                strokeWidth="1"
              />
              <line x1={finalWidth + 15} y1="0" x2={finalWidth + 25} y2="0" stroke="#374151" strokeWidth="1"/>
              <line x1={finalWidth + 15} y1={finalHeight} x2={finalWidth + 25} y2={finalHeight} stroke="#374151" strokeWidth="1"/>
              <text 
                x={finalWidth + 35} 
                y={finalHeight / 2} 
                textAnchor="middle" 
                fontSize="12" 
                fill="#374151"
                fontWeight="bold"
                transform={`rotate(90, ${finalWidth + 35}, ${finalHeight / 2})`}
              >
                {parede.altura}m
              </text>
            </g>
            
          </g>
        </svg>
      </div>
      
      {/* Legenda */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-400"></div>
          <span className="text-gray-600">Chapas Drywall</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-700 rounded-full border border-gray-900"></div>
          <span className="text-gray-600">Parafusos</span>
        </div>
        {parede.especificacoes.tratamentoAcustico !== 'nenhum' && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-200"></div>
            <span className="text-gray-600">
              {parede.especificacoes.tratamentoAcustico === 'la_pet' && 'Lã de Pet'}
              {parede.especificacoes.tratamentoAcustico === 'la_vidro' && 'Lã de Vidro'}
              {parede.especificacoes.tratamentoAcustico === 'la_rocha' && 'Lã de Rocha'}
            </span>
          </div>
        )}
        {(parede.vaos.porta.tipo !== 'nenhuma' || parede.vaos.janelas.quantidade > 0) && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-red-600"></div>
            <span className="text-gray-600">Vãos</span>
          </div>
        )}
      </div>
      
      {/* Informações técnicas */}
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <strong>Placas:</strong> 1,20×{parede.especificacoes.tipoChapa}m (Chapeamento {parede.especificacoes.chapasPorLado})
          </div>
          <div>
            <strong>Espessura total:</strong> {(() => {
              const montante = parseInt(parede.especificacoes.tipoMontante)
              let chapas = 0
              switch (parede.especificacoes.chapasPorLado) {
                case 'simples': chapas = 1; break
                case 'duplo': chapas = 2; break  
                case 'quadruplo': chapas = 4; break
                default: chapas = 1
              }
              return montante + (chapas * 12.5 * 2)
            })()}mm
          </div>
          {parede.vaos.porta.tipo !== 'nenhuma' && (
            <div>
              <strong>{parede.vaos.porta.tipo === 'passagem' ? 'Passagem' : 'Porta'}:</strong> {parede.vaos.porta.largura}×{parede.vaos.porta.altura}m
            </div>
          )}
          {parede.vaos.janelas.quantidade > 0 && (
            <div>
              <strong>Janelas:</strong> {parede.vaos.janelas.quantidade}x ({parede.vaos.janelas.largura}×{parede.vaos.janelas.altura}m total)
            </div>
          )}
          <div>
            <strong>Amarração:</strong> {parede.especificacoes.chapasPorLado === 'duplo' || parede.especificacoes.chapasPorLado === 'quadruplo' ? 'Dupla desencontrada (altura + largura)' : 'Juntas desencontradas (técnica adequada)'}
          </div>
        </div>
      </div>
    </div>
  )
}