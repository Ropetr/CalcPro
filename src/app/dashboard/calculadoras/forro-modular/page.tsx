'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Grid3X3, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Ruler,
  Package,
  Layers,
  Zap,
  Plus,
  Trash2,
  Search,
  Flag,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { calcularPerfisMultiplosAmbientes, calcularPerfisT } from '@/lib/calculators/forro-modular/perfis'
import { calcularCantoneirasMultiplosAmbientes, cantoneiraCalculator } from '@/lib/calculators/forro-modular/cantoneiras'

interface CalculationResult {
  placas: number
  perfilT312: number
  perfilT125: number
  perfilT625?: number
  cantoneiras: number
  pendurais: number
  metalon: number
  chipboardBuchas: number
  gn25: number
  parafusosBuchasExtras?: number
  travas: number
  area: number
  cantoneiraOtimizada?: {
    total: number
    inteiras: number
    barrasParaRecortes: number
    aproveitamento: Array<{
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
    }>
  }
  perfisDetalhamento?: {
    perfil312: {
      inteiras: number
      barrasParaRecortes: number
      total: number
      aproveitamento: Array<{
        barra: number
        uso1: number
        uso2?: number
        sobra?: number
      }>
    }
    perfil125: {
      inteiras: number
      barrasParaRecortes: number
      total: number
      aproveitamento: Array<{
        barra: number
        uso1: number
        uso2?: number
        sobra?: number
      }>
    }
    perfil0625?: {
      inteiras: number
      barrasParaRecortes: number
      total: number
      aproveitamento: Array<{
        barra: number
        uso1: number
        uso2?: number
        sobra?: number
      }>
    }
  }
}

interface Ambiente {
  id: string
  nome: string
  comprimento: string
  largura: string
  descricao: string
  area: number
  especificacoes: {
    tipoPlaca: string
    alturaPendural: string
    tipoEstrutura: string
    preenchido: boolean
  }
  recortes: {
    luminarias: string
    difusores: string
    sprinklers: string
    preenchido: boolean
  }
}

export default function ForroModularPage() {
  const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAberto, setModalAberto] = useState<{tipo: 'especificacoes' | 'recortes' | null, ambienteId: string | null}>({tipo: null, ambienteId: null})
  const [especificacoesPadrao, setEspecificacoesPadrao] = useState<{
    tipoPlaca: string
    alturaPendural: string
    tipoEstrutura: string
  } | null>(null)
  
  const [ambientes, setAmbientes] = useState<Ambiente[]>([
    {
      id: '1',
      nome: 'Ambiente 01',
      comprimento: '',
      largura: '',
      descricao: '',
      area: 0,
      especificacoes: {
        tipoPlaca: '0625x1250',
        alturaPendural: '0.50',
        tipoEstrutura: 'concreto',
        preenchido: false
      },
      recortes: {
        luminarias: '',
        difusores: '',
        sprinklers: '',
        preenchido: false
      }
    }
  ])

  const [result, setResult] = useState<CalculationResult | null>(null)

  // Atalhos de teclado: TAB (novo ambiente) e ENTER (calcular) - IGUAL à divisória drywall
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLInputElement
      
      // Se está no campo descrição e pressionou TAB
      if (target?.getAttribute('data-field') === 'descricao' && event.key === 'Tab') {
        event.preventDefault()
        // Salvar o valor atual antes de adicionar novo ambiente
        const ambienteId = target.closest('[data-ambiente-id]')?.getAttribute('data-ambiente-id')
        if (ambienteId) {
          atualizarAmbiente(ambienteId, 'descricao', target.value)
        }
        adicionarAmbiente()
        // Focar no primeiro campo (largura) do novo ambiente após um pequeno delay
        setTimeout(() => {
          const novoInput = document.querySelector('[data-ambiente-id]:first-child input[type="number"]') as HTMLInputElement
          if (novoInput) {
            novoInput.focus()
          }
        }, 100)
      }
      
      // Se pressionou ENTER em qualquer campo de ambiente
      if ((target?.getAttribute('data-field') === 'largura' || 
           target?.getAttribute('data-field') === 'comprimento' || 
           target?.getAttribute('data-field') === 'descricao') && 
           event.key === 'Enter') {
        event.preventDefault()
        calcularForroModular()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [ambientes])

  // Função de otimização global de perfis T - DESABILITADA - usando novo sistema modular
  const calcularPerfisOtimizadosAntiga = (ambientes: Ambiente[], placaDimensions: {largura: number, comprimento: number}) => {
    // Catalogar todos os recortes necessários
    interface RecorteInfo {
      ambiente: string
      tipo: 'perfil312' | 'perfil125'
      medida: number
      quantidade: number
    }
    
    const recortes312: RecorteInfo[] = []
    const recortes125: RecorteInfo[] = []
    let perfisCompletos312 = 0
    let perfisCompletos125 = 0
    
    ambientes.forEach(ambiente => {
      const largura = parseFloat(ambiente.largura)
      const comprimento = parseFloat(ambiente.comprimento)
      
      // PERFIL T 3,12m (horizontais entre fileiras de placas)
      const fileirasPlacas = Math.ceil(comprimento / placaDimensions.comprimento)
      const fileirasperfil312 = fileirasPlacas - 1 // sempre 1 a menos
      
      if (fileirasperfil312 > 0) {
        // Perfis completos de 3,12m
        const perfisCompletos = Math.floor(largura / 3.12) * fileirasperfil312
        perfisCompletos312 += perfisCompletos
        
        // Recortes necessários
        const sobrarPorFileira = largura - (Math.floor(largura / 3.12) * 3.12)
        if (sobrarPorFileira > 0) {
          recortes312.push({
            ambiente: ambiente.nome,
            tipo: 'perfil312',
            medida: sobrarPorFileira,
            quantidade: fileirasperfil312
          })
        }
      }
      
      // PERFIL T 1,25m (verticais entre colunas de placas)  
      const colunasPlacas = Math.ceil(largura / placaDimensions.largura)
      const colunasPerfil125 = colunasPlacas - 1 // sempre 1 a menos
      
      if (colunasPerfil125 > 0) {
        // Perfis completos de 1,25m
        const perfisCompletos = Math.floor(comprimento / 1.25) * colunasPerfil125
        perfisCompletos125 += perfisCompletos
        
        // Recortes necessários
        const sobrarPorColuna = comprimento - (Math.floor(comprimento / 1.25) * 1.25)
        if (sobrarPorColuna > 0) {
          recortes125.push({
            ambiente: ambiente.nome,
            tipo: 'perfil125',
            medida: sobrarPorColuna,
            quantidade: colunasPerfil125
          })
        }
      }
    })
    
    // Otimizar recortes de perfil 3,12m
    const perfisParaRecortes312 = otimizarRecortes(recortes312, 3.12)
    
    // Otimizar recortes de perfil 1,25m  
    const perfisParaRecortes125 = otimizarRecortes(recortes125, 1.25)
    
    return {
      perfil312: perfisCompletos312 + perfisParaRecortes312,
      perfil125: perfisCompletos125 + perfisParaRecortes125
    }
  }
  
  // Algoritmo de otimização de recortes com aproveitamento inter-ambientes
  const otimizarRecortes = (recortes: any[], tamanhoEspeci: number) => {
    if (recortes.length === 0) return 0
    
    // Expandir recortes individuais
    const recortesIndividuais: number[] = []
    recortes.forEach(r => {
      for (let i = 0; i < r.quantidade; i++) {
        recortesIndividuais.push(r.medida)
      }
    })
    
    // Ordenar do maior para o menor para melhor aproveitamento
    recortesIndividuais.sort((a, b) => b - a)
    
    let perfisNecessarios = 0
    let sobrasDisponiveis: number[] = []
    
    for (let recorte of recortesIndividuais) {
      // Tentar usar sobra disponível primeiro
      let usouSobra = false
      
      for (let i = 0; i < sobrasDisponiveis.length; i++) {
        if (sobrasDisponiveis[i] >= recorte) {
          // Usar sobra
          sobrasDisponiveis[i] -= recorte
          
          // Se sobra ficou muito pequena, remover (sem encaixe)
          if (sobrasDisponiveis[i] < 0.1) {
            sobrasDisponiveis.splice(i, 1)
          }
          
          usouSobra = true
          break
        }
      }
      
      if (!usouSobra) {
        // Usar perfil novo
        perfisNecessarios++
        const sobra = tamanhoEspeci - recorte
        
        // Só adicionar sobra se for aproveitável (pode fazer mais 1 corte)
        if (sobra >= 0.1) {
          sobrasDisponiveis.push(sobra)
        }
      }
    }
    
    return perfisNecessarios
  }

  // Função para analisar ambiente individual
  const analisarAmbienteIndividual = (ambiente: Ambiente, placaDimensions: {largura: number, comprimento: number}, tipoPlaca?: string) => {
    const largura = parseFloat(ambiente.largura)
    const comprimento = parseFloat(ambiente.comprimento)
    
    // ANÁLISE DAS PLACAS
    const placasInteirasL = Math.floor(largura / placaDimensions.largura)
    const placasInteirasC = Math.floor(comprimento / placaDimensions.comprimento)
    const placasInteiras = placasInteirasL * placasInteirasC
    
    let placasParaRecortes = 0
    const sobras = []
    
    // Recorte na largura
    const recorteL = largura - (placasInteirasL * placaDimensions.largura)
    if (recorteL > 0) {
      const recortesPorPlaca = Math.floor(placaDimensions.largura / recorteL)
      const totalRecortesL = Math.ceil(comprimento / placaDimensions.comprimento)
      const placasNecessarias = Math.ceil(totalRecortesL / recortesPorPlaca)
      placasParaRecortes += placasNecessarias
      
      // Calcular sobra das placas de recorte
      const sobrarDaPlaca = placaDimensions.largura - (recorteL * recortesPorPlaca)
      if (sobrarDaPlaca > 0.1) {
        sobras.push({
          tipo: 'Placa (largura)',
          medida: sobrarDaPlaca,
          aproveitavel: sobrarDaPlaca > 0.2
        })
      }
    }
    
    // Recorte no comprimento
    const recorteC = comprimento - (placasInteirasC * placaDimensions.comprimento)
    if (recorteC > 0) {
      const recortesPorPlaca = Math.floor(placaDimensions.comprimento / recorteC)
      const totalRecortesC = Math.ceil(largura / placaDimensions.largura)
      const placasNecessarias = Math.ceil(totalRecortesC / recortesPorPlaca)
      placasParaRecortes += placasNecessarias
      
      // Calcular sobra das placas de recorte
      const sobrarDaPlaca = placaDimensions.comprimento - (recorteC * recortesPorPlaca)
      if (sobrarDaPlaca > 0.1) {
        sobras.push({
          tipo: 'Placa (comprimento)',
          medida: sobrarDaPlaca,
          aproveitavel: sobrarDaPlaca > 0.2
        })
      }
    }
    
    const totalPlacas = placasInteiras + placasParaRecortes
    const placasTradicional = Math.ceil(largura / placaDimensions.largura) * Math.ceil(comprimento / placaDimensions.comprimento)
    
    // ANÁLISE DOS PERFIS T - usando sistema modular
    const perfisCalculados = calcularPerfisT(largura, comprimento, placaDimensions)
    
    // Perfil T 3,12m 
    const perfisT312 = perfisCalculados.resumo.totalBarras312
    const detalhes312 = perfisT312 > 0 ? {
      completos: perfisCalculados.perfil312.inteiras,
      recortes: perfisCalculados.perfil312.detalhamento.barrasParaRecortes,
      aproveitamento: perfisCalculados.perfil312.detalhamento.aproveitamento
    } : null
    
    // Perfil T 1,25m - usando sistema modular
    const perfisT125 = perfisCalculados.resumo.totalBarras125
    const detalhes125 = perfisT125 > 0 ? {
      completos: perfisCalculados.perfil125.inteiras,
      recortes: perfisCalculados.perfil125.detalhamento.barrasParaRecortes,
      aproveitamento: perfisCalculados.perfil125.detalhamento.aproveitamento
    } : null
    
    // Perfil T 0,625m - usando sistema modular
    const perfisT0625 = perfisCalculados.resumo.totalBarras0625
    const detalhes0625 = perfisT0625 > 0 ? {
      completos: perfisCalculados.perfil0625.inteiras,
      recortes: perfisCalculados.perfil0625.detalhamento.barrasParaRecortes,
      aproveitamento: perfisCalculados.perfil0625.detalhamento.aproveitamento
    } : null

    // ANÁLISE DAS CANTONEIRAS - usando sistema modular
    const cantoneirasCalculadas = calcularCantoneirasMultiplosAmbientes([
      { largura, comprimento, nome: ambiente.nome }
    ])
    
    const cantoneiriasNecessarias = cantoneirasCalculadas.resumo.totalBarras300

    const perfisRetorno: any = {
      t312: {
        total: perfisT312,
        detalhes: detalhes312
      },
      t125: {
        total: perfisT125,
        detalhes: detalhes125
      }
    }
    
    if (tipoPlaca === '0625x0625') {
      perfisRetorno.t0625 = {
        total: perfisT0625,
        detalhes: detalhes0625
      }
    }

    return {
      placas: {
        inteiras: placasInteiras,
        recortes: placasParaRecortes,
        total: totalPlacas,
        economia: placasTradicional - totalPlacas
      },
      perfis: perfisRetorno,
      cantoneiras: {
        total: cantoneiriasNecessarias,
        inteiras: cantoneirasCalculadas.cantoneira300.inteiras,
        recortes: cantoneirasCalculadas.cantoneira300.detalhamento.barrasParaRecortes,
        aproveitamento: cantoneirasCalculadas.cantoneira300.detalhamento.aproveitamento,
        perimetro: (largura + comprimento) * 2
      },
      sobras: sobras
    }
  }

  // Função para otimizar cantoneiras por peça/parede (máxima economia)
  const calcularCantoneirasOtimizadasAntiga = (ambientes: Ambiente[]) => {
    interface PecaCantoneira {
      medida: number
      ambienteId: string
      parede: 'largura1' | 'largura2' | 'comprimento1' | 'comprimento2'
      aproveitavel: boolean
    }

    interface RecorteSobra {
      medida: number
      ambienteOrigem: string
      aproveitavel: boolean
    }

    let cantoneirasTotais = 0
    let sobrasDisponiveis: RecorteSobra[] = []
    const detalhesAmbientes: { [key: string]: { 
      pecas: PecaCantoneira[], 
      cantoneirasTotais: number, 
      sobrasGeradas: RecorteSobra[],
      aproveitamentos: string[]
    } } = {}

    // Processar cada ambiente individualmente por parede
    ambientes.forEach(ambiente => {
      const largura = parseFloat(ambiente.largura) || 0
      const comprimento = parseFloat(ambiente.comprimento) || 0
      
      if (largura === 0 || comprimento === 0) {
        detalhesAmbientes[ambiente.id] = { 
          pecas: [], 
          cantoneirasTotais: 0, 
          sobrasGeradas: [],
          aproveitamentos: []
        }
        return
      }

      // Criar as 4 peças do ambiente (uma para cada parede)
      const pecas: PecaCantoneira[] = [
        { medida: largura, ambienteId: ambiente.id, parede: 'largura1', aproveitavel: true },
        { medida: largura, ambienteId: ambiente.id, parede: 'largura2', aproveitavel: true },
        { medida: comprimento, ambienteId: ambiente.id, parede: 'comprimento1', aproveitavel: true },
        { medida: comprimento, ambienteId: ambiente.id, parede: 'comprimento2', aproveitavel: true }
      ]

      let cantoneiriasDoAmbiente = 0
      let sobrasGeradas: RecorteSobra[] = []
      let aproveitamentos: string[] = []

      // Processar cada peça individualmente
      pecas.forEach(peca => {
        if (peca.medida <= 3.00) {
          // Tenta usar uma sobra disponível primeiro
          const sobraUtil = sobrasDisponiveis.find(s => s.medida >= peca.medida && s.aproveitavel)
          
          if (sobraUtil) {
            // Usar sobra existente
            const sobrarDaSobra = sobraUtil.medida - peca.medida
            aproveitamentos.push(`Parede ${peca.parede} (${peca.medida.toFixed(2)}m) usou sobra de ${sobraUtil.ambienteOrigem}`)
            
            // Remover sobra usada
            const index = sobrasDisponiveis.findIndex(s => s === sobraUtil)
            sobrasDisponiveis.splice(index, 1)
            
            // Se sobrar algo, adicionar de volta
            if (sobrarDaSobra > 0.05) {
              sobrasDisponiveis.push({
                medida: sobrarDaSobra,
                ambienteOrigem: ambiente.id,
                aproveitavel: sobrarDaSobra > 0.3
              })
            }
          } else {
            // Precisa de cantoneira nova
            cantoneiriasDoAmbiente += 1
            const sobra = 3.00 - peca.medida
            
            if (sobra > 0.05) {
              const novaSobra = {
                medida: sobra,
                ambienteOrigem: ambiente.id,
                aproveitavel: sobra > 0.3
              }
              sobrasGeradas.push(novaSobra)
              sobrasDisponiveis.push(novaSobra)
            }
          }
        } else {
          // Peça maior que 3m - precisa de múltiplas cantoneiras
          const cantoneiriasNecessarias = Math.ceil(peca.medida / 3.00)
          cantoneiriasDoAmbiente += cantoneiriasNecessarias
          
          const ultimaPeca = peca.medida - (Math.floor(peca.medida / 3.00) * 3.00)
          if (ultimaPeca > 0.05) {
            const sobra = 3.00 - ultimaPeca
            if (sobra > 0.05) {
              const novaSobra = {
                medida: sobra,
                ambienteOrigem: ambiente.id,
                aproveitavel: sobra > 0.3
              }
              sobrasGeradas.push(novaSobra)
              sobrasDisponiveis.push(novaSobra)
            }
          }
        }
      })

      cantoneirasTotais += cantoneiriasDoAmbiente
      detalhesAmbientes[ambiente.id] = {
        pecas,
        cantoneirasTotais: cantoneiriasDoAmbiente,
        sobrasGeradas,
        aproveitamentos
      }
    })

    return {
      total: cantoneirasTotais,
      detalhes: detalhesAmbientes,
      sobrasFinais: sobrasDisponiveis.filter(s => s.aproveitavel)
    }
  }

  const calcularForroModular = () => {
    if (ambientes.length === 0) {
      alert('Adicione pelo menos um ambiente para calcular');
      return;
    }

    // Verificar se todos os ambientes têm dimensões
    const ambientesIncompletos = ambientes.filter(amb => !amb.comprimento || !amb.largura);
    if (ambientesIncompletos.length > 0) {
      alert('Por favor, preencha as dimensões de todos os ambientes');
      return;
    }

    // Calcular usando o primeiro ambiente como referência para as especificações
    const ambienteReferencia = ambientes.find(amb => amb.especificacoes.preenchido) || ambientes[0];
    
    const areaTotal = ambientes.reduce((total, amb) => total + amb.area, 0);
    const alturaPendural = parseFloat(ambienteReferencia.especificacoes.alturaPendural);

    // Dimensões da placa baseadas no tipo selecionado
    const placaDimensions = ambienteReferencia.especificacoes.tipoPlaca === '0625x0625' 
      ? { largura: 0.625, comprimento: 0.625 }
      : { largura: 0.625, comprimento: 1.25 };

    // 1. CÁLCULO OTIMIZADO DAS PLACAS (com aproveitamento)
    const totalPlacas = ambientes.reduce((total, amb) => {
      const largura = parseFloat(amb.largura);
      const comprimento = parseFloat(amb.comprimento);
      
      // PLACAS INTEIRAS
      const placasInteirasLargura = Math.floor(largura / placaDimensions.largura);
      const placasInteirasComprimento = Math.floor(comprimento / placaDimensions.comprimento);
      const placasInteiras = placasInteirasLargura * placasInteirasComprimento;
      
      // RECORTES E OTIMIZAÇÃO
      let placasParaRecortes = 0;
      
      // Recorte na largura
      const recorteLargura = largura - (placasInteirasLargura * placaDimensions.largura);
      if (recorteLargura > 0) {
        const recortesPorPlacaLargura = Math.floor(placaDimensions.largura / recorteLargura);
        const totalRecortesLargura = Math.ceil(comprimento / placaDimensions.comprimento);
        placasParaRecortes += Math.ceil(totalRecortesLargura / recortesPorPlacaLargura);
      }
      
      // Recorte no comprimento
      const recorteComprimento = comprimento - (placasInteirasComprimento * placaDimensions.comprimento);
      if (recorteComprimento > 0) {
        const recortesPorPlacaComprimento = Math.floor(placaDimensions.comprimento / recorteComprimento);
        const totalRecortesComprimento = Math.ceil(largura / placaDimensions.largura);
        placasParaRecortes += Math.ceil(totalRecortesComprimento / recortesPorPlacaComprimento);
      }
      
      return total + placasInteiras + placasParaRecortes;
    }, 0);

    // Usar médias para os demais cálculos (simplificado)
    const larguraMedia = ambientes.reduce((total, amb) => total + parseFloat(amb.largura), 0) / ambientes.length;
    const comprimentoMedio = ambientes.reduce((total, amb) => total + parseFloat(amb.comprimento), 0) / ambientes.length;

    // 2. OTIMIZAÇÃO GLOBAL DE PERFIS T - usando novo sistema modular
    const ambientesParaPerfis = ambientes.map(amb => ({
      largura: parseFloat(amb.largura),
      comprimento: parseFloat(amb.comprimento),
      nome: amb.nome
    }));
    
    const perfisOtimizados = calcularPerfisMultiplosAmbientes(ambientesParaPerfis, placaDimensions);
    const totalPerfilT312 = perfisOtimizados.resumo.totalBarras312;
    const totalPerfilT125 = perfisOtimizados.resumo.totalBarras125;

    // 4. PERFIL T 0,625m (usando novo sistema modular quando aplicável)
    let totalPerfilT625 = perfisOtimizados.resumo.totalBarras0625;

    // 5. CANTONEIRAS 3,00m (otimizadas) - usando novo sistema modular
    const cantoneiraOtimizada = calcularCantoneirasMultiplosAmbientes(ambientesParaPerfis);
    const totalCantoneiras = cantoneiraOtimizada.resumo.totalBarras300;

    // 6. PENDURAIS E METALON
    const penduraisPorFileira = Math.floor(larguraMedia / 1.20);
    // Calcular fileiras médias de perfis T para pendurais
    const fileirasMedias = ambientes.reduce((total, amb) => {
      const comp = parseFloat(amb.comprimento) || 0;
      return total + Math.max(0, Math.ceil(comp / 1.25) - 1);
    }, 0) / ambientes.length;
    const totalPendurais = penduraisPorFileira * Math.ceil(fileirasMedias) * ambientes.length;
    const metragemMetalon = totalPendurais * alturaPendural;
    const barrasMetalon = Math.ceil(metragemMetalon / 6.00);

    // 7. PARAFUSOS E BUCHAS
    const perimetroTotal = ambientes.reduce((total, amb) => {
      const largura = parseFloat(amb.largura);
      const comprimento = parseFloat(amb.comprimento);
      return total + ((largura + comprimento) * 2);
    }, 0);
    const chipboardBuchas = Math.ceil(perimetroTotal / 0.50);
    
    let gn25 = totalPendurais; // Base: 1 por pendural
    let parafusosBuchasExtras = undefined;
    
    if (ambienteReferencia.especificacoes.tipoEstrutura === 'metalica') {
      gn25 = totalPendurais * 2; // 2 GN25 ponta broca por pendural
    } else if (ambienteReferencia.especificacoes.tipoEstrutura === 'madeira') {
      gn25 = totalPendurais * 2; // 2 GN25 por pendural
    } else if (ambienteReferencia.especificacoes.tipoEstrutura === 'concreto') {
      parafusosBuchasExtras = totalPendurais; // Parafusos + buchas extras
    }

    // 8. TRAVAS DE PLACA (calculadas por ambiente e somadas)
    const totalTravas = ambientes.reduce((total, amb) => {
      const largura = parseFloat(amb.largura);
      const comprimento = parseFloat(amb.comprimento);
      const qtdLargura = largura / placaDimensions.largura;
      const qtdComprimento = comprimento / placaDimensions.comprimento;
      const colunas = Math.ceil(qtdLargura);
      const fileiras = Math.ceil(qtdComprimento);
      const encontrosVerticais = (colunas - 1) * fileiras;
      const encontrosHorizontais = (fileiras - 1) * colunas;
      return total + encontrosVerticais + encontrosHorizontais;
    }, 0);

    const resultado: CalculationResult = {
      placas: totalPlacas,
      perfilT312: totalPerfilT312,
      perfilT125: totalPerfilT125,
      perfilT625: totalPerfilT625,
      cantoneiras: totalCantoneiras,
      pendurais: totalPendurais,
      metalon: barrasMetalon,
      chipboardBuchas,
      gn25,
      parafusosBuchasExtras,
      travas: totalTravas,
      area: areaTotal,
      cantoneiraOtimizada: {
        total: cantoneiraOtimizada.resumo.totalBarras300,
        inteiras: cantoneiraOtimizada.cantoneira300.inteiras,
        barrasParaRecortes: cantoneiraOtimizada.cantoneira300.detalhamento.barrasParaRecortes,
        aproveitamento: cantoneiraOtimizada.cantoneira300.detalhamento.aproveitamento
      },
      perfisDetalhamento: {
        perfil312: {
          inteiras: perfisOtimizados.perfil312.inteiras,
          barrasParaRecortes: perfisOtimizados.perfil312.detalhamento.barrasParaRecortes,
          total: perfisOtimizados.perfil312.total,
          aproveitamento: perfisOtimizados.perfil312.detalhamento.aproveitamento
        },
        perfil125: {
          inteiras: perfisOtimizados.perfil125.inteiras,
          barrasParaRecortes: perfisOtimizados.perfil125.detalhamento.barrasParaRecortes,
          total: perfisOtimizados.perfil125.total,
          aproveitamento: perfisOtimizados.perfil125.detalhamento.aproveitamento
        },
        perfil0625: perfisOtimizados.resumo.totalBarras0625 > 0 ? {
          inteiras: perfisOtimizados.perfil0625.inteiras,
          barrasParaRecortes: perfisOtimizados.perfil0625.detalhamento.barrasParaRecortes,
          total: perfisOtimizados.perfil0625.total,
          aproveitamento: perfisOtimizados.perfil0625.detalhamento.aproveitamento
        } : undefined
      }
    };

    setResult(resultado);
  };

  const adicionarAmbiente = () => {
    const novoId = (ambientes.length + 1).toString()
    const novoItem: Ambiente = {
      id: novoId,
      nome: `Ambiente ${novoId.padStart(2, '0')}`,
      comprimento: '',
      largura: '',
      descricao: '',
      area: 0,
      especificacoes: especificacoesPadrao ? {
        tipoPlaca: especificacoesPadrao.tipoPlaca,
        alturaPendural: especificacoesPadrao.alturaPendural,
        tipoEstrutura: especificacoesPadrao.tipoEstrutura,
        preenchido: true // Já vem preenchida com o padrão
      } : {
        tipoPlaca: '0625x1250',
        alturaPendural: '0.50',
        tipoEstrutura: 'concreto',
        preenchido: false
      },
      recortes: {
        luminarias: '',
        difusores: '',
        sprinklers: '',
        preenchido: false
      }
    }
    setAmbientes([...ambientes, novoItem])
    setActiveTab('medidas')
  }

  const removerAmbiente = (id: string) => {
    if (ambientes.length > 1) {
      setAmbientes(ambientes.filter(a => a.id !== id))
    }
  }

  const atualizarAmbiente = (id: string, campo: keyof Ambiente, valor: any) => {
    setAmbientes(ambientes.map(ambiente => {
      if (ambiente.id === id) {
        if (campo === 'especificacoes') {
          return {
            ...ambiente,
            especificacoes: { ...ambiente.especificacoes, ...valor }
          }
        } else if (campo === 'recortes') {
          return {
            ...ambiente,
            recortes: { ...ambiente.recortes, ...valor }
          }
        } else {
          const updated = { ...ambiente, [campo]: valor }
          
          // Calcular área automaticamente
          if (campo === 'comprimento' || campo === 'largura') {
            const comprimento = parseFloat(campo === 'comprimento' ? valor : updated.comprimento) || 0
            const largura = parseFloat(campo === 'largura' ? valor : updated.largura) || 0
            updated.area = comprimento * largura
          }
          return updated
        }
      }
      return ambiente
    }))
  }

  const areaTotal = ambientes.reduce((total, ambiente) => total + ambiente.area, 0)

  // Função para determinar a cor da flag de especificações
  const getCorFlagEspecificacoes = (ambiente: Ambiente) => {
    if (!ambiente.especificacoes.preenchido) {
      return 'bg-red-500 text-white' // Vermelha - não configurada ainda
    }

    if (!especificacoesPadrao) {
      return 'bg-green-500 text-white' // Verde - primeira a ser configurada
    }

    // Verificar se é igual ao padrão
    const igualPadrao = 
      ambiente.especificacoes.tipoPlaca === especificacoesPadrao.tipoPlaca &&
      ambiente.especificacoes.alturaPendural === especificacoesPadrao.alturaPendural &&
      ambiente.especificacoes.tipoEstrutura === especificacoesPadrao.tipoEstrutura

    return igualPadrao 
      ? 'bg-green-500 text-white'  // Verde - usando padrão
      : 'bg-yellow-400 text-gray-800'   // Amarela - modificada/personalizada
  }

  // Função para determinar a cor da flag de recortes
  const getCorFlagRecortes = (ambiente: Ambiente) => {
    if (!ambiente.recortes.preenchido) {
      return 'bg-red-500 text-white' // Vermelha - não configurada ainda
    }

    // Verificar se tem recortes preenchidos
    const temRecortes = ambiente.recortes.luminarias && ambiente.recortes.luminarias !== '0' || 
                       ambiente.recortes.difusores && ambiente.recortes.difusores !== '0' ||
                       ambiente.recortes.sprinklers && ambiente.recortes.sprinklers !== '0'

    return temRecortes 
      ? 'bg-green-500 text-white'  // Verde - tem recortes
      : 'bg-red-500 text-white'    // Vermelha - sem recortes
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/calculadoras"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Grid3X3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Forro Modular</h1>
                  <p className="text-sm text-gray-600">Versátil para múltiplos materiais</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-secondary flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Salvar Projeto
              </button>
              <button className="btn-primary flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Gerar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar removida - apenas espaçamento */}
        <div className="w-4 bg-gray-100"></div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Cards de Informação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Ruler className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Área Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  {result ? result.area.toFixed(2) : areaTotal.toFixed(2)} m²
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {ambientes.length} ambiente{ambientes.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Grid3X3 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Placas Necessárias</div>
                <div className="text-2xl font-bold text-gray-900">
                  {result ? result.placas : '--'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Tab</kbd> novo ambiente
                  <br />
                  <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Enter</kbd> calcular
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Package className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Ambientes</div>
                <div className="text-2xl font-bold text-gray-900">{ambientes.length}</div>
              </div>
            </div>

            {/* Área Principal com Abas */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="border-b border-gray-200">
                <div className="flex items-center justify-between p-6 pb-0">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('medidas')}
                      className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'medidas'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Ambientes ({ambientes.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('desenho')}
                      className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'desenho'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Plano de Corte
                    </button>
                    <button
                      onClick={() => setActiveTab('materiais')}
                      className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'materiais'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Lista Geral
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activeTab === 'medidas' && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Buscar ambientes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-48"
                        />
                      </div>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Conteúdo das Abas */}
              <div className="p-6">
                {activeTab === 'medidas' && (
                  <div className="space-y-4">
                    {ambientes.length === 0 && (
                      <div className="text-center py-8">
                        <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <div className="text-gray-600">Nenhum ambiente adicionado</div>
                        <button
                          onClick={adicionarAmbiente}
                          className="mt-3 btn-primary"
                        >
                          Adicionar Primeiro Ambiente
                        </button>
                      </div>
                    )}
                    
                    <div className="max-h-96 overflow-y-auto space-y-4">
                      {ambientes.slice().reverse().map((ambiente, reverseIndex) => {
                        const displayNumber = ambientes.length - reverseIndex;
                        return (
                          <div key={ambiente.id} className="border border-gray-200 rounded-lg p-4" data-ambiente-id={ambiente.id}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-purple-600">{displayNumber}</span>
                                </div>
                                <input
                                  type="text"
                                  value={ambiente.nome}
                                  onChange={(e) => atualizarAmbiente(ambiente.id, 'nome', e.target.value)}
                                  className="text-sm font-medium bg-transparent border-none focus:ring-0 p-0"
                                  placeholder="Nome do ambiente"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 mr-3">
                                  <button
                                    onClick={() => setModalAberto({tipo: 'especificacoes', ambienteId: ambiente.id})}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${getCorFlagEspecificacoes(ambiente)}`}
                                    title={
                                      !ambiente.especificacoes.preenchido 
                                        ? "🔴 Especificações - Não configurada"
                                        : !especificacoesPadrao 
                                          ? "🟢 Especificações - Configurada"
                                          : ambiente.especificacoes.tipoPlaca === especificacoesPadrao.tipoPlaca &&
                                            ambiente.especificacoes.alturaPendural === especificacoesPadrao.alturaPendural &&
                                            ambiente.especificacoes.tipoEstrutura === especificacoesPadrao.tipoEstrutura
                                            ? "🟢 Especificações - Padrão do projeto"
                                            : "🟡 Especificações - Modificada/Personalizada"
                                    }
                                  >
                                    <Flag className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => setModalAberto({tipo: 'recortes', ambienteId: ambiente.id})}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${getCorFlagRecortes(ambiente)}`}
                                    title={
                                      !ambiente.recortes.preenchido 
                                        ? "🔴 Recortes - Não configurada"
                                        : (ambiente.recortes.luminarias && ambiente.recortes.luminarias !== '0') || 
                                          (ambiente.recortes.difusores && ambiente.recortes.difusores !== '0') ||
                                          (ambiente.recortes.sprinklers && ambiente.recortes.sprinklers !== '0')
                                          ? "🟢 Recortes - Tem recortes"
                                          : "🔴 Recortes - Sem recortes"
                                    }
                                  >
                                    <Flag className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {ambiente.area.toFixed(2)} m²
                                </div>
                                {ambientes.length > 1 && (
                                  <button
                                    onClick={() => removerAmbiente(ambiente.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Largura (m)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={ambiente.largura}
                                  onChange={(e) => atualizarAmbiente(ambiente.id, 'largura', e.target.value)}
                                  onBlur={(e) => atualizarAmbiente(ambiente.id, 'largura', e.target.value)}
                                  className="input-field text-sm"
                                  placeholder="3.50"
                                  data-field="largura"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Comprimento (m)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={ambiente.comprimento}
                                  onChange={(e) => atualizarAmbiente(ambiente.id, 'comprimento', e.target.value)}
                                  onBlur={(e) => atualizarAmbiente(ambiente.id, 'comprimento', e.target.value)}
                                  className="input-field text-sm"
                                  placeholder="4.50"
                                  data-field="comprimento"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Descrição</label>
                                <input
                                  type="text"
                                  value={ambiente.descricao}
                                  onChange={(e) => atualizarAmbiente(ambiente.id, 'descricao', e.target.value)}
                                  onBlur={(e) => atualizarAmbiente(ambiente.id, 'descricao', e.target.value)}
                                  className="input-field text-sm"
                                  placeholder="Ex: Sala, Escritório..."
                                  data-field="descricao"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Total de {ambientes.length} ambiente{ambientes.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {areaTotal.toFixed(2)} m²
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">
                          Pressione <kbd className="px-1 py-0.5 bg-white text-gray-600 text-xs rounded">Tab</kbd> para novo ambiente ou <kbd className="px-1 py-0.5 bg-white text-gray-600 text-xs rounded">Enter</kbd> para calcular
                        </div>
                        <button 
                          onClick={calcularForroModular}
                          className="btn-primary text-sm flex items-center"
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Calcular
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'desenho' && (
                  <div className="space-y-6">
                    {ambientes.length === 0 ? (
                      <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <div className="text-gray-600">Adicione ambientes para ver o plano de corte</div>
                          <div className="text-sm text-gray-500">Visualização simples das placas</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {ambientes.map((ambiente) => {
                          const largura = parseFloat(ambiente.largura) || 0
                          const comprimento = parseFloat(ambiente.comprimento) || 0
                          
                          if (largura === 0 || comprimento === 0) {
                            return (
                              <div key={ambiente.id} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">{ambiente.nome}</h4>
                                <div className="text-sm text-gray-500">Adicione as dimensões para visualizar</div>
                              </div>
                            )
                          }

                          const placaDimensions = { largura: 0.625, comprimento: 1.25 }
                          const placasNaLargura = Math.ceil(largura / placaDimensions.largura)
                          const placasNoComprimento = Math.ceil(comprimento / placaDimensions.comprimento)

                          // Escala fixa 1:50
                          const escala = 50
                          const larguraVisual = largura * escala
                          const comprimentoVisual = comprimento * escala
                          const placaLarguraVisual = placaDimensions.largura * escala
                          const placaComprimentoVisual = placaDimensions.comprimento * escala

                          return (
                            <div key={ambiente.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-gray-900">{ambiente.nome}</h4>
                                <div className="text-sm text-gray-600">
                                  {largura.toFixed(2)}m × {comprimento.toFixed(2)}m
                                </div>
                              </div>
                              
                              <div className="flex justify-center mb-4">
                                <div className="relative">
                                  {/* Largura no topo */}
                                  <div className="text-center mb-2 text-sm font-medium text-gray-700">
                                    {largura.toFixed(2)}m
                                  </div>
                                  
                                  <div className="flex items-center">
                                    {/* Comprimento na lateral esquerda */}
                                    <div className="mr-2 flex items-center justify-center" style={{ height: `${comprimentoVisual}px`, minHeight: '150px' }}>
                                      <div className="text-sm font-medium text-gray-700 transform -rotate-90 whitespace-nowrap">
                                        {comprimento.toFixed(2)}m
                                      </div>
                                    </div>
                                    
                                    {/* Desenho do ambiente */}
                                    <div className="relative border border-gray-400" style={{ 
                                      width: `${larguraVisual}px`, 
                                      height: `${comprimentoVisual}px`,
                                      minWidth: '200px',
                                      minHeight: '150px'
                                    }}>
                                  {/* Grid das placas */}
                                  {Array.from({ length: placasNoComprimento }, (_, row) => (
                                    Array.from({ length: placasNaLargura }, (_, col) => {
                                      const x = col * placaLarguraVisual
                                      const y = row * placaComprimentoVisual
                                      
                                      // Verificar se precisa de corte
                                      const precisaCorteL = (col + 1) * placaDimensions.largura > largura
                                      const precisaCorteC = (row + 1) * placaDimensions.comprimento > comprimento

                                      return (
                                        <div
                                          key={`${row}-${col}`}
                                          className={`absolute border border-blue-300 ${
                                            precisaCorteL || precisaCorteC 
                                              ? 'bg-yellow-100 border-yellow-400' 
                                              : 'bg-blue-50'
                                          }`}
                                          style={{
                                            left: `${x}px`,
                                            top: `${y}px`,
                                            width: `${Math.min(placaLarguraVisual, larguraVisual - x)}px`,
                                            height: `${Math.min(placaComprimentoVisual, comprimentoVisual - y)}px`
                                          }}
                                        />
                                      )
                                    })
                                  ))}
                                  
                                  {/* Perfis T verticais */}
                                  {Array.from({ length: placasNaLargura + 1 }, (_, i) => (
                                    <div
                                      key={`v-${i}`}
                                      className="absolute bg-gray-600"
                                      style={{
                                        left: `${Math.min(i * placaLarguraVisual - 1, larguraVisual - 2)}px`,
                                        top: '0px',
                                        width: '2px',
                                        height: `${comprimentoVisual}px`
                                      }}
                                    />
                                  ))}
                                  
                                  {/* Perfis T horizontais */}
                                  {Array.from({ length: placasNoComprimento + 1 }, (_, i) => (
                                    <div
                                      key={`h-${i}`}
                                      className="absolute bg-gray-600"
                                      style={{
                                        left: '0px',
                                        top: `${Math.min(i * placaComprimentoVisual - 1, comprimentoVisual - 2)}px`,
                                        width: `${larguraVisual}px`,
                                        height: '2px'
                                      }}
                                    />
                                  ))}
                                    </div>  {/* Fim desenho do ambiente */}
                                  </div>    {/* Fim flex items-center */}
                                </div>      {/* Fim relative container */}
                              </div>
                              
                              <div className="text-xs text-gray-600 text-center">
                                <div className="mb-2">
                                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded mr-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                                    Placa inteira
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                                    Placa com corte
                                  </span>
                                </div>
                                <div className="text-gray-500">
                                  Escala 1:50
                                </div>
                              </div>
                              
                              {/* Detalhamento de Materiais do Ambiente */}
                              <div className="mt-6 pt-4 border-t border-gray-200">
                                <h5 className="font-medium text-gray-900 mb-4">📋 Materiais do Ambiente</h5>
                                
                                {(() => {
                                  const tipoPlaca = ambiente.especificacoes.tipoPlaca || '0625x125'
                                  const placaDimensions = tipoPlaca === '0625x0625' 
                                    ? { largura: 0.625, comprimento: 0.625 }
                                    : { largura: 0.625, comprimento: 1.25 }
                                  const analise = analisarAmbienteIndividual(ambiente, placaDimensions, tipoPlaca)
                                  
                                  return (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                      {/* Placas */}
                                      <div className="p-3 bg-blue-50 rounded-lg">
                                        <h6 className="font-medium text-blue-900 mb-2 flex items-center text-sm">
                                          <Grid3X3 className="h-4 w-4 mr-2" />
                                          Placas Modulares
                                        </h6>
                                        <div className="space-y-1 text-xs">
                                          <div className="flex justify-between">
                                            <span>Placas inteiras:</span>
                                            <span className="font-medium">{analise.placas.inteiras} un</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Placas p/ recortes:</span>
                                            <span className="font-medium">{analise.placas.recortes} un</span>
                                          </div>
                                          <hr className="border-blue-200" />
                                          <div className="flex justify-between font-semibold">
                                            <span>Total:</span>
                                            <span>{analise.placas.total} placas</span>
                                          </div>
                                          {analise.placas.economia > 0 && (
                                            <div className="text-green-700 text-xs">
                                              💡 Economia: {analise.placas.economia} placas
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Perfis T */}
                                      <div className="p-3 bg-orange-50 rounded-lg">
                                        <h6 className="font-medium text-orange-900 mb-2 flex items-center text-sm">
                                          <Ruler className="h-4 w-4 mr-2" />
                                          Perfis T
                                        </h6>
                                        <div className="space-y-2 text-xs">
                                          <div>
                                            <div className="flex justify-between mb-1">
                                              <span>Perfil T 3,12m:</span>
                                              <span className="font-medium">{analise.perfis.t312.total} un</span>
                                            </div>
                                            {analise.perfis.t312.detalhes && (
                                              <div className="text-xs text-orange-700 pl-3 space-y-1">
                                                <div>• Inteiras: {analise.perfis.t312.detalhes.completos}</div>
                                                <div>• Para recortes: {analise.perfis.t312.detalhes.recortes}</div>
                                                {analise.perfis.t312.detalhes.aproveitamento && analise.perfis.t312.detalhes.aproveitamento.length > 0 && (
                                                  <div>• Plano de corte: {analise.perfis.t312.detalhes.aproveitamento.length} barra{analise.perfis.t312.detalhes.aproveitamento.length !== 1 ? 's' : ''} cortada{analise.perfis.t312.detalhes.aproveitamento.length !== 1 ? 's' : ''}</div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                          
                                          <div>
                                            <div className="flex justify-between mb-1">
                                              <span>Perfil T 1,25m:</span>
                                              <span className="font-medium">{analise.perfis.t125.total} un</span>
                                            </div>
                                            {analise.perfis.t125.detalhes && (
                                              <div className="text-xs text-orange-700 pl-3 space-y-1">
                                                <div>• Inteiras: {analise.perfis.t125.detalhes.completos}</div>
                                                <div>• Para recortes: {analise.perfis.t125.detalhes.recortes}</div>
                                                {analise.perfis.t125.detalhes.aproveitamento && analise.perfis.t125.detalhes.aproveitamento.length > 0 && (
                                                  <div>• Plano de corte: {analise.perfis.t125.detalhes.aproveitamento.length} barra{analise.perfis.t125.detalhes.aproveitamento.length !== 1 ? 's' : ''} cortada{analise.perfis.t125.detalhes.aproveitamento.length !== 1 ? 's' : ''}</div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                          
                                          {analise.perfis.t0625 && (
                                            <div>
                                              <div className="flex justify-between mb-1">
                                                <span>Perfil T 0,625m:</span>
                                                <span className="font-medium">{analise.perfis.t0625.total} un</span>
                                              </div>
                                              {analise.perfis.t0625.detalhes && (
                                                <div className="text-xs text-orange-700 pl-3 space-y-1">
                                                  <div>• Horizontais: {analise.perfis.t0625.detalhes.horizontais}</div>
                                                  <div>• Verticais: {analise.perfis.t0625.detalhes.verticais}</div>
                                                  {(analise.perfis.t0625.detalhes.sobraH > 0 || analise.perfis.t0625.detalhes.sobraV > 0) && (
                                                    <div>• Sobras: 
                                                      {analise.perfis.t0625.detalhes.sobraH > 0 && ` H:${analise.perfis.t0625.detalhes.sobraH.toFixed(2)}m`}
                                                      {analise.perfis.t0625.detalhes.sobraV > 0 && ` V:${analise.perfis.t0625.detalhes.sobraV.toFixed(2)}m`}
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Cantoneiras */}
                                      <div className="p-3 bg-green-50 rounded-lg">
                                        <h6 className="font-medium text-green-900 mb-2 flex items-center text-sm">
                                          <Package className="h-4 w-4 mr-2" />
                                          Cantoneiras (por parede)
                                        </h6>
                                        <div className="space-y-1 text-xs">
                                          <div className="flex justify-between font-semibold">
                                            <span>Total:</span>
                                            <span className="text-green-700">{analise.cantoneiras.total} un</span>
                                          </div>
                                          <hr className="border-green-200" />
                                          <div className="space-y-1">
                                            <div className="text-xs text-green-700">
                                              <div>• Inteiras: {analise.cantoneiras.inteiras} cantoneiras</div>
                                              <div>• Para recortes: {analise.cantoneiras.recortes} cantoneiras</div>
                                              
                                              {analise.cantoneiras.aproveitamento && analise.cantoneiras.aproveitamento.length > 0 && (
                                                <div className="mt-2">
                                                  <div className="font-medium mb-1">Plano de corte:</div>
                                                  <div className="pl-2 space-y-1">
                                                    {analise.cantoneiras.aproveitamento.map((barra, idx) => (
                                                      <div key={idx} className="text-xs">
                                                        <div>Barra {barra.barra}: {barra.uso1.medida}m</div>
                                                        {barra.uso2 && (
                                                          <div className="pl-4">+ {barra.uso2.medida}m</div>
                                                        )}
                                                        {barra.sobra && barra.sobra > 0.01 && (
                                                          <div className="pl-4 text-gray-600">Sobra: {barra.sobra.toFixed(2)}m</div>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })()}

                                {/* Gestão de Sobras */}
                                {(() => {
                                  const tipoPlaca = ambiente.especificacoes.tipoPlaca || '0625x125'
                                  const placaDimensions = tipoPlaca === '0625x0625' 
                                    ? { largura: 0.625, comprimento: 0.625 }
                                    : { largura: 0.625, comprimento: 1.25 }
                                  const analise = analisarAmbienteIndividual(ambiente, placaDimensions, tipoPlaca)
                                  
                                  if (analise.sobras.length > 0) {
                                    return (
                                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                        <h6 className="font-medium text-green-900 mb-2 text-sm">♻️ Sobras Aproveitáveis</h6>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                          {analise.sobras.map((sobra, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                              <span>{sobra.tipo}: {sobra.medida.toFixed(2)}m</span>
                                              <span className="text-green-700 font-medium">
                                                {sobra.aproveitavel ? '✅ Aproveitável' : '❌ Descarte'}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                })()}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}


                {activeTab === 'materiais' && (
                  <div>
                    {result ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Placas e Estrutura</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Placas modulares:</span>
                                <span className="font-medium">{result.placas} un</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Perfil T 3,12m:</span>
                                <span className="font-medium">{result.perfilT312} un</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Perfil T 1,25m:</span>
                                <span className="font-medium">{result.perfilT125} un</span>
                              </div>
                              {result.perfilT625 && (
                                <div className="flex justify-between">
                                  <span>Perfil T 0,625m:</span>
                                  <span className="font-medium">{result.perfilT625} un</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Cantoneiras 3,00m:</span>
                                <span className="font-medium">{result.cantoneiras} un</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Suspensão</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Pendurais:</span>
                                <span className="font-medium">{result.pendurais} un</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Metalon 6,00m:</span>
                                <span className="font-medium">{result.metalon} un</span>
                              </div>
                              <div className="flex justify-between">
                                <span>GN25:</span>
                                <span className="font-medium">{result.gn25} un</span>
                              </div>
                              {result.parafusosBuchasExtras && (
                                <div className="flex justify-between">
                                  <span>Parafusos/Buchas extras:</span>
                                  <span className="font-medium">{result.parafusosBuchasExtras} un</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Fixações</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Chipboard/Buchas:</span>
                                <span className="font-medium">{result.chipboardBuchas} un</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Travas de Placa:</span>
                                <span className="font-medium">{result.travas} un</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Seção de Otimização das Cantoneiras */}
                        {result.cantoneiraOtimizada && (
                          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-medium text-green-900 mb-3 flex items-center">
                              <Package className="h-5 w-5 mr-2" />
                              ♻️ Otimização de Cantoneiras (Por Peça/Parede)
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between font-semibold">
                                <span>Total otimizado:</span>
                                <span className="text-green-700">{result.cantoneiraOtimizada.total} cantoneiras</span>
                              </div>
                              
                              {/* Mostrar plano de corte das cantoneiras */}
                              <div className="text-xs text-green-800">
                                <div className="font-medium mb-2">📋 Plano de Corte:</div>
                                <div className="space-y-2">
                                  <div>• Inteiras: {result.cantoneiraOtimizada.inteiras} cantoneiras</div>
                                  <div>• Para recortes: {result.cantoneiraOtimizada.barrasParaRecortes} cantoneiras</div>
                                  
                                  {result.cantoneiraOtimizada.aproveitamento.length > 0 && (
                                    <div className="mt-2">
                                      <div className="font-medium mb-1">Aproveitamento:</div>
                                      <div className="pl-3 space-y-1">
                                        {result.cantoneiraOtimizada.aproveitamento.map((barra, idx) => (
                                          <div key={idx}>
                                            <div>Barra {barra.barra}: {barra.uso1.medida}m ({barra.uso1.parede})</div>
                                            {barra.uso2 && (
                                              <div className="pl-4">+ {barra.uso2.medida}m ({barra.uso2.parede})</div>
                                            )}
                                            {barra.sobra && barra.sobra > 0.01 && (
                                              <div className="pl-4 text-gray-600">Sobra: {barra.sobra.toFixed(2)}m</div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              
                              <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
                                ✅ Sistema analisa cada parede individualmente para máximo aproveitamento
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <div>Execute o cálculo para ver a lista detalhada de materiais</div>
                        <div className="text-sm mt-1">Inclui placas modulares, perfis T, cantoneiras e pendurais</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botão flutuante para adicionar ambiente */}
          {activeTab === 'medidas' && (
            <button
              onClick={adicionarAmbiente}
              className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-30"
              title="Adicionar novo ambiente"
            >
              <Plus className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Modal para Especificações */}
      {modalAberto.tipo === 'especificacoes' && modalAberto.ambienteId && (() => {
        const ambiente = ambientes.find(a => a.id === modalAberto.ambienteId)
        if (!ambiente) return null
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Especificações do Forro</h3>
                  {ambiente.especificacoes.preenchido && especificacoesPadrao && (
                    <div className="text-sm text-gray-600 mt-1">
                      {ambiente.especificacoes.tipoPlaca === especificacoesPadrao.tipoPlaca &&
                       ambiente.especificacoes.alturaPendural === especificacoesPadrao.alturaPendural &&
                       ambiente.especificacoes.tipoEstrutura === especificacoesPadrao.tipoEstrutura
                        ? "🟢 Usando especificações padrão do projeto"
                        : "🟡 Especificações modificadas"}
                    </div>
                  )}
                  {!ambiente.especificacoes.preenchido && (
                    <div className="text-sm text-gray-600 mt-1">
                      🔴 Especificações não configuradas
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setModalAberto({tipo: null, ambienteId: null})}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {especificacoesPadrao && (
                  ambiente.especificacoes.tipoPlaca !== especificacoesPadrao.tipoPlaca ||
                  ambiente.especificacoes.alturaPendural !== especificacoesPadrao.alturaPendural ||
                  ambiente.especificacoes.tipoEstrutura !== especificacoesPadrao.tipoEstrutura
                ) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-800">
                        Aplicar especificações padrão do projeto?
                      </div>
                      <button
                        onClick={() => {
                          atualizarAmbiente(ambiente.id, 'especificacoes', {
                            tipoPlaca: especificacoesPadrao.tipoPlaca,
                            alturaPendural: especificacoesPadrao.alturaPendural,
                            tipoEstrutura: especificacoesPadrao.tipoEstrutura
                          })
                        }}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Placa</label>
                  <select 
                    className="input-field"
                    value={ambiente.especificacoes.tipoPlaca}
                    onChange={(e) => atualizarAmbiente(ambiente.id, 'especificacoes', { tipoPlaca: e.target.value })}
                  >
                    <option value="0625x1250">0,625 x 1,25m (Padrão)</option>
                    <option value="0625x0625">0,625 x 0,625m (Quadrada)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Altura do Pendural (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={ambiente.especificacoes.alturaPendural}
                    onChange={(e) => atualizarAmbiente(ambiente.id, 'especificacoes', { alturaPendural: e.target.value })}
                    placeholder="Ex: 0.50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Estrutura</label>
                  <select 
                    className="input-field"
                    value={ambiente.especificacoes.tipoEstrutura}
                    onChange={(e) => atualizarAmbiente(ambiente.id, 'especificacoes', { tipoEstrutura: e.target.value })}
                  >
                    <option value="concreto">Concreto</option>
                    <option value="metalica">Metálica</option>
                    <option value="madeira">Madeira</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setModalAberto({tipo: null, ambienteId: null})}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    // Salvar as especificações
                    atualizarAmbiente(ambiente.id, 'especificacoes', { preenchido: true })
                    
                    // Se é a primeira especificação configurada, definir como padrão
                    if (!especificacoesPadrao) {
                      setEspecificacoesPadrao({
                        tipoPlaca: ambiente.especificacoes.tipoPlaca,
                        alturaPendural: ambiente.especificacoes.alturaPendural,
                        tipoEstrutura: ambiente.especificacoes.tipoEstrutura
                      })
                    }
                    
                    setModalAberto({tipo: null, ambienteId: null})
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Modal para Recortes */}
      {modalAberto.tipo === 'recortes' && modalAberto.ambienteId && (() => {
        const ambiente = ambientes.find(a => a.id === modalAberto.ambienteId)
        if (!ambiente) return null
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Recortes do Forro</h3>
                  {ambiente.recortes.preenchido ? (
                    <div className="text-sm text-gray-600 mt-1">
                      {(ambiente.recortes.luminarias && ambiente.recortes.luminarias !== '0') || 
                       (ambiente.recortes.difusores && ambiente.recortes.difusores !== '0') ||
                       (ambiente.recortes.sprinklers && ambiente.recortes.sprinklers !== '0')
                        ? "🟢 Ambiente com recortes configurados"
                        : "🔴 Ambiente sem recortes"}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 mt-1">
                      🔴 Recortes não configurados
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setModalAberto({tipo: null, ambienteId: null})}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs text-blue-800">
                    💡 <strong>Sistema de cores:</strong> 🔴 Sem recortes → 🟢 Com recortes
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Luminárias</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="Quantidade"
                    value={ambiente.recortes.luminarias}
                    onChange={(e) => atualizarAmbiente(ambiente.id, 'recortes', { luminarias: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Difusores de Ar</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="Quantidade"
                    value={ambiente.recortes.difusores}
                    onChange={(e) => atualizarAmbiente(ambiente.id, 'recortes', { difusores: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sprinklers</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="Quantidade"
                    value={ambiente.recortes.sprinklers}
                    onChange={(e) => atualizarAmbiente(ambiente.id, 'recortes', { sprinklers: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setModalAberto({tipo: null, ambienteId: null})}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    atualizarAmbiente(ambiente.id, 'recortes', { preenchido: true })
                    setModalAberto({tipo: null, ambienteId: null})
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}