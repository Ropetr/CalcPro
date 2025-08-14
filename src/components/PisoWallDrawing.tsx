import React, { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { MedidaPisoWall, EspecificacaoPainel } from '@/lib/calculators/piso-wall/types'

interface PisoWallDrawingProps {
  medidas: MedidaPisoWall[]
  especificacao: EspecificacaoPainel
  scale?: number
  numeroAmbiente?: number
  showDimensions?: boolean
  apoios?: {
    distancia: number // distância entre apoios em metros
    mostrar: boolean  // se deve desenhar os apoios
  }
}

export default function PisoWallDrawing({ 
  medidas, 
  especificacao, 
  scale = 1,
  numeroAmbiente = 1,
  showDimensions = true,
  apoios = { distancia: 1.25, mostrar: false }
}: PisoWallDrawingProps) {
  const [zoomLevel, setZoomLevel] = useState(250)
  
  if (!medidas || medidas.length === 0) return null
  
  // Usar primeira medida como referência
  const medida = medidas[0]
  const larguraMedida = medida.largura
  const comprimentoMedida = medida.comprimento
  
  // Dimensões do painel em metros
  const painelLargura = especificacao.largura / 1000 // 1.2m
  const painelComprimento = especificacao.comprimento / 1000 // 2.5m ou 3.0m
  
  // Escala para desenho (1 metro = 40 pixels base)
  const pixelsPorMetro = 40 * scale * (zoomLevel / 100)
  
  // Calcular quantos painéis precisamos em cada direção
  const paineisLargura = Math.ceil(larguraMedida / painelLargura)
  const paineisComprimento = Math.ceil(comprimentoMedida / painelComprimento)
  
  // Dimensões do desenho (com margem para cotas)
  const margem = 60
  const svgLargura = paineisLargura * painelLargura * pixelsPorMetro
  const svgComprimento = paineisComprimento * painelComprimento * pixelsPorMetro
  
  // Área do ambiente
  const areaAmbiente = larguraMedida * comprimentoMedida
  
  // Controles de zoom (250% a 300%)
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 300))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 250))
  const handleZoomReset = () => setZoomLevel(250)
  
  // Função para renderizar uma chapa individual com amarração intercalada
  const renderChapa = (x: number, y: number, largura: number, comprimento: number, chapaIndex: number, linha: number, coluna: number) => {
    const posX = x * pixelsPorMetro
    const posY = y * pixelsPorMetro
    const width = largura * pixelsPorMetro
    const height = comprimento * pixelsPorMetro
    
    // Determinar se é uma posição intercalada (amarração)
    const isIntercalada = (linha + coluna) % 2 === 1
    
    return (
      <g key={`chapa-${chapaIndex}`}>
        {/* Chapa principal */}
        <rect
          x={posX}
          y={posY}
          width={width}
          height={height}
          fill="none"
          stroke="#374151"
          strokeWidth="2"
        />
        
        {/* Preenchimento da chapa com cor diferente para intercaladas */}
        <rect
          x={posX + 1}
          y={posY + 1}
          width={width - 2}
          height={height - 2}
          fill={isIntercalada ? "#FEF3C7" : "#F3F4F6"}
          opacity="0.4"
        />
        
        {/* Bordas do painel sempre visíveis */}
        <g stroke="#374151" strokeWidth="1">
          {/* Borda superior */}
          <line
            x1={posX}
            y1={posY}
            x2={posX + width}
            y2={posY}
          />
          {/* Borda inferior */}
          <line
            x1={posX}
            y1={posY + height}
            x2={posX + width}
            y2={posY + height}
          />
          {/* Borda esquerda */}
          <line
            x1={posX}
            y1={posY}
            x2={posX}
            y2={posY + height}
          />
          {/* Borda direita */}
          <line
            x1={posX + width}
            y1={posY}
            x2={posX + width}
            y2={posY + height}
          />
        </g>
        
        {/* Linha de junção para mostrar amarração (tracejado interno) */}
        <g stroke="#DC2626" strokeWidth="1" strokeDasharray="3,2">
          {/* Linha de junção horizontal se não é primeira linha */}
          {linha > 0 && (
            <line
              x1={posX}
              y1={posY}
              x2={posX + width}
              y2={posY}
            />
          )}
          {/* Linha de junção vertical se não é primeira coluna */}
          {coluna > 0 && (
            <line
              x1={posX}
              y1={posY}
              x2={posX}
              y2={posY + height}
            />
          )}
        </g>
        
        
        {/* Número da chapa centralizado */}
        {(() => {
          const numero = chapaIndex + 1
          const podeRenderizar = (width > 25 && height > 15) || (width > 15 && height > 25) // Flexível para peças pequenas
          console.log(`Painel ${numero}: width=${width.toFixed(1)}, height=${height.toFixed(1)}, renderizar=${podeRenderizar}`)
          
          return podeRenderizar ? (
            <g>
              <circle
                cx={posX + width/2}
                cy={posY + height/2}
                r={Math.max(8, Math.min(18, Math.min(width, height)/6))}
                fill="white"
                stroke="#374151"
                strokeWidth="1.5"
                opacity="0.95"
              />
              <text
                x={posX + width/2}
                y={posY + height/2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={Math.max(8, Math.min(14, Math.min(width, height)/8))}
                fill="#374151"
                fontWeight="700"
              >
                {numero}
              </text>
            </g>
          ) : null
        })()}
        
      </g>
    )
  }
  
  // Renderizar apoios (linhas pontilhadas no sentido da largura, 7cm cada)
  const renderApoios = () => {
    if (!apoios.mostrar) return null

    const linhasApoios = []
    const distanciaApoios = apoios.distancia
    const comprimentoApoio = 0.07 // 7cm em metros
    const margemBorda = 0.01 // 1cm para dentro
    
    let index = 0
    
    // Função para renderizar apoios de 7cm distribuídos pela largura
    const renderApoiosPorLinha = (yPos: number, key: string, apoiosFixos?: boolean) => {
      const apoiosPorLinha = []
      
      if (apoiosFixos) {
        // Apoio fixo: linha contínua que atravessa toda a largura
        apoiosPorLinha.push(
          <line
            key={`${key}-apoio-completo`}
            x1={0}
            y1={yPos * pixelsPorMetro}
            x2={larguraMedida * pixelsPorMetro}
            y2={yPos * pixelsPorMetro}
            stroke="#666666"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.8"
          />
        )
      } else {
        // Para linhas intermediárias: distribuir ao longo da largura
        let xAtual = 0
        let apoioIndex = 0
        
        while (xAtual + comprimentoApoio <= larguraMedida) {
          apoiosPorLinha.push(
            <line
              key={`${key}-apoio-${apoioIndex}`}
              x1={xAtual * pixelsPorMetro}
              y1={yPos * pixelsPorMetro}
              x2={(xAtual + comprimentoApoio) * pixelsPorMetro}
              y2={yPos * pixelsPorMetro}
              stroke="#666666"
              strokeWidth="2"
              strokeDasharray="3,2"
              opacity="0.8"
            />
          )
          xAtual += comprimentoApoio + 0.02 // 2cm de espaço entre apoios
          apoioIndex++
        }
      }
      
      return apoiosPorLinha
    }
    
    // SEMPRE renderizar apoios fixos nas bordas (1cm para dentro)
    linhasApoios.push(...renderApoiosPorLinha(margemBorda, 'borda-inicio', true))
    linhasApoios.push(...renderApoiosPorLinha(comprimentoMedida - margemBorda, 'borda-fim', true))
    
    // Apoios intermediários conforme espaçamento configurado
    let posicaoAtual = margemBorda + distanciaApoios
    while (posicaoAtual < comprimentoMedida - margemBorda) {
      linhasApoios.push(...renderApoiosPorLinha(posicaoAtual, `intermediario-${index}`, false))
      posicaoAtual += distanciaApoios
      index++
    }

    return <g>{linhasApoios}</g>
  }

  // Renderizar grid de chapas COM AMARRAÇÃO e numeração sequencial
  const renderGridChapas = () => {
    const chapas = []
    let numeroAtual = 1
    
    // Debug
    console.log(`=== DEBUG PISO WALL ===`)
    console.log(`Ambiente: ${larguraMedida}m x ${comprimentoMedida}m`)
    console.log(`Painel: ${painelLargura}m x ${painelComprimento}m`)
    console.log(`Painéis necessários: ${paineisLargura} x ${paineisComprimento}`)
    
    // Renderizar com desencontro/amarração das juntas
    for (let j = 0; j < paineisLargura; j++) { // coluna (largura)
      // AMARRAÇÃO: colunas pares começam em 0, colunas ímpares começam deslocadas no comprimento
      const deslocamentoY = (j % 2 === 1) ? painelComprimento / 2 : 0
      
      // Calcular quantas linhas precisamos (incluindo possível recorte)
      const linhasNecessarias = Math.ceil(comprimentoMedida / painelComprimento)
      const linhasComDeslocamento = deslocamentoY > 0 ? linhasNecessarias + 1 : linhasNecessarias
      
      for (let i = 0; i < linhasComDeslocamento; i++) {
        const x = j * painelLargura
        let y = i * painelComprimento + deslocamentoY
        
        // Se há deslocamento e é a primeira linha, pode começar com painel parcial
        if (deslocamentoY > 0 && i === 0) {
          y = 0 // Começar do início mesmo com deslocamento
        }
        
        // Verificar se esta chapa está dentro da área do ambiente
        const dentroDoAmbiente = (x < larguraMedida) && (y < comprimentoMedida)
        console.log(`🔍 Verificando pos(${x.toFixed(2)}, ${y.toFixed(2)}) - dentroAmbiente: ${dentroDoAmbiente}`)
        
        if (dentroDoAmbiente) {
          // Calcular dimensões efetivas desta chapa considerando deslocamento
          let larguraChapa = painelLargura
          let comprimentoChapa = painelComprimento
          
          // Ajustar largura se chapa sai do ambiente
          if (x + painelLargura > larguraMedida) {
            larguraChapa = larguraMedida - x
          }
          
          // Ajustar comprimento se chapa sai do ambiente
          if (y + painelComprimento > comprimentoMedida) {
            comprimentoChapa = comprimentoMedida - y
          }
          
          // Se chapa tem deslocamento e é primeira da linha, pode ser cortada
          if (deslocamentoY > 0 && i === 0) {
            comprimentoChapa = Math.min(painelComprimento - deslocamentoY, comprimentoMedida)
          }
          
          // Se é o último painel no comprimento e há recorte, ajustar
          if (y + painelComprimento > comprimentoMedida && comprimentoMedida % painelComprimento > 0.01) {
            comprimentoChapa = comprimentoMedida - y
          }
          
          // Só renderizar se a chapa tem dimensões mínimas
          if (larguraChapa > 0.1 && comprimentoChapa > 0.1) {
            console.log(`✅ RENDERIZANDO painel ${numeroAtual}: pos(${x.toFixed(2)}, ${y.toFixed(2)}) - ${larguraChapa.toFixed(2)}×${comprimentoChapa.toFixed(2)}m`)
            
            chapas.push(renderChapa(x, y, larguraChapa, comprimentoChapa, numeroAtual - 1, i, j))
            numeroAtual++
          } else {
            console.log(`❌ IGNORANDO peça pequena: pos(${x.toFixed(2)}, ${y.toFixed(2)}) - ${larguraChapa.toFixed(2)}×${comprimentoChapa.toFixed(2)}m`)
          }
        }
      }
    }
    
    console.log(`Total de painéis renderizados: ${numeroAtual - 1}`)
    
    return chapas
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Header com informações - Padrão Drywall */}
      <div className="mb-4 flex items-center space-x-3">
        {numeroAmbiente && (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-gray-600">{numeroAmbiente}</span>
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm text-gray-600">
            {larguraMedida.toFixed(2).replace('.', ',')}m × {comprimentoMedida.toFixed(2).replace('.', ',')}m | {especificacao.descricao} | {paineisLargura * paineisComprimento} painéis
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Área: {areaAmbiente.toFixed(2).replace('.', ',')} m² | {especificacao.parafusosPorPainel} parafusos por painel
          </div>
        </div>
        
        {/* Controles de zoom */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
            title="Reduzir zoom"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs text-gray-600 min-w-[3rem] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
            title="Aumentar zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
            title="Resetar zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Área de desenho */}
      <div className="bg-gray-50 overflow-auto max-h-96 border border-gray-200 rounded">
        <svg
          width={svgLargura + margem * 2}
          height={svgComprimento + margem * 2}
          viewBox={`-${margem} -${margem} ${svgLargura + margem * 2} ${svgComprimento + margem * 2}`}
          className="bg-white"
        >
          
          {/* Grid de chapas */}
          {renderGridChapas()}
          
          {/* Apoios (linhas pontilhadas) */}
          {renderApoios()}
          
          {/* Cotas externas do ambiente */}
          <g stroke="#000000" fill="#000000" fontSize="10">
            {/* Cota superior externa */}
            <line
              x1="0"
              y1="-30"
              x2={larguraMedida * pixelsPorMetro}
              y2="-30"
              strokeWidth="1"
            />
            <line x1="0" y1="-25" x2="0" y2="-35" strokeWidth="1" />
            <line 
              x1={larguraMedida * pixelsPorMetro} 
              y1="-25" 
              x2={larguraMedida * pixelsPorMetro} 
              y2="-35" 
              strokeWidth="1" 
            />
            <text
              x={larguraMedida * pixelsPorMetro / 2}
              y="-37"
              textAnchor="middle"
              fontSize="12"
              fontWeight="normal"
            >
              {larguraMedida.toFixed(2).replace('.', ',')}m
            </text>
            
            {/* Cotas superiores - TODAS as divisões */}
            {(() => {
              const cotas = []
              let xAcumulado = 0
              
              // Painéis completos
              for (let i = 0; i < Math.floor(larguraMedida / painelLargura); i++) {
                const x = (i + 1) * painelLargura * pixelsPorMetro
                cotas.push(
                  <g key={`cota-sup-${i}`}>
                    <line x1={x} y1="-1" x2={x} y2="-6" strokeWidth="1" />
                    <text
                      x={x - (painelLargura * pixelsPorMetro / 2)}
                      y="-8"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="normal"
                    >
                      {painelLargura.toFixed(2).replace('.', ',')}m
                    </text>
                  </g>
                )
                xAcumulado += painelLargura
              }
              
              // Recorte final se houver
              const recorte = larguraMedida - xAcumulado
              if (recorte > 0.01) {
                const x = larguraMedida * pixelsPorMetro
                cotas.push(
                  <g key="cota-sup-recorte">
                    <line x1={x} y1="-1" x2={x} y2="-6" strokeWidth="1" />
                    <text
                      x={x - (recorte * pixelsPorMetro / 2)}
                      y="-8"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="normal"
                    >
                      {recorte.toFixed(2).replace('.', ',')}m
                    </text>
                  </g>
                )
              }
              
              return cotas
            })()}
            
            {/* Cota lateral externa */}
            <line
              x1="-30"
              y1="0"
              x2="-30"
              y2={comprimentoMedida * pixelsPorMetro}
              strokeWidth="1"
            />
            <line x1="-25" y1="0" x2="-35" y2="0" strokeWidth="1" />
            <line 
              x1="-25" 
              y1={comprimentoMedida * pixelsPorMetro} 
              x2="-35" 
              y2={comprimentoMedida * pixelsPorMetro} 
              strokeWidth="1" 
            />
            <text
              x="-37"
              y={comprimentoMedida * pixelsPorMetro / 2}
              textAnchor="middle"
              fontSize="12"
              fontWeight="normal"
              transform={`rotate(-90, -37, ${comprimentoMedida * pixelsPorMetro / 2})`}
            >
              {comprimentoMedida.toFixed(2).replace('.', ',')}m
            </text>
            
            {/* Cotas laterais - TODAS as divisões */}
            {(() => {
              const cotas = []
              let yAcumulado = 0
              
              // Painéis completos
              for (let i = 0; i < Math.floor(comprimentoMedida / painelComprimento); i++) {
                const y = (i + 1) * painelComprimento * pixelsPorMetro
                cotas.push(
                  <g key={`cota-lat-${i}`}>
                    <line x1="-1" y1={y} x2="-6" y2={y} strokeWidth="1" />
                    <text
                      x="-8"
                      y={y - (painelComprimento * pixelsPorMetro / 2)}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="normal"
                      transform={`rotate(-90, -8, ${y - (painelComprimento * pixelsPorMetro / 2)})`}
                    >
                      {painelComprimento.toFixed(2).replace('.', ',')}m
                    </text>
                  </g>
                )
                yAcumulado += painelComprimento
              }
              
              // Recorte final se houver
              const recorte = comprimentoMedida - yAcumulado
              if (recorte > 0.01) {
                const y = comprimentoMedida * pixelsPorMetro
                cotas.push(
                  <g key="cota-lat-recorte">
                    <line x1="-1" y1={y} x2="-6" y2={y} strokeWidth="1" />
                    <text
                      x="-8"
                      y={y - (recorte * pixelsPorMetro / 2)}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="normal"
                      transform={`rotate(-90, -8, ${y - (recorte * pixelsPorMetro / 2)})`}
                    >
                      {recorte.toFixed(2).replace('.', ',')}m
                    </text>
                  </g>
                )
              }
              
              return cotas
            })()}
          </g>
          
          {/* Linha de contorno do ambiente */}
          <g stroke="#000000" strokeWidth="2" fill="none">
            <rect
              x="0"
              y="0"
              width={larguraMedida * pixelsPorMetro}
              height={comprimentoMedida * pixelsPorMetro}
            />
          </g>
        </svg>
      </div>
      
      {/* Legenda - Padrão Drywall */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-red-600" style={{borderTop: '1px dashed #DC2626'}}></div>
              <span>Junções</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border border-gray-600 bg-gray-100"></div>
              <span>Painel base</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border border-gray-600 bg-yellow-100"></div>
              <span>Painel intercalado</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-gray-500"></div>
              <span>Cotas</span>
            </div>
            {apoios.mostrar && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-gray-600 border-t border-dashed"></div>
                <span>Apoios (bordas fixas + {apoios.distancia.toString().replace('.', ',')}m)</span>
              </div>
            )}
          </div>
          <div>
            Escala 1:{Math.round(1000 / pixelsPorMetro)}
          </div>
        </div>
      </div>
    </div>
  )
}