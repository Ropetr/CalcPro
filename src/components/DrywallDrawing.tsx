'use client'

import React from 'react'
import { MedidaParede } from '@/lib/calculators/divisoria-drywall/types'

interface DrywallDrawingProps {
  parede: MedidaParede
  scale?: number
}

export default function DrywallDrawing({ parede, scale = 50 }: DrywallDrawingProps) {
  // Dimensões em pixels (escala: 1m = 50px por padrão)
  const larguraPx = parede.largura * scale
  const alturaPx = parede.altura * scale
  
  // Limitar tamanho máximo para não quebrar o layout
  const maxWidth = 600
  const maxHeight = 400
  let finalScale = scale
  
  if (larguraPx > maxWidth || alturaPx > maxHeight) {
    const scaleX = maxWidth / parede.largura
    const scaleY = maxHeight / parede.altura
    finalScale = Math.min(scaleX, scaleY)
  }
  
  const finalWidth = parede.largura * finalScale
  const finalHeight = parede.altura * finalScale
  const svgWidth = finalWidth + 100 // Margem para cotas
  const svgHeight = finalHeight + 100 // Margem para cotas

  // Calcular posições dos montantes (espaçamento de 60cm)
  const montantes = []
  const espacamentoMontante = 0.6 * finalScale // 60cm em pixels
  
  for (let x = 0; x <= finalWidth; x += espacamentoMontante) {
    montantes.push(x)
  }
  // Adicionar montante na extremidade se não coincide
  if (montantes[montantes.length - 1] < finalWidth - 10) {
    montantes.push(finalWidth)
  }

  // Calcular vãos
  const vaos = []
  
  // Porta/Passagem - sempre à esquerda com 0,10m de distância da borda
  if (parede.vaos.porta.tipo !== 'nenhuma' && parede.vaos.porta.largura && parede.vaos.porta.altura) {
    const portaLargura = parede.vaos.porta.largura * finalScale
    const portaAltura = parede.vaos.porta.altura * finalScale
    const distanciaBorda = 0.10 * finalScale // 0,10m da borda esquerda
    const posX = distanciaBorda
    
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
    
    // Se há porta, reduzir espaço disponível
    if (parede.vaos.porta.tipo !== 'nenhuma' && parede.vaos.porta.largura) {
      const portaLargura = parede.vaos.porta.largura * finalScale
      const distanciaBorda = 0.10 * finalScale
      const espacoOcupadoPorPorta = distanciaBorda + portaLargura + (0.20 * finalScale) // 0,20m de distância após a porta
      
      espacoInicial = espacoOcupadoPorPorta
      larguraDisponivel = finalWidth - espacoOcupadoPorPorta
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
      
      <div className="overflow-x-auto">
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
              fill={parede.especificacoes.incluirIsolamento ? "url(#isolamento-pattern)" : "#ffffff"}
              stroke="#6b7280" 
              strokeWidth="2"
            />
            
            {/* Guias (perfis horizontais - piso e teto) */}
            <rect 
              x="0" 
              y="0" 
              width={finalWidth} 
              height="8"
              fill="#374151"
              opacity="0.8"
            />
            <rect 
              x="0" 
              y={finalHeight - 8} 
              width={finalWidth} 
              height="8"
              fill="#374151"
              opacity="0.8"
            />
            
            {/* Montantes (perfis verticais) */}
            {montantes.map((x, index) => (
              <rect 
                key={index}
                x={x - 3} 
                y="8" 
                width="6" 
                height={finalHeight - 16}
                fill="#374151"
                opacity="0.6"
              />
            ))}
            
            {/* Placas Drywall - Lado Esquerdo - ALGORITMO DE OTIMIZAÇÃO */}
            {(() => {
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
            
            {/* Placas Drywall - Lado Direito (se dupla ou quadrupla) - SIMPLES SEM AMARRAÇÃO */}
            {(parede.especificacoes.chapasPorLado === 'duplo' || parede.especificacoes.chapasPorLado === 'quadruplo') && (() => {
              const placas = []
              
              // Dimensões da placa de gesso
              const PLACA_LARGURA = 1.2 // metros - sempre 1,20m
              const PLACA_ALTURA = parseFloat(parede.especificacoes.tipoChapa) // 1,80m ou 2,40m
              
              // Converter para pixels
              const placaLarguraPx = PLACA_LARGURA * finalScale
              const placaAlturaPx = PLACA_ALTURA * finalScale
              
              // Calcular quantas fileiras e colunas precisamos
              const numFileiras = Math.ceil(parede.altura / PLACA_ALTURA)
              const numColunas = Math.ceil(parede.largura / PLACA_LARGURA)
              
              // Desenhar grade simples de placas - SEM DESLOCAMENTO
              for (let fileira = 0; fileira < numFileiras; fileira++) {
                for (let coluna = 0; coluna < numColunas; coluna++) {
                  const xPlaca = coluna * placaLarguraPx
                  const yPlaca = fileira * placaAlturaPx
                  
                  // Calcular tamanho real da placa (pode ser cortada nas bordas)
                  const larguraPlaca = Math.min(placaLarguraPx, finalWidth - xPlaca)
                  const alturaPlaca = Math.min(placaAlturaPx, finalHeight - yPlaca)
                  
                  // Só desenhar se a placa tem tamanho válido
                  if (larguraPlaca > 0 && alturaPlaca > 0) {
                    placas.push(
                      <g key={`placa-direita-${fileira}-${coluna}`}>
                        {/* Corpo da placa */}
                        <rect
                          x={xPlaca + finalWidth + 20}
                          y={yPlaca}
                          width={larguraPlaca}
                          height={alturaPlaca}
                          fill="url(#chapa-pattern)"
                          stroke="#6b7280"
                          strokeWidth="1"
                        />
                        
                        {/* Contorno da placa */}
                        <rect
                          x={xPlaca + finalWidth + 20}
                          y={yPlaca}
                          width={larguraPlaca}
                          height={alturaPlaca}
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                      </g>
                    )
                  }
                }
              }
              
              return placas
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
          <div className="w-4 h-4 bg-gray-700"></div>
          <span className="text-gray-600">Perfis Metálicos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-400"></div>
          <span className="text-gray-600">Chapas Drywall</span>
        </div>
        {parede.especificacoes.incluirIsolamento && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-200"></div>
            <span className="text-gray-600">Isolamento</span>
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
            <strong>Estrutura:</strong> Montantes a cada 60cm
          </div>
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
            <strong>Amarração:</strong> Juntas desencontradas (técnica adequada)
          </div>
        </div>
      </div>
    </div>
  )
}