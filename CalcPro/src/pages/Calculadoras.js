// src/pages/Calculadoras.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

// Hook para useAuth
function useAuth() {
  const context = useContext(AuthContext);
  return context || { usuario: { nome: 'Usuário Teste' } };
}

// Página principal das calculadoras
export function CalculadorasMenu() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('forros');

  const categorias = {
    divisorias: {
      nome: 'Divisórias',
      icon: '🧱',
      cor: 'blue',
      subcategorias: [
        {
          id: 'drywall-divisoria',
          nome: 'Drywall',
          descricao: 'Cálculo de placas, perfis e parafusos para divisórias',
          implementado: false
        },
        {
          id: 'eucatex',
          nome: 'Eucatex',
          descricao: 'Divisórias de eucatex com estrutura metálica',
          implementado: false
        }
      ]
    },
    forros: {
      nome: 'Forros',
      icon: '🏠',
      cor: 'green',
      subcategorias: [
        {
          id: 'drywall-forro',
          nome: 'Drywall',
          descricao: 'Forro de gesso acartonado com perfis metálicos',
          implementado: false
        },
        {
          id: 'modulares',
          nome: 'Modulares',
          descricao: 'Forro modular de fibra mineral ou PVC',
          implementado: false
        },
        {
          id: 'pvc',
          nome: 'PVC',
          descricao: 'Forro de PVC com réguas e perfis',
          implementado: true
        }
      ]
    },
    pisos: {
      nome: 'Pisos',
      icon: '🪨',
      cor: 'purple',
      subcategorias: [
        {
          id: 'laminados',
          nome: 'Laminados',
          descricao: 'Piso laminado de madeira com manta e rodapés',
          implementado: false
        },
        {
          id: 'vinilicos',
          nome: 'Vinílicos',
          descricao: 'Piso vinílico LVT, SPC e manta',
          implementado: false
        }
      ]
    }
  };

  const getCoresPorCategoria = (cor) => {
    const cores = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700',
        gradient: 'from-blue-500 to-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        button: 'bg-green-600 hover:bg-green-700',
        gradient: 'from-green-500 to-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        button: 'bg-purple-600 hover:bg-purple-700',
        gradient: 'from-purple-500 to-purple-600'
      }
    };
    return cores[cor] || cores.blue;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sistema de Calculadoras
        </h1>
        <p className="text-lg text-gray-600">
          Calculadoras especializadas para Divisórias, Forros e Pisos
        </p>
      </div>

      {/* Navegação de Categorias */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {Object.entries(categorias).map(([key, categoria]) => {
            const cores = getCoresPorCategoria(categoria.cor);
            return (
              <button
                key={key}
                onClick={() => setCategoriaAtiva(key)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                  categoriaAtiva === key
                    ? `bg-gradient-to-r ${cores.gradient} text-white shadow-md`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{categoria.icon}</span>
                <span>{categoria.nome}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo da Categoria Ativa */}
      {Object.entries(categorias).map(([key, categoria]) => {
        if (key !== categoriaAtiva) return null;
        
        const cores = getCoresPorCategoria(categoria.cor);
        
        return (
          <div key={key} className="space-y-6">
            <div className={`${cores.bg} ${cores.border} border rounded-lg p-6`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{categoria.icon}</span>
                <h2 className={`text-2xl font-bold ${cores.text}`}>
                  {categoria.nome}
                </h2>
              </div>
            
            <div className="text-sm text-gray-500 text-center">
              💡 Pressione TAB no último comprimento para adicionar novo cômodo
            </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoria.subcategorias.map((sub) => (
                  <div key={sub.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sub.nome}
                      </h3>
                      {sub.implementado ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Disponível
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                          Em Breve
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {sub.descricao}
                    </p>
                    
                    {sub.implementado ? (
                      <Link
                        to={`/calculadoras/${sub.id}`}
                        className={`w-full inline-flex justify-center px-4 py-2 ${cores.button} text-white rounded-md font-medium transition-colors`}
                      >
                        Abrir Calculadora
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed"
                      >
                        Em Desenvolvimento
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Estatísticas */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Status do Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">6</div>
            <div className="text-sm text-gray-600">Calculadoras Planejadas</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">1</div>
            <div className="text-sm text-gray-600">Implementadas</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-gray-600">Em Desenvolvimento</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calculadora específica de Forro PVC
export function CalculadoraForroPVC() {
  const { usuario } = useAuth();
  const [etapa, setEtapa] = useState(2);
  const [comodos, setComodos] = useState([{ nome: "Cômodo 1", largura: 0, comprimento: 0 }]);
  const [medidasExtras, setMedidasExtras] = useState([]);
  const [larguraRegua, setLarguraRegua] = useState(0.2);
  const [comprimentoTemp, setComprimentoTemp] = useState("");
  const [comprimentosDisponiveis, setComprimentosDisponiveis] = useState([4, 5, 6]);
  const [comprimentosCustom, setComprimentosCustom] = useState(false); // Para rastrear se foram customizados
  const [resultados, setResultados] = useState([]);
  const [totais, setTotais] = useState({ reguas: {}, rodaforro: 0, emendas: 0, desperdicioTotal: 0, sobrasRodaforro: [], metalon: 0, parafuso4213: 0, parafusoGN25: 0, parafusoBucha: 0 });
  const [numeroOrcamento, setNumeroOrcamento] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");

  // Header da calculadora específica
  const HeaderCalculadora = () => (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/calculadoras" className="text-green-200 hover:text-white">
            ← Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Calculadora Forro PVC</h1>
            <p className="text-green-100">Otimização automática com aproveitamento de sobras</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-green-200">Usuário:</div>
          <div className="font-medium">{usuario?.nome}</div>
        </div>
      </div>
    </div>
  );

  // NOVA FUNÇÃO: Calcular réguas com emendas para comprimentos maiores que 6m
  const calcularReguasComEmenda = (comprimentoNecessario, reguasDisponiveis) => {
    const comprimentoMaximo = Math.max(...reguasDisponiveis);
    
    // Se o comprimento necessário é maior que a maior régua disponível
    if (comprimentoNecessario > comprimentoMaximo) {
      // Calcular quantas réguas inteiras precisamos
      const reguasInteiras = Math.floor(comprimentoNecessario / comprimentoMaximo);
      const comprimentoRestante = comprimentoNecessario - (reguasInteiras * comprimentoMaximo);
      
      const solucao = {
        tipo: 'emenda',
        reguas: [],
        desperdicioTotal: 0,
        totalReguas: 0,
        descricao: '',
        temEmenda: true,
        numeroEmendas: reguasInteiras // número de emendas será reguasInteiras
      };
      
      // Adicionar réguas inteiras
      if (reguasInteiras > 0) {
        solucao.reguas.push({
          comprimento: comprimentoMaximo,
          quantidade: reguasInteiras,
          uso: 'integral'
        });
        solucao.totalReguas += reguasInteiras;
      }
      
      // Se há comprimento restante, usar a lógica de otimização
      if (comprimentoRestante > 0.01) {
        // Usar a função de otimização para encontrar a melhor solução para o restante
        const melhorParaRestante = encontrarMelhorCombinacao(comprimentoRestante, reguasDisponiveis);
        
        if (melhorParaRestante) {
          // Adicionar as réguas da melhor combinação
          melhorParaRestante.reguas.forEach(regua => {
            solucao.reguas.push(regua);
            solucao.totalReguas += regua.quantidade;
          });
          
          solucao.desperdicioTotal = melhorParaRestante.desperdicioTotal;
          
          // Se for divisão, ajustar a descrição
          if (melhorParaRestante.tipo === 'divisao' && melhorParaRestante.pecasGeradas) {
            solucao.pecasGeradas = melhorParaRestante.pecasGeradas;
          }
        }
      }
      
      // Montar descrição
      const partes = [];
      if (reguasInteiras > 0) {
        partes.push(`${reguasInteiras} régua(s) de ${comprimentoMaximo}m`);
      }
      if (comprimentoRestante > 0.01) {
        const reguasRestante = solucao.reguas.filter(r => r !== solucao.reguas[0]);
        reguasRestante.forEach(regua => {
          if (regua.divisao) {
            partes.push(`1 régua de ${regua.comprimento}m dividida em ${regua.pecasPorRegua} peças`);
          } else if (regua.cortada) {
            partes.push(`${regua.quantidade} régua(s) de ${regua.comprimento}m cortada(s) em ${regua.comprimentoUsado}m`);
          } else {
            partes.push(`${regua.quantidade} régua(s) de ${regua.comprimento}m`);
          }
        });
      }
      
      solucao.descricao = `EMENDA: ${partes.join(' + ')} = ${comprimentoNecessario}m`;
      
      return solucao;
    }
    
    // Se não precisa de emenda, usar a função original
    return encontrarMelhorCombinacao(comprimentoNecessario, reguasDisponiveis);
  };

  // Função original mantida para casos sem emenda
  const encontrarMelhorCombinacao = (comprimentoNecessario, reguasDisponiveis) => {
    const solucoes = [];
    
    // Caso 1: Usar réguas inteiras (sem corte)
    reguasDisponiveis.forEach(regua => {
      if (Math.abs(regua - comprimentoNecessario) <= 0.01) {
        solucoes.push({
          tipo: 'regua_inteira',
          reguas: [{ comprimento: regua, quantidade: 1 }],
          desperdicioTotal: 0,
          totalReguas: 1,
          descricao: `1 régua de ${regua}m (uso integral)`,
          temEmenda: false
        });
      }
    });

    // Caso 2: Cortar réguas (uma régua maior cortada)
    reguasDisponiveis.forEach(regua => {
      if (regua > comprimentoNecessario) {
        const sobra = regua - comprimentoNecessario;
        solucoes.push({
          tipo: 'corte_simples',
          reguas: [{ comprimento: regua, quantidade: 1, cortada: true, comprimentoUsado: comprimentoNecessario }],
          desperdicioTotal: sobra,
          totalReguas: 1,
          descricao: `1 régua de ${regua}m cortada em ${comprimentoNecessario}m (sobra: ${sobra.toFixed(2)}m)`,
          temEmenda: false
        });
      }
    });

    // Caso 3: Dividir réguas (uma régua cortada em múltiplas peças)
    reguasDisponiveis.forEach(regua => {
      const pecasPorRegua = Math.floor(regua / comprimentoNecessario);
      if (pecasPorRegua > 1) {
        const comprimentoUsado = comprimentoNecessario * pecasPorRegua;
        const sobra = regua - comprimentoUsado;
        solucoes.push({
          tipo: 'divisao',
          reguas: [{ comprimento: regua, quantidade: 1, divisao: true, pecasPorRegua: pecasPorRegua }],
          desperdicioTotal: sobra,
          totalReguas: 1,
          pecasGeradas: pecasPorRegua,
          descricao: `1 régua de ${regua}m dividida em ${pecasPorRegua} peças de ${comprimentoNecessario}m (sobra: ${sobra.toFixed(2)}m)`,
          temEmenda: false
        });
      }
    });

    // Caso 4: Combinação de réguas menores
    const gerarCombinacoesRecursivas = (restante, combinacaoAtual, profundidade = 0) => {
      if (profundidade > 10) return;
      
      if (Math.abs(restante) <= 0.01) {
        const desperdicioTotal = 0;
        const totalReguas = combinacaoAtual.reduce((sum, r) => sum + r.quantidade, 0);
        
        solucoes.push({
          tipo: 'combinacao',
          reguas: [...combinacaoAtual],
          desperdicioTotal,
          totalReguas,
          descricao: combinacaoAtual.map(r => `${r.quantidade} régua(s) de ${r.comprimento}m`).join(' + '),
          temEmenda: false
        });
        return;
      }

      reguasDisponiveis.forEach(regua => {
        if (regua <= restante + 0.01) {
          const novaCombinacao = [...combinacaoAtual];
          const existente = novaCombinacao.find(r => r.comprimento === regua);
          
          if (existente) {
            existente.quantidade++;
          } else {
            novaCombinacao.push({ comprimento: regua, quantidade: 1 });
          }
          
          gerarCombinacoesRecursivas(restante - regua, novaCombinacao, profundidade + 1);
        }
      });
    };

    gerarCombinacoesRecursivas(comprimentoNecessario, []);

    // Ordenar soluções
    solucoes.sort((a, b) => {
      if (Math.abs(a.desperdicioTotal - b.desperdicioTotal) > 0.01) {
        return a.desperdicioTotal - b.desperdicioTotal;
      }
      return a.totalReguas - b.totalReguas;
    });

    return solucoes[0] || null;
  };

  // ATUALIZADA: Função para calcular rodaforro com suporte a medidas grandes
  const calcularRodaforroOtimizado = (medidasNecessarias, comodoNome, sobrasAnteriores = []) => {
    const comprimentoBarra = 6;
    
    // Guardar as medidas originais para referência
    const medidasOriginais = [...medidasNecessarias];
    
    // Separar medidas que precisam ser divididas
    const medidasComDivisao = [];
    const medidasNormais = [];
    
    medidasNecessarias.forEach(medida => {
      if (medida > comprimentoBarra) {
        // Calcular quantas barras inteiras e qual o restante
        const barrasInteiras = Math.floor(medida / comprimentoBarra);
        const restante = medida - (barrasInteiras * comprimentoBarra);
        
        // Adicionar as barras inteiras
        for (let i = 0; i < barrasInteiras; i++) {
          medidasComDivisao.push({
            comprimento: comprimentoBarra,
            original: medida,
            tipo: 'barra_inteira_divisao'
          });
        }
        
        // Adicionar o restante se houver
        if (restante > 0.01) {
          medidasComDivisao.push({
            comprimento: restante,
            original: medida,
            tipo: 'restante_divisao'
          });
        }
      } else {
        medidasNormais.push(medida);
      }
    });
    
    // Combinar todas as medidas para processamento
    const todasMedidas = [
      ...medidasNormais,
      ...medidasComDivisao.map(m => m.comprimento)
    ];
    
    // Agrupar medidas iguais
    const medidasAgrupadas = {};
    todasMedidas.forEach(medida => {
      const key = medida.toFixed(2);
      if (!medidasAgrupadas[key]) {
        medidasAgrupadas[key] = 0;
      }
      medidasAgrupadas[key]++;
    });

    // Converter para array ordenado (maior para menor)
    const medidas = Object.entries(medidasAgrupadas)
      .map(([medida, quantidade]) => ({
        comprimento: parseFloat(medida),
        quantidade: quantidade,
        quantidadeOriginal: quantidade
      }))
      .sort((a, b) => b.comprimento - a.comprimento);

    // Primeiro, tentar usar as sobras anteriores
    const pecasAproveitadas = [];
    const sobrasUsadas = [];
    const sobrasRestantes = [...sobrasAnteriores];
    let comprimentoAproveitadoDeSobras = 0;
    
    medidas.forEach(medida => {
      for (let i = 0; i < sobrasRestantes.length && medida.quantidade > 0; i++) {
        const sobra = sobrasRestantes[i];
        
        // Calcular quantas peças desta medida cabem nesta sobra
        const pecasNaSobra = Math.floor(sobra.comprimento / medida.comprimento);
        
        if (pecasNaSobra > 0) {
          const pecasUsadas = Math.min(pecasNaSobra, medida.quantidade);
          medida.quantidade -= pecasUsadas;
          
          pecasAproveitadas.push({
            medida: medida.comprimento,
            quantidade: pecasUsadas,
            origem: sobra.origem
          });
          
          // Atualizar a sobra
          const comprimentoUsado = pecasUsadas * medida.comprimento;
          comprimentoAproveitadoDeSobras += comprimentoUsado;
          sobra.comprimento -= comprimentoUsado;
          
          if (sobra.comprimento <= 0.10) {
            sobrasUsadas.push(i);
          }
        }
      }
    });
    
    // Remover sobras totalmente usadas
    sobrasUsadas.sort((a, b) => b - a).forEach(index => {
      sobrasRestantes.splice(index, 1);
    });

    // Algoritmo de corte para peças restantes - com rastreamento preciso
    const planoCorte = [];
    let barrasNovas = 0;
    let sobraTotal = 0;
    
    // Criar cópia das medidas originais para rastreamento
    const medidasParaProcessar = [];
    medidasOriginais.forEach(medida => {
      if (medida > 6) {
        // Dividir medidas grandes em partes
        const partes = Math.floor(medida / 6);
        const resto = medida - (partes * 6);
        
        // Adicionar partes de 6m
        for (let i = 0; i < partes; i++) {
          medidasParaProcessar.push({ comprimento: 6, paredeOriginal: medida, tipo: 'parte_inteira' });
        }
        
        // Adicionar resto se houver
        if (resto > 0.01) {
          medidasParaProcessar.push({ comprimento: resto, paredeOriginal: medida, tipo: 'resto' });
        }
      } else {
        // Medidas menores que 6m
        medidasParaProcessar.push({ comprimento: medida, paredeOriginal: medida, tipo: 'completa' });
      }
    });
    
    // Contar quantas peças de cada tamanho precisamos
    const contagemNecessaria = {};
    medidasParaProcessar.forEach(item => {
      const key = item.comprimento.toFixed(2);
      if (!contagemNecessaria[key]) {
        contagemNecessaria[key] = { quantidade: 0, paredes: [] };
      }
      contagemNecessaria[key].quantidade++;
      contagemNecessaria[key].paredes.push(item.paredeOriginal);
    });
    
    // Processar medidas aproveitadas primeiro (já foi feito acima)
    
    // Agora processar as barras novas necessárias
    const medidasRestantes = medidas.filter(m => m.quantidade > 0);
    const paredesProcessadas = [...medidasParaProcessar];
    
    while (medidasRestantes.some(m => m.quantidade > 0)) {
      const cortesDestaBarra = [];
      let comprimentoRestante = comprimentoBarra;
      let paredeDestaBarra = 0;
      
      // Tentar encaixar peças nesta barra
      for (let i = 0; i < medidasRestantes.length; i++) {
        const medida = medidasRestantes[i];
        
        while (medida.quantidade > 0 && medida.comprimento <= comprimentoRestante + 0.01) {
          // Procurar na lista de paredes ainda não processadas
          let paredeEncontrada = 0;
          for (let j = 0; j < paredesProcessadas.length; j++) {
            if (Math.abs(paredesProcessadas[j].comprimento - medida.comprimento) < 0.01) {
              paredeEncontrada = paredesProcessadas[j].paredeOriginal;
              paredesProcessadas.splice(j, 1); // Remover para não usar novamente
              break;
            }
          }
          
          if (paredeDestaBarra === 0) {
            paredeDestaBarra = paredeEncontrada;
          }
          
          cortesDestaBarra.push(medida.comprimento);
          medida.quantidade--;
          comprimentoRestante -= medida.comprimento;
        }
      }

      if (cortesDestaBarra.length > 0) {
        barrasNovas++;
        const sobra = comprimentoRestante;
        sobraTotal += sobra;
        
        // Agrupar cortes iguais
        const cortesAgrupados = {};
        cortesDestaBarra.forEach(corte => {
          const key = corte.toFixed(2);
          cortesAgrupados[key] = (cortesAgrupados[key] || 0) + 1;
        });

        planoCorte.push({
          barra: barrasNovas,
          cortes: cortesAgrupados,
          sobra: sobra,
          comprimentoUsado: comprimentoBarra - sobra,
          parede: paredeDestaBarra
        });
        
        // Adicionar sobra aproveitável
        if (sobra > 0.10) {
          sobrasRestantes.push({
            comprimento: sobra,
            origem: comodoNome
          });
        }
      }

      // Remover medidas com quantidade zero
      medidasRestantes.forEach((m, i) => {
        if (m.quantidade === 0) {
          medidasRestantes.splice(i, 1);
        }
      });
    }

    // Gerar instruções de corte formatadas com informação de paredes
    const instrucoesCorte = [];
    
    // Mostrar peças aproveitadas
    if (pecasAproveitadas.length > 0) {
      const aproveitamentosPorOrigem = {};
      pecasAproveitadas.forEach(peca => {
        if (!aproveitamentosPorOrigem[peca.origem]) {
          aproveitamentosPorOrigem[peca.origem] = [];
        }
        aproveitamentosPorOrigem[peca.origem].push(peca);
      });
      
      Object.entries(aproveitamentosPorOrigem).forEach(([origem, pecas]) => {
        const pecasTexto = pecas.map(p => 
          p.quantidade === 1 ? `${p.medida.toFixed(2)}m` : `${p.quantidade}x${p.medida.toFixed(2)}m`
        ).join(' + ');
        instrucoesCorte.push(`Aproveitar ${pecasTexto} da sobra do ${origem}`);
      });
    }
    
    // Gerar instruções agrupadas baseadas no plano de corte
    const grupos = [];
    let grupoAtual = null;
    
    planoCorte.forEach((plano, index) => {
      // Criar chave única para agrupar
      const ehIntegral = Object.keys(plano.cortes).length === 1 && 
                        Math.abs(parseFloat(Object.keys(plano.cortes)[0]) - 6) < 0.01;
      
      const chaveGrupo = `${plano.parede}-${JSON.stringify(plano.cortes)}`;
      
      if (!grupoAtual || grupoAtual.chave !== chaveGrupo) {
        grupoAtual = {
          chave: chaveGrupo,
          barras: [plano.barra],
          parede: plano.parede,
          cortes: plano.cortes,
          sobra: plano.sobra,
          ehIntegral: ehIntegral
        };
        grupos.push(grupoAtual);
      } else {
        grupoAtual.barras.push(plano.barra);
      }
    });
    
    // Ordenar grupos por parede (maior primeiro) e depois por tipo (integral primeiro)
    grupos.sort((a, b) => {
      // Primeiro ordenar por tamanho da parede (maior primeiro)
      if (a.parede !== b.parede) {
        return b.parede - a.parede;
      }
      // Depois ordenar por tipo (integral antes de cortes)
      if (a.ehIntegral !== b.ehIntegral) {
        return a.ehIntegral ? -1 : 1;
      }
      // Por último, ordenar pela primeira barra do grupo
      return a.barras[0] - b.barras[0];
    });
    
    // Gerar instruções baseadas nos grupos ordenados
    grupos.forEach(grupo => {
      let instrucao = '';
      
      if (grupo.barras.length === 1) {
        instrucao = `Barra ${grupo.barras[0]}`;
      } else {
        instrucao = `Barras ${grupo.barras[0]}-${grupo.barras[grupo.barras.length - 1]}`;
      }
      
      instrucao += ` nas paredes de ${grupo.parede.toFixed(2)}m - `;
      
      if (grupo.ehIntegral) {
        instrucao += 'Sem Corte';
      } else {
        const cortesArray = [];
        Object.entries(grupo.cortes).forEach(([medida, qtd]) => {
          const totalPecas = qtd * grupo.barras.length;
          cortesArray.push(totalPecas === 1 ? `${totalPecas} peça de ${medida}m` : `${totalPecas} peças de ${medida}m`);
        });
        
        instrucao += `Cortar ${cortesArray.join(' + ')}`;
        
        if (grupo.sobra > 0.10) {
          const numBarras = grupo.barras.length;
          if (numBarras > 1) {
            instrucao += ` - Sobra: ${numBarras} peças de ${grupo.sobra.toFixed(2)}m`;
          } else {
            instrucao += ` - Sobra: ${grupo.sobra.toFixed(2)}m`;
          }
        }
      }
      
      instrucoesCorte.push(instrucao);
    });

    // Calcular estatísticas
    const totalPecas = medidasNecessarias.length;
    const totalPecasAproveitadas = pecasAproveitadas.reduce((sum, p) => sum + p.quantidade, 0);
    
    // Aproveitamento
    const aproveitamento1 = barrasNovas > 0 
      ? ((comprimentoBarra * barrasNovas - sobraTotal) / (comprimentoBarra * barrasNovas) * 100).toFixed(1)
      : 100;
    
    const comprimentoTotalNecessario = medidasNecessarias.reduce((sum, medida) => sum + medida, 0);
    const comprimentoTotalUsado = (barrasNovas * comprimentoBarra) + comprimentoAproveitadoDeSobras;
    const aproveitamento2 = comprimentoTotalUsado > 0
      ? (comprimentoTotalNecessario / comprimentoTotalUsado * 100).toFixed(1)
      : 100;
    
    return {
      barrasNovas,
      planoCorte,
      instrucoesCorte,
      sobraTotal,
      totalPecas,
      totalPecasAproveitadas,
      aproveitamento1,
      aproveitamento2,
      sobrasRestantes,
      pecasAproveitadas
    };
  };

  const atualizarComodo = (index, campo, valor) => {
    const novos = [...comodos];
    novos[index][campo] = campo === "nome" ? valor : parseFloat(valor) || 0;
    setComodos(novos);
  };

  const atualizarMedidaExtra = (index, campo, valor) => {
    const novas = [...medidasExtras];
    if (campo === "nome" || campo === "tipo") {
      novas[index][campo] = valor;
    } else {
      novas[index][campo] = parseFloat(valor) || 0;
    }
    setMedidasExtras(novas);
  };

  const handleKeyDown = (e, index, campo) => {
    if (e.key === "Tab" && campo === "comprimento" && index === comodos.length - 1) {
      e.preventDefault();
      setComodos([...comodos, { nome: `Cômodo ${comodos.length + 1}`, largura: 0, comprimento: 0 }]);
      setTimeout(() => {
        const novoIndex = comodos.length;
        const novoInput = document.querySelector(`input[data-comodo-nome="${novoIndex}"]`);
        if (novoInput) {
          novoInput.focus();
          novoInput.select();
        }
      }, 50);
    }
    if (e.key === "Enter") {
      setEtapa(3);
    }
  };

  const handleMedidaExtraKeyDown = (e, index, campo) => {
    if (e.key === "Tab" && campo === "comprimento" && index === medidasExtras.length - 1) {
      e.preventDefault();
      adicionarMedidaExtra();
      setTimeout(() => {
        const novoIndex = medidasExtras.length;
        const novoInput = document.querySelector(`input[data-medida-nome="${novoIndex}"]`);
        if (novoInput) {
          novoInput.focus();
          novoInput.select();
        }
      }, 50);
    }
    if (e.key === "Enter") {
      setEtapa(3);
    }
  };

  const handleComprimentoKeyDown = (e) => {
    if (e.key === "Enter" && comprimentoTemp) {
      adicionarComprimento();
    }
    if (e.key === "Tab" && comprimentoTemp) {
      e.preventDefault();
      adicionarComprimento();
    }
  };

  const adicionarComprimento = () => {
    const valor = parseFloat(comprimentoTemp.trim());
    if (!isNaN(valor) && valor > 0) {
      setComprimentosDisponiveis(prev => {
        const novos = [...prev];
        if (!novos.includes(valor)) {
          novos.push(valor);
        }
        return novos.sort((a, b) => a - b); // Ordenar do menor para o maior
      });
      setComprimentosCustom(true);
      setComprimentoTemp("");
      toast.success(`Comprimento ${valor}m adicionado!`);
    } else {
      toast.error("Digite um valor válido!");
    }
  };

  const removerComprimento = (valor) => {
    if (comprimentosDisponiveis.length > 1) {
      setComprimentosDisponiveis(prev => prev.filter(c => c !== valor));
      toast.success(`Comprimento ${valor}m removido!`);
    } else {
      toast.error("Você precisa ter pelo menos um comprimento!");
    }
  };

  const resetarComprimentos = () => {
    setComprimentosDisponiveis([4, 5, 6]);
    setComprimentosCustom(false);
    setComprimentoTemp("");
    toast.success("Comprimentos resetados para o padrão!");
  };

  const removerComodo = (index) => {
    if (comodos.length > 1) {
      const novos = comodos.filter((_, i) => i !== index);
      setComodos(novos);
    }
  };

  const adicionarComodo = () => {
    setComodos([...comodos, { nome: `Cômodo ${comodos.length + 1}`, largura: 0, comprimento: 0 }]);
  };

  const adicionarMedidaExtra = () => {
    setMedidasExtras([...medidasExtras, { 
      nome: `Medida Extra ${medidasExtras.length + 1}`, 
      comprimento: 0, 
      quantidade: 1, 
      tipo: 'linear' 
    }]);
  };

  const removerMedidaExtra = (index) => {
    const novas = medidasExtras.filter((_, i) => i !== index);
    setMedidasExtras(novas);
  };

  // Função para renderizar texto com destaque em vermelho após o hífen
  const renderizarTextoComDestaque = (texto) => {
    if (!texto) return "";
    
    const partes = texto.split(" - ");
    if (partes.length === 1) {
      return <span>{texto}</span>;
    }
    
    return (
      <span>
        {partes[0]} - <span className="text-red-600 font-medium">{partes.slice(1).join(" - ")}</span>
      </span>
    );
  };

  // Nova função para renderizar informações do forro com quebra de linha
  const renderizarInfoForro = (infoForro) => {
    if (!infoForro) return null;
    
    // Dividir por " + " para separar diferentes tipos de réguas
    const partes = infoForro.split(" + ");
    
    return (
      <div className="space-y-1">
        {partes.map((parte, index) => {
          // Ajustar o texto para melhor clareza
          let textoAjustado = parte;
          
          // Substituir textos específicos
          textoAjustado = textoAjustado.replace("Usar integralmente (EMENDA)", "Sem Corte até a EMENDA");
          textoAjustado = textoAjustado.replace("Usar integralmente", "Sem Corte");
          
          return (
            <div key={index} className="text-green-600 text-sm">
              {renderizarTextoComDestaque(textoAjustado)}
            </div>
          );
        })}
      </div>
    );
  };

  // Gerar PDF - Lista de Materiais
  const gerarPDFMateriais = () => {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Lista de Materiais - Forro PVC', 20, 20);
    
    doc.setFontSize(12);
    if (numeroOrcamento) {
      doc.text(`Orçamento: ${numeroOrcamento}`, 20, 30);
    }
    if (nomeCliente) {
      doc.text(`Cliente: ${nomeCliente}`, 20, 37);
    }
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 44);
    
    // Linha divisória
    doc.line(20, 50, 190, 50);
    
    // Lista de materiais
    let yPos = 60;
    doc.setFontSize(14);
    doc.text('Materiais Necessários:', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    
    // Réguas
    Object.entries(totais.reguas)
      .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
      .forEach(([comp, qtd]) => {
        doc.text(`• Régua ${comp}m: ${qtd} unidades`, 25, yPos);
        yPos += 7;
      });
    
    // Outros materiais
    doc.text(`• Rodaforro (barras 6m): ${totais.rodaforro} unidades`, 25, yPos);
    yPos += 7;
    
    if (totais.emendas > 0) {
      doc.text(`• Emendas de PVC (barras 6m): ${totais.emendas} unidades`, 25, yPos);
      yPos += 7;
    }
    
    doc.text(`• Metalon: ${totais.metalon} unidades`, 25, yPos);
    yPos += 7;
    doc.text(`• Parafuso 4.2x13: ${totais.parafuso4213} pacotes`, 25, yPos);
    yPos += 7;
    doc.text(`• Parafuso GN 25: ${totais.parafusoGN25} pacotes`, 25, yPos);
    yPos += 7;
    doc.text(`• Parafuso c/ Bucha: ${totais.parafusoBucha} pacotes`, 25, yPos);
    
    // Resumo
    yPos += 15;
    doc.setFontSize(12);
    doc.text(`Desperdício Total: ${totais.desperdicioTotal.toFixed(2)}m²`, 20, yPos);
    
    // Rodapé
    doc.setFontSize(9);
    doc.setTextColor(128);
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      20,
      280
    );
    doc.text(
      'Página 1',
      180,
      280
    );
    doc.setTextColor(0);
    
    // Salvar
    const nomeArquivo = numeroOrcamento 
      ? `Lista_Materiais_${numeroOrcamento}.pdf`
      : `Lista_Materiais_${new Date().getTime()}.pdf`;
    
    doc.save(nomeArquivo);
  };

  // Gerar PDF - Plano de Corte
  const gerarPDFPlanoCorte = () => {
    const doc = new jsPDF();
    let pageNumber = 1;
    
    // Função auxiliar para adicionar rodapé
    const adicionarRodape = () => {
      doc.setFontSize(9);
      doc.setTextColor(128);
      doc.text(
        `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
        20,
        280
      );
      doc.text(
        `Página ${pageNumber}`,
        180,
        280
      );
      doc.setTextColor(0);
    };
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Plano de Corte - Forro PVC', 20, 20);
    
    doc.setFontSize(12);
    if (numeroOrcamento) {
      doc.text(`Orçamento: ${numeroOrcamento}`, 20, 30);
    }
    if (nomeCliente) {
      doc.text(`Cliente: ${nomeCliente}`, 20, 37);
    }
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 44);
    
    // Linha divisória
    doc.line(20, 50, 190, 50);
    
    let yPos = 60;
    
    // Plano de corte por cômodo
    resultados.forEach((r) => {
      if (r.erro) return;
      
      // Verificar se precisa nova página
      if (yPos > 250) {
        adicionarRodape();
        doc.addPage();
        pageNumber++;
        yPos = 20;
      }
      
      // Nome do cômodo
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(r.nome, 20, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 5;
      
      if (r.tipo === 'comodo') {
        doc.setFontSize(10);
        doc.text(`Dimensões: ${r.largura.toFixed(2)} x ${r.comprimento.toFixed(2)}m - Área: ${r.area?.toFixed(2)}m²`, 25, yPos);
        yPos += 7;
        
        // Forro
        doc.setFontSize(11);
        doc.text('Forro:', 25, yPos);
        yPos += 5;
        doc.setFontSize(10);
        
        const infoForroPartes = r.infoForro.split(' + ');
        infoForroPartes.forEach(parte => {
          doc.text(`  ${parte}`, 30, yPos);
          yPos += 5;
        });
        
        // Rodaforro
        if (r.rodaforro?.instrucoesCorte?.length > 0) {
          yPos += 3;
          doc.setFontSize(11);
          doc.text('Rodaforro:', 25, yPos);
          yPos += 5;
          doc.setFontSize(9);
          
          r.rodaforro.instrucoesCorte.forEach(instrucao => {
            // Quebrar linha se for muito longa
            const maxWidth = 160;
            const lines = doc.splitTextToSize(`• ${instrucao}`, maxWidth);
            lines.forEach(line => {
              doc.text(line, 30, yPos);
              yPos += 4;
            });
          });
        }
        
        // Emendas
        if (r.numeroEmendasComodo > 0) {
          yPos += 3;
          doc.setFontSize(11);
          doc.text('Emendas:', 25, yPos);
          yPos += 5;
          doc.setFontSize(10);
          doc.text(`  ${r.barrasEmenda} barras - Sobra: ${r.sobraEmenda.toFixed(2)}m`, 30, yPos);
          yPos += 5;
        }
      } else {
        // Medidas extras
        doc.setFontSize(10);
        doc.text(`Comprimento: ${r.comprimento}m - Quantidade: ${r.quantidade}`, 25, yPos);
        yPos += 7;
        
        if (r.infoMedida) {
          const infoMedidaPartes = r.infoMedida.split(' + ');
          infoMedidaPartes.forEach(parte => {
            doc.text(`  ${parte}`, 30, yPos);
            yPos += 5;
          });
        }
      }
      
      yPos += 8;
    });
    
    // Rodapé da última página
    adicionarRodape();
    
    // Salvar
    const nomeArquivo = numeroOrcamento 
      ? `Plano_Corte_${numeroOrcamento}.pdf`
      : `Plano_Corte_${new Date().getTime()}.pdf`;
    
    doc.save(nomeArquivo);
  };

  // Gerar ambos os PDFs
  const gerarPDF = () => {
    // Verificar se há resultados
    if (resultados.length === 0) {
      toast.error('Nenhum resultado para gerar PDF!');
      return;
    }
    
    try {
      toast.loading('Gerando PDFs...', { id: 'pdf-loading' });
      
      gerarPDFMateriais();
      
      setTimeout(() => {
        gerarPDFPlanoCorte();
        toast.dismiss('pdf-loading');
        toast.success('2 PDFs gerados com sucesso!', {
          duration: 4000,
          icon: '📄📄'
        });
      }, 500); // Pequeno delay entre os downloads
    } catch (error) {
      toast.dismiss('pdf-loading');
      toast.error('Erro ao gerar PDF');
      console.error(error);
    }
  };

  // Função de impressão
  const imprimir = () => {
    // Verificar se há resultados
    if (resultados.length === 0) {
      toast.error('Nenhum resultado para imprimir!');
      return;
    }
    
    // Perguntar se quer imprimir o plano de corte também
    const imprimirPlanoCorte = window.confirm(
      '🖨️ OPÇÕES DE IMPRESSÃO\n\n' +
      'Deseja incluir o plano de corte detalhado?\n\n' +
      '✅ OK = Imprimir lista de materiais + plano de corte\n' +
      '❌ Cancelar = Imprimir apenas a lista de materiais'
    );

    // Criar conteúdo para impressão
    const conteudoImpressao = `
      <html>
        <head>
          <title>Forro PVC - ${numeroOrcamento || 'Impressão'}</title>
          <style>
            @media print {
              body { 
                margin: 20px; 
                font-family: Arial, sans-serif; 
                line-height: 1.6;
                color: #333;
              }
              h1 { 
                font-size: 24px; 
                margin-bottom: 10px; 
                color: #000;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
              }
              h2 { 
                font-size: 20px; 
                margin-top: 25px; 
                margin-bottom: 15px;
                color: #000;
                background-color: #f0f0f0;
                padding: 8px;
              }
              h3 { 
                font-size: 16px; 
                margin-top: 15px; 
                margin-bottom: 8px;
                color: #333;
              }
              .info { 
                margin-bottom: 20px; 
                background-color: #f9f9f9;
                padding: 10px;
                border: 1px solid #ddd;
              }
              .info p { margin: 5px 0; }
              .lista-materiais { 
                margin-bottom: 30px; 
                list-style-type: none;
                padding: 0;
              }
              .lista-materiais li { 
                margin: 8px 0; 
                padding: 5px;
                border-bottom: 1px solid #eee;
              }
              .comodo { 
                page-break-inside: avoid; 
                margin-bottom: 20px; 
                border: 1px solid #ddd; 
                padding: 15px;
                background-color: #fafafa;
              }
              .plano-corte { page-break-before: always; }
              .instrucao { 
                margin-left: 20px; 
                font-size: 12px;
                color: #555;
              }
              hr { 
                margin: 20px 0; 
                border: none;
                border-top: 1px solid #ccc;
              }
              strong { color: #000; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <h1>Forro PVC - Sistema de Otimização</h1>
          
          <div class="info">
            ${numeroOrcamento ? `<p><strong>Orçamento:</strong> ${numeroOrcamento}</p>` : ''}
            ${nomeCliente ? `<p><strong>Cliente:</strong> ${nomeCliente}</p>` : ''}
            <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <hr>
          
          <h2>Lista de Materiais Consolidada</h2>
          <ul class="lista-materiais">
            ${Object.entries(totais.reguas)
              .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
              .map(([comp, qtd]) => `<li>Régua ${comp}m: <strong>${qtd} unidades</strong></li>`)
              .join('')}
            <li>Rodaforro (barras 6m): <strong>${totais.rodaforro} unidades</strong></li>
            ${totais.emendas > 0 ? `<li>Emendas de PVC (barras 6m): <strong>${totais.emendas} unidades</strong></li>` : ''}
            <li>Metalon: <strong>${totais.metalon} unidades</strong></li>
            <li>Parafuso 4.2x13: <strong>${totais.parafuso4213} pacotes</strong></li>
            <li>Parafuso GN 25: <strong>${totais.parafusoGN25} pacotes</strong></li>
            <li>Parafuso c/ Bucha: <strong>${totais.parafusoBucha} pacotes</strong></li>
          </ul>
          
          <p><strong>Desperdício Total:</strong> ${totais.desperdicioTotal.toFixed(2)}m²</p>
          
          ${imprimirPlanoCorte ? `
            <div class="plano-corte">
              <h2>Plano de Corte Detalhado</h2>
              
              ${resultados.map(r => {
                if (r.erro) return '';
                
                return `
                  <div class="comodo">
                    <h3>${r.nome}</h3>
                    ${r.tipo === 'comodo' ? `
                      <p>Dimensões: ${r.largura.toFixed(2)} x ${r.comprimento.toFixed(2)}m - Área: ${r.area?.toFixed(2)}m²</p>
                      
                      <p><strong>Forro:</strong></p>
                      ${r.infoForro.split(' + ').map(parte => `<p class="instrucao">• ${parte}</p>`).join('')}
                      
                      ${r.rodaforro?.instrucoesCorte?.length > 0 ? `
                        <p><strong>Rodaforro:</strong></p>
                        ${r.rodaforro.instrucoesCorte.map(inst => `<p class="instrucao">• ${inst}</p>`).join('')}
                      ` : ''}
                      
                      ${r.numeroEmendasComodo > 0 ? `
                        <p><strong>Emendas:</strong></p>
                        <p class="instrucao">• ${r.barrasEmenda} barras - Sobra: ${r.sobraEmenda.toFixed(2)}m</p>
                      ` : ''}
                    ` : `
                      <p>Comprimento: ${r.comprimento}m - Quantidade: ${r.quantidade}</p>
                      ${r.infoMedida ? r.infoMedida.split(' + ').map(parte => `<p class="instrucao">• ${parte}</p>`).join('') : ''}
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p>Sistema de Otimização - Forro PVC</p>
          </div>
        </body>
      </html>
    `;

    // Abrir janela de impressão
    const janelaImpressao = window.open('', '_blank');
    janelaImpressao.document.write(conteudoImpressao);
    janelaImpressao.document.close();
    janelaImpressao.focus();
    
    setTimeout(() => {
      janelaImpressao.print();
      janelaImpressao.close();
    }, 500);
    
    toast.success('Preparando impressão...', {
      duration: 2000,
      icon: '🖨️'
    });
  };

  // Continuar com o resto da implementação da calculadora...
  useEffect(() => {
    if (etapa !== 3) return;

    const totaisLocais = { reguas: {}, rodaforro: 0, emendas: 0, desperdicioTotal: 0, sobrasRodaforro: [], metalon: 0, parafuso4213: 0, parafusoGN25: 0, parafusoBucha: 0 };
    let totalMetrosLineares = 0;
    let totalMetrosQuadrados = 0;
    let totalPerimetro = 0;

    // Calcular cômodos
    let sobrasRodaforroAcumuladas = [];
    
    const resultadosComodos = comodos.map((comodo) => {
      if (comodo.largura <= 0 || comodo.comprimento <= 0) {
        return {
          nome: comodo.nome,
          largura: comodo.largura,
          comprimento: comodo.comprimento,
          erro: "Dimensões inválidas",
          tipo: 'comodo'
        };
      }

      const fileiras = Math.ceil(comodo.largura / larguraRegua);
      
      // Calcular número de emendas se o comprimento for maior que 6m
      let numeroEmendasComodo = 0;
      let barrasEmenda = 0;
      let sobraEmenda = 0;
      
      if (comodo.comprimento > 6) {
        // Calcular quantas emendas são necessárias ao longo do comprimento
        const numeroEmendasNecessarias = Math.floor(comodo.comprimento / 6);
        
        // Total de metros lineares de emenda necessários
        const metrosLinearesEmenda = comodo.largura * numeroEmendasNecessarias;
        
        // Calcular quantas barras de 6m são necessárias
        barrasEmenda = Math.ceil(metrosLinearesEmenda / 6);
        
        // Calcular sobra real
        const comprimentoTotal = barrasEmenda * 6;
        const comprimentoUsado = metrosLinearesEmenda;
        sobraEmenda = comprimentoTotal - comprimentoUsado;
        
        // Número de emendas para exibição
        numeroEmendasComodo = numeroEmendasNecessarias;
        
        totaisLocais.emendas += barrasEmenda;
      }
      
      // MUDANÇA: Usar a nova função que suporta emendas
      const melhorCombinacao = calcularReguasComEmenda(comodo.comprimento, comprimentosDisponiveis);
      
      let detalhesOtimizacao = [];
      let desperdicioTotal = 0;
      let totalReguasComodo = 0;
      let infoForro = "";

      if (melhorCombinacao) {
        // Adicionar aviso se tem emenda
        if (melhorCombinacao.temEmenda) {
          detalhesOtimizacao.push(`⚠️ EMENDA NECESSÁRIA: Comprimento ${comodo.comprimento}m > 6m`);
          detalhesOtimizacao.push(`Número de emendas por fileira: ${melhorCombinacao.numeroEmendas}`);
        }
        
        if (melhorCombinacao.tipo === 'divisao') {
          const reguasNecessarias = Math.ceil(fileiras / melhorCombinacao.pecasGeradas);
          totalReguasComodo = reguasNecessarias;
          
          const areaReguasUsadas = reguasNecessarias * melhorCombinacao.reguas[0].comprimento * larguraRegua;
          const areaComodoReal = comodo.largura * comodo.comprimento;
          desperdicioTotal = areaReguasUsadas - areaComodoReal;
          
          const regua = melhorCombinacao.reguas[0];
          totaisLocais.reguas[regua.comprimento] = (totaisLocais.reguas[regua.comprimento] || 0) + reguasNecessarias;
          
          infoForro = `${reguasNecessarias} Réguas de ${regua.comprimento} metros - Cortar ${reguasNecessarias * regua.pecasPorRegua} peça(s) de ${comodo.comprimento}m`;
          
          detalhesOtimizacao.push(`${reguasNecessarias} régua(s) de ${regua.comprimento}m`);
          detalhesOtimizacao.push(`Cada régua gera ${regua.pecasPorRegua} peça(s) de ${comodo.comprimento}m`);
          detalhesOtimizacao.push(`Total de peças geradas: ${reguasNecessarias * regua.pecasPorRegua} (necessárias: ${fileiras})`);
          detalhesOtimizacao.push(`Área das réguas: ${areaReguasUsadas.toFixed(2)}m² vs Área do cômodo: ${areaComodoReal.toFixed(2)}m²`);
          
          if (desperdicioTotal > 0.01) {
            detalhesOtimizacao.push(`Desperdício: ${desperdicioTotal.toFixed(2)}m²`);
          } else {
            detalhesOtimizacao.push('🎯 ZERO DESPERDÍCIO!');
          }
        } else if (melhorCombinacao.tipo === 'emenda') {
          // Calcular para casos com emenda
          let areaReguasUsadas = 0;
          let partesInfo = [];
          
          // Se tem pecasGeradas (caso de divisão no restante), calcular de forma especial
          if (melhorCombinacao.pecasGeradas) {
            // Parte 1: Réguas inteiras
            const reguasInteiras = melhorCombinacao.reguas[0];
            const quantidadeInteiras = reguasInteiras.quantidade * fileiras;
            areaReguasUsadas += quantidadeInteiras * reguasInteiras.comprimento * larguraRegua;
            
            totaisLocais.reguas[reguasInteiras.comprimento] = (totaisLocais.reguas[reguasInteiras.comprimento] || 0) + quantidadeInteiras;
            
            partesInfo.push(`${quantidadeInteiras} Réguas de ${reguasInteiras.comprimento}m - Sem Corte até a EMENDA`);
            detalhesOtimizacao.push(`${quantidadeInteiras} régua(s) de ${reguasInteiras.comprimento}m (uso integral para emenda)`);
            
            // Parte 2: Régua para divisão
            const reguaDivisao = melhorCombinacao.reguas[1];
            const reguasNecessariasParaDivisao = Math.ceil(fileiras / reguaDivisao.pecasPorRegua);
            totalReguasComodo = quantidadeInteiras + reguasNecessariasParaDivisao;
            
            areaReguasUsadas += reguasNecessariasParaDivisao * reguaDivisao.comprimento * larguraRegua;
            
            totaisLocais.reguas[reguaDivisao.comprimento] = (totaisLocais.reguas[reguaDivisao.comprimento] || 0) + reguasNecessariasParaDivisao;
            
            const comprimentoRestante = comodo.comprimento - (reguasInteiras.comprimento * reguasInteiras.quantidade);
            const totalPecasGeradas = reguasNecessariasParaDivisao * reguaDivisao.pecasPorRegua;
            partesInfo.push(`${reguasNecessariasParaDivisao} Réguas de ${reguaDivisao.comprimento}m - Cortar ${totalPecasGeradas} peça(s) de ${comprimentoRestante}m`);
            detalhesOtimizacao.push(`${reguasNecessariasParaDivisao} régua(s) de ${reguaDivisao.comprimento}m para divisão`);
            detalhesOtimizacao.push(`Cada régua de ${reguaDivisao.comprimento}m gera ${reguaDivisao.pecasPorRegua} peça(s) de ${comprimentoRestante}m`);
            detalhesOtimizacao.push(`Total: ${totalPecasGeradas} peças de ${comprimentoRestante}m (necessárias: ${fileiras})`);
            
            
            infoForro = partesInfo.join(" + ");
          } else {
            // Caso normal de emenda
            totalReguasComodo = melhorCombinacao.totalReguas * fileiras;
            
            melhorCombinacao.reguas.forEach(regua => {
              const quantidadeTotal = regua.quantidade * fileiras;
              const comprimentoUtilizado = regua.cortada ? regua.comprimentoUsado : regua.comprimento;
              areaReguasUsadas += quantidadeTotal * comprimentoUtilizado * larguraRegua;
              
              totaisLocais.reguas[regua.comprimento] = (totaisLocais.reguas[regua.comprimento] || 0) + quantidadeTotal;
              
              if (regua.uso === 'integral') {
                partesInfo.push(`${quantidadeTotal} Réguas de ${regua.comprimento}m - Usar integralmente (EMENDA)`);
                detalhesOtimizacao.push(`${quantidadeTotal} régua(s) de ${regua.comprimento}m (uso integral para emenda)`);
              } else if (regua.cortada) {
                partesInfo.push(`${quantidadeTotal} Réguas de ${regua.comprimento}m - Cortar 1 peça de ${regua.comprimentoUsado}m`);
                detalhesOtimizacao.push(`${quantidadeTotal} régua(s) de ${regua.comprimento}m cortada(s) em ${regua.comprimentoUsado}m`);
              } else {
                partesInfo.push(`${quantidadeTotal} Réguas de ${regua.comprimento}m - Usar integralmente`);
                detalhesOtimizacao.push(`${quantidadeTotal} régua(s) de ${regua.comprimento}m (uso integral)`);
              }
            });
            
            infoForro = partesInfo.join(" + ");
          }
          
          const areaComodoReal = comodo.largura * comodo.comprimento;
          desperdicioTotal = areaReguasUsadas - areaComodoReal;
          
          detalhesOtimizacao.push(`Área das réguas: ${areaReguasUsadas.toFixed(2)}m² vs Área do cômodo: ${areaComodoReal.toFixed(2)}m²`);
          
          if (desperdicioTotal > 0.01) {
            detalhesOtimizacao.push(`Desperdício: ${desperdicioTotal.toFixed(2)}m²`);
          } else {
            detalhesOtimizacao.push('🎯 ZERO DESPERDÍCIO!');
          }
        } else {
          // Casos normais sem emenda
          totalReguasComodo = melhorCombinacao.totalReguas * fileiras;
          
          let areaReguasUsadas = 0;
          melhorCombinacao.reguas.forEach(regua => {
            const quantidadeTotal = regua.quantidade * fileiras;
            const comprimentoUtilizado = regua.cortada ? regua.comprimentoUsado : regua.comprimento;
            areaReguasUsadas += quantidadeTotal * comprimentoUtilizado * larguraRegua;
          });
          
          const areaComodoReal = comodo.largura * comodo.comprimento;
          desperdicioTotal = areaReguasUsadas - areaComodoReal;
          
          let partesInfo = [];
          melhorCombinacao.reguas.forEach(regua => {
            const quantidadeTotal = regua.quantidade * fileiras;
            if (regua.cortada) {
              partesInfo.push(`${quantidadeTotal} Réguas de ${regua.comprimento}m - Cortar 1 peça de ${regua.comprimentoUsado}m em cada régua`);
            } else {
              partesInfo.push(`${quantidadeTotal} Réguas de ${regua.comprimento}m - Sem Corte`);
            }
          });
          infoForro = partesInfo.join(" + ");
          
          melhorCombinacao.reguas.forEach(regua => {
            const quantidadeTotal = regua.quantidade * fileiras;
            totaisLocais.reguas[regua.comprimento] = (totaisLocais.reguas[regua.comprimento] || 0) + quantidadeTotal;
            
            if (regua.cortada) {
              detalhesOtimizacao.push(`${quantidadeTotal} régua(s) de ${regua.comprimento}m cortada(s) em ${regua.comprimentoUsado}m`);
            } else {
              detalhesOtimizacao.push(`${quantidadeTotal} régua(s) de ${regua.comprimento}m (uso integral)`);
            }
          });
          
          detalhesOtimizacao.push(`Área das réguas: ${areaReguasUsadas.toFixed(2)}m² vs Área do cômodo: ${areaComodoReal.toFixed(2)}m²`);
          
          if (desperdicioTotal > 0.01) {
            detalhesOtimizacao.push(`Desperdício: ${desperdicioTotal.toFixed(2)}m²`);
          } else {
            detalhesOtimizacao.push('🎯 ZERO DESPERDÍCIO!');
          }
        }
      }

      totaisLocais.desperdicioTotal += desperdicioTotal;

      // Calcular rodaforro com nova função otimizada
      const medidasRodaforro = [comodo.largura, comodo.largura, comodo.comprimento, comodo.comprimento];
      const resultadoRodaforro = calcularRodaforroOtimizado(medidasRodaforro, comodo.nome, sobrasRodaforroAcumuladas);
      
      sobrasRodaforroAcumuladas = resultadoRodaforro.sobrasRestantes;
      
      totaisLocais.rodaforro += resultadoRodaforro.barrasNovas;

      // Calcular totais
      const areaComodo = comodo.largura * comodo.comprimento;
      const perimetroComodo = 2 * (comodo.largura + comodo.comprimento);
      
      totalMetrosQuadrados += areaComodo;
      totalMetrosLineares += totalReguasComodo * comodo.comprimento;
      totalPerimetro += perimetroComodo;

      return {
        nome: comodo.nome,
        largura: comodo.largura,
        comprimento: comodo.comprimento,
        fileiras,
        totalReguasComodo,
        infoForro,
        desperdicioTotal,
        rodaforro: {
          barrasNovas: resultadoRodaforro.barrasNovas,
          totalPecas: resultadoRodaforro.totalPecas,
          totalPecasAproveitadas: resultadoRodaforro.totalPecasAproveitadas,
          aproveitamento1: resultadoRodaforro.aproveitamento1,
          aproveitamento2: resultadoRodaforro.aproveitamento2,
          instrucoesCorte: resultadoRodaforro.instrucoesCorte,
          planoCorte: resultadoRodaforro.planoCorte,
          sobraTotal: resultadoRodaforro.sobraTotal,
          pecasAproveitadas: resultadoRodaforro.pecasAproveitadas
        },
        detalhesOtimizacao,
        algoritmoUsado: melhorCombinacao?.tipo || 'nenhum',
        area: areaComodo,
        perimetro: perimetroComodo,
        tipo: 'comodo',
        temEmenda: melhorCombinacao?.temEmenda || false,
        numeroEmendas: melhorCombinacao?.numeroEmendas || 0,
        numeroEmendasComodo: numeroEmendasComodo,
        barrasEmenda: barrasEmenda,
        sobraEmenda: sobraEmenda
      };
    });

    // Calcular medidas extras
    const resultadosMedidasExtras = medidasExtras.map((medida) => {
      if (medida.comprimento <= 0 || medida.quantidade <= 0) {
        return {
          nome: medida.nome,
          comprimento: medida.comprimento,
          quantidade: medida.quantidade,
          tipo: 'medida_extra',
          erro: "Valores inválidos"
        };
      }

      const melhorCombinacao = calcularReguasComEmenda(medida.comprimento, comprimentosDisponiveis);
      
      let detalhesOtimizacao = [];
      let desperdicioTotal = 0;
      let totalReguasMedida = 0;
      let infoMedida = "";

      if (melhorCombinacao) {
        if (melhorCombinacao.temEmenda) {
          detalhesOtimizacao.push(`⚠️ EMENDA NECESSÁRIA: Comprimento ${medida.comprimento}m > 6m`);
        }
        
        if (melhorCombinacao.tipo === 'divisao') {
          const reguasNecessarias = Math.ceil(medida.quantidade / melhorCombinacao.pecasGeradas);
          totalReguasMedida = reguasNecessarias;
          
          const comprimentoTotal = reguasNecessarias * melhorCombinacao.reguas[0].comprimento;
          const comprimentoNecessario = medida.quantidade * medida.comprimento;
          const comprimentoDesperdiciado = comprimentoTotal - comprimentoNecessario;
          desperdicioTotal = comprimentoDesperdiciado * larguraRegua;
          
          const regua = melhorCombinacao.reguas[0];
          totaisLocais.reguas[regua.comprimento] = (totaisLocais.reguas[regua.comprimento] || 0) + reguasNecessarias;
          
          infoMedida = `${reguasNecessarias} Réguas de ${regua.comprimento} metros - Cortar ${reguasNecessarias * regua.pecasPorRegua} peça(s) de ${medida.comprimento}m`;
          
          detalhesOtimizacao.push(`${reguasNecessarias} régua(s) de ${regua.comprimento}m`);
          detalhesOtimizacao.push(`Cada régua gera ${regua.pecasPorRegua} peça(s) de ${medida.comprimento}m`);
          detalhesOtimizacao.push(`Total de peças geradas: ${reguasNecessarias * regua.pecasPorRegua} (necessárias: ${medida.quantidade})`);
          
          if (desperdicioTotal > 0.01) {
            detalhesOtimizacao.push(`Desperdício: ${desperdicioTotal.toFixed(2)}m² (${comprimentoDesperdiciado.toFixed(2)}m lineares)`);
          } else {
            detalhesOtimizacao.push('🎯 ZERO DESPERDÍCIO!');
          }
        } else {
          totalReguasMedida = melhorCombinacao.totalReguas * medida.quantidade;
          
          let comprimentoTotalReguas = 0;
          melhorCombinacao.reguas.forEach(regua => {
            const quantidadeTotal = regua.quantidade * medida.quantidade;
            const comprimentoUtilizado = regua.cortada ? regua.comprimentoUsado : regua.comprimento;
            comprimentoTotalReguas += quantidadeTotal * (regua.cortada ? regua.comprimento : comprimentoUtilizado);
          });
          
          const comprimentoNecessario = medida.quantidade * medida.comprimento;
          const comprimentoDesperdiciado = comprimentoTotalReguas - comprimentoNecessario;
          desperdicioTotal = comprimentoDesperdiciado * larguraRegua;
          
          let partesInfo = [];
          melhorCombinacao.reguas.forEach(regua => {
            const quantidadeTotal = regua.quantidade * medida.quantidade;
            if (regua.cortada) {
              partesInfo.push(`${quantidadeTotal} Réguas de ${regua.comprimento}m - Cortar 1 peça de ${regua.comprimentoUsado}m em cada régua`);
            } else {
              partesInfo.push(`${quantidadeTotal} Réguas de ${regua.comprimento}m - Usar integralmente`);
            }
          });
          infoMedida = partesInfo.join(" + ");
          
          melhorCombinacao.reguas.forEach(regua => {
            const quantidadeTotal = regua.quantidade * medida.quantidade;
            totaisLocais.reguas[regua.comprimento] = (totaisLocais.reguas[regua.comprimento] || 0) + quantidadeTotal;
            
            if (regua.cortada) {
              detalhesOtimizacao.push(`${quantidadeTotal} régua(s) de ${regua.comprimento}m cortada(s) em ${regua.comprimentoUsado}m`);
            } else {
              detalhesOtimizacao.push(`${quantidadeTotal} régua(s) de ${regua.comprimento}m (uso integral)`);
            }
          });
          
          if (desperdicioTotal > 0.01) {
            detalhesOtimizacao.push(`Desperdício: ${desperdicioTotal.toFixed(2)}m² (${comprimentoDesperdiciado.toFixed(2)}m lineares)`);
          } else {
            detalhesOtimizacao.push('🎯 ZERO DESPERDÍCIO!');
          }
        }
      }

      totaisLocais.desperdicioTotal += desperdicioTotal;
      totalMetrosLineares += totalReguasMedida * medida.comprimento;

      return {
        nome: medida.nome,
        comprimento: medida.comprimento,
        quantidade: medida.quantidade,
        totalReguasMedida,
        infoMedida,
        desperdicioTotal,
        detalhesOtimizacao,
        algoritmoUsado: melhorCombinacao?.tipo || 'nenhum',
        tipo: 'medida_extra',
        temEmenda: melhorCombinacao?.temEmenda || false
      };
    });

    // Calcular materiais auxiliares
    totaisLocais.metalon = Math.ceil(totalMetrosQuadrados / 1.9);
    totaisLocais.parafuso4213 = Math.ceil((totalMetrosLineares / 0.5) / 100);
    totaisLocais.parafusoGN25 = Math.ceil((totalMetrosQuadrados * 6) / 100);
    totaisLocais.parafusoBucha = Math.ceil((totalPerimetro / 0.5) / 100);

    // Combinar todos os resultados
    const todosResultados = [...resultadosComodos, ...resultadosMedidasExtras];
    
    setResultados(todosResultados);
    setTotais(totaisLocais);
  }, [etapa, larguraRegua, comprimentosDisponiveis, comodos, medidasExtras]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeaderCalculadora />
      
      {etapa === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Largura da régua de PVC (m): 
                <span className="text-xs text-gray-500 ml-2">Padrão: 0.20m</span>
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={larguraRegua} 
                  onChange={(e) => setLarguraRegua(parseFloat(e.target.value) || 0)} 
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.01"
                  min="0.01"
                  max="1"
                />
                <button
                  onClick={() => {
                    setLarguraRegua(0.2);
                    toast.success("Largura resetada para 0.20m");
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                  title="Resetar para padrão"
                >
                  ↺
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Larguras comuns: 0.10m, 0.20m, 0.25m</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setLarguraRegua(0.10)}
                  className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  10cm
                </button>
                <button
                  onClick={() => setLarguraRegua(0.20)}
                  className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  20cm
                </button>
                <button
                  onClick={() => setLarguraRegua(0.25)}
                  className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  25cm
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comprimentos disponíveis:</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={comprimentoTemp} 
                  onChange={(e) => setComprimentoTemp(e.target.value)} 
                  onKeyDown={handleComprimentoKeyDown}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 3.5"
                  step="0.1"
                  min="0.1"
                />
                <button
                  onClick={adicionarComprimento}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Adicionar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Pressione Enter ou clique em Adicionar</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-green-800">
                Comprimentos Disponíveis: {comprimentosCustom && <span className="text-xs bg-green-200 px-2 py-1 rounded">Customizado</span>}
              </h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setComprimentosDisponiveis([3, 4, 5, 6]);
                    setComprimentosCustom(true);
                    toast.success("Preset 3-6m carregado!");
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  title="Carregar preset 3, 4, 5, 6m"
                >
                  3-6m
                </button>
                <button 
                  onClick={() => {
                    setComprimentosDisponiveis([2, 2.5, 3, 4, 5, 6]);
                    setComprimentosCustom(true);
                    toast.success("Preset completo carregado!");
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  title="Carregar preset completo"
                >
                  Completo
                </button>
                <button 
                  onClick={resetarComprimentos}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm transition-colors"
                >
                  🔄 Resetar
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {comprimentosDisponiveis.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  <span className="text-sm font-medium">{comp}m</span>
                  {comprimentosDisponiveis.length > 1 && (
                    <button
                      onClick={() => removerComprimento(comp)}
                      className="ml-1 text-red-600 hover:text-red-800 font-bold text-lg leading-none"
                      title={`Remover ${comp}m`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 Dica: Use os presets ou adicione comprimentos personalizados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Nº do orçamento" 
              value={numeroOrcamento} 
              onChange={(e) => setNumeroOrcamento(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input 
              placeholder="Nome do cliente" 
              value={nomeCliente} 
              onChange={(e) => setNomeCliente(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Cômodos:</h3>
              <button 
                onClick={adicionarComodo}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
              >
                + Adicionar Cômodo
              </button>
            </div>
            
            {comodos.map((c, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <input 
                    value={c.nome} 
                    onChange={(e) => atualizarComodo(i, "nome", e.target.value)} 
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nome do cômodo"
                    data-comodo-nome={i}
                  />
                  <input 
                    type="number" 
                    placeholder="Largura (m)" 
                    value={c.largura || ""} 
                    onChange={(e) => atualizarComodo(i, "largura", e.target.value)} 
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                  <input 
                    type="number" 
                    placeholder="Comprimento (m)" 
                    value={c.comprimento || ""} 
                    onChange={(e) => atualizarComodo(i, "comprimento", e.target.value)} 
                    onKeyDown={(e) => handleKeyDown(e, i, "comprimento")}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                  {comodos.length > 1 && (
                    <button 
                      onClick={() => removerComodo(i)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="text-sm text-gray-500 text-center">
              💡 Pressione TAB no último comprimento para adicionar novo cômodo
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Medidas Extras:</h3>
              <div className="text-sm text-gray-500">
                💡 Pressione TAB no último comprimento para adicionar nova medida
              </div>
            </div>
            
            {medidasExtras.length > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-3">💡 Medidas Extras - Para peças específicas que não são cômodos completos</h4>
                <div className="space-y-3">
                  {medidasExtras.map((m, i) => (
                    <div key={i} className="bg-white p-3 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                        <input 
                          value={m.nome} 
                          onChange={(e) => atualizarMedidaExtra(i, "nome", e.target.value)} 
                          onKeyDown={(e) => handleMedidaExtraKeyDown(e, i, "nome")}
                          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Nome da medida"
                          data-medida-nome={i}
                        />
                        <input 
                          type="number" 
                          placeholder="Comprimento (m)" 
                          value={m.comprimento || ""} 
                          onChange={(e) => atualizarMedidaExtra(i, "comprimento", e.target.value)} 
                          onKeyDown={(e) => handleMedidaExtraKeyDown(e, i, "comprimento")}
                          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          step="0.01"
                          min="0"
                        />
                        <input 
                          type="number" 
                          placeholder="Quantidade" 
                          value={m.quantidade || ""} 
                          onChange={(e) => atualizarMedidaExtra(i, "quantidade", e.target.value)} 
                          onKeyDown={(e) => handleMedidaExtraKeyDown(e, i, "quantidade")}
                          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          min="1"
                        />
                        <select 
                          value={m.tipo} 
                          onChange={(e) => atualizarMedidaExtra(i, "tipo", e.target.value)}
                          onKeyDown={(e) => handleMedidaExtraKeyDown(e, i, "tipo")}
                          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="linear">Linear</option>
                          <option value="acabamento">Acabamento</option>
                          <option value="reforco">Reforço</option>
                        </select>
                        <button 
                          onClick={() => removerMedidaExtra(i)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <button 
                onClick={adicionarMedidaExtra}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm"
              >
                + Adicionar Primeira Medida Extra
              </button>
            </div>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-green-800 font-medium mb-2">⌨️ Atalhos de Teclado:</p>
            <div className="text-sm text-green-700 space-y-1">
              <p>• <kbd className="px-2 py-1 bg-green-200 rounded">TAB</kbd> no último campo para adicionar nova linha</p>
              <p>• <kbd className="px-2 py-1 bg-green-200 rounded">ENTER</kbd> em qualquer campo para calcular</p>
            </div>
          </div>

          <button 
            onClick={() => setEtapa(3)}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold text-lg"
          >
            Calcular Materiais
          </button>
        </div>
      )}

      {etapa === 3 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Resultados do Cálculo</h2>
            <div className="flex space-x-2">
              <button 
                onClick={imprimir}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                title="Imprimir lista de materiais (com opção do plano de corte)"
              >
                🖨️ Imprimir
              </button>
              <button 
                onClick={gerarPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                title="Gera 2 PDFs: Lista de Materiais + Plano de Corte"
              >
                📄 PDF (2 arquivos)
              </button>
              <button 
                onClick={() => setEtapa(2)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                ✏️ Editar
              </button>
            </div>
          </div>

          {numeroOrcamento && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">
                Orçamento: {numeroOrcamento} {nomeCliente && `- ${nomeCliente}`}
              </h3>
            </div>
          )}
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">📋 Lista de Materiais Consolidada</h3>
            
            <ul className="space-y-2">
              {Object.entries(totais.reguas)
                .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
                .map(([comp, qtd], idx) => (
                <li key={idx} className="flex justify-between items-center bg-white p-2 rounded border">
                  <span className="text-gray-700">Régua {comp}m:</span>
                  <span className="font-semibold text-green-700">{qtd} unidades</span>
                </li>
              ))}
              <li className="flex justify-between items-center bg-white p-2 rounded border">
                <span className="text-gray-700">Rodaforro (barras 6m):</span>
                <span className="font-semibold text-green-700">{totais.rodaforro} unidades</span>
              </li>
              {totais.emendas > 0 && (
                <li className="flex justify-between items-center bg-white p-2 rounded border">
                  <span className="text-gray-700">Emendas de PVC (barras 6m):</span>
                  <span className="font-semibold text-green-700">{totais.emendas} unidades</span>
                </li>
              )}
              <li className="flex justify-between items-center bg-white p-2 rounded border">
                <span className="text-gray-700">Metalon:</span>
                <span className="font-semibold text-green-700">{totais.metalon} unidades</span>
              </li>
              <li className="flex justify-between items-center bg-white p-2 rounded border">
                <span className="text-gray-700">Parafuso 4.2x13:</span>
                <span className="font-semibold text-green-700">{totais.parafuso4213} pacotes</span>
              </li>
              <li className="flex justify-between items-center bg-white p-2 rounded border">
                <span className="text-gray-700">Parafuso GN 25:</span>
                <span className="font-semibold text-green-700">{totais.parafusoGN25} pacotes</span>
              </li>
              <li className="flex justify-between items-center bg-white p-2 rounded border">
                <span className="text-gray-700">Parafuso c/ Bucha:</span>
                <span className="font-semibold text-green-700">{totais.parafusoBucha} pacotes</span>
              </li>
            </ul>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8">Planos de Corte</h2>
          
          {resultados.map((r, i) => (
            <div key={i} className={`border rounded-lg p-6 shadow-sm ${r.tipo === 'comodo' ? 'bg-white border-gray-200' : 'bg-orange-50 border-orange-200'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${r.tipo === 'comodo' ? 'text-gray-800' : 'text-orange-800'}`}>
                {r.tipo === 'comodo' ? '🏠' : '📏'} {r.nome}
                {r.tipo === 'comodo' && r.largura && r.comprimento && (
                  <span className="ml-2 text-base font-normal text-gray-600">
                    {r.largura.toFixed(2)} x {r.comprimento.toFixed(2)} - {r.area?.toFixed(2)}m²
                  </span>
                )}
              </h3>
              
              {r.erro ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-700 font-medium">❌ {r.erro}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`grid gap-4 text-sm ${r.tipo === 'comodo' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {r.tipo === 'comodo' ? (
                      <>
                        <div className="bg-green-50 p-3 rounded-md">
                          <p className="font-medium text-green-800">Forro - {(r.area || 0).toFixed(2)}m²</p>
                          {renderizarInfoForro(r.infoForro)}
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-md">
                          <p className="font-medium text-purple-800">
                            Rodaforro
                            {r.rodaforro?.totalPecasAproveitadas > 0 && (
                              <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                                ♻️
                              </span>
                            )}
                          </p>
                          <p className="text-purple-600">{r.rodaforro?.barrasNovas} barras (6m)</p>
                          <p className="text-purple-600 text-xs">Aproveitamento: {r.rodaforro?.aproveitamento1}%</p>
                        </div>
                        
                        {r.numeroEmendasComodo > 0 && (
                          <div className="bg-yellow-50 p-3 rounded-md">
                            <p className="font-medium text-yellow-800">Emenda</p>
                            <p className="text-yellow-600">{r.barrasEmenda} Barras - <span className="text-red-600 font-medium">Sobra {r.sobraEmenda.toFixed(2)}m</span></p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="bg-orange-100 p-3 rounded-md">
                          <p className="font-medium text-orange-800">Especificações</p>
                          <p className="text-orange-600">Comprimento: {r.comprimento}m</p>
                          <p className="text-orange-600">Quantidade: {r.quantidade}</p>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-md">
                          <p className="font-medium text-green-800">Réguas</p>
                          {renderizarInfoForro(r.infoMedida)}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {r.tipo === 'comodo' && r.rodaforro?.instrucoesCorte?.length > 0 && (
                    <div className="bg-purple-100 p-4 rounded-md">
                      <h4 className="font-medium text-purple-800 mb-2">
                        🔨 Plano de Corte - Rodaforro
                        {r.rodaforro.totalPecasAproveitadas > 0 && (
                          <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                            Com reaproveitamento
                          </span>
                        )}
                      </h4>
                      <ul className="text-sm text-purple-700 space-y-1 mb-3">
                        {r.rodaforro.instrucoesCorte.map((instrucao, idx) => (
                          <li key={idx}>
                            • {instrucao.includes('Aproveitar') ? (
                              <span className="text-red-600 font-medium">{instrucao}</span>
                            ) : (
                              renderizarTextoComDestaque(instrucao)
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}