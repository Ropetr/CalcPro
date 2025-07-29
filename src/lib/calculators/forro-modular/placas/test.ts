// Arquivo de teste para validar a implementação do sistema de placas
// Execute este arquivo para testar se tudo está funcionando corretamente

import { calcularPlacas, listarTiposPlacas, getCalculadoraPlaca } from './index'

console.log('=== TESTE DO SISTEMA DE CÁLCULO DE PLACAS ===\n')

// Listar tipos disponíveis
console.log('📋 Tipos de placas disponíveis:')
const tipos = listarTiposPlacas()
tipos.forEach(tipo => {
  console.log(`  • ${tipo.nome} (${tipo.codigo}): ${tipo.dimensoes}`)
})
console.log()

// Teste com exemplo fornecido pelo usuário
console.log('🧮 Teste com ambiente 3.80m × 2.70m usando placa grande:')
const resultado = calcularPlacas(3.80, 2.70, 'grande')

console.log('Resultado:', JSON.stringify(resultado, null, 2))
console.log()

// Teste comparativo
console.log('🔄 Comparação entre placas grande e pequena:')
const resultadoGrande = calcularPlacas(3.80, 2.70, 'grande')
const resultadoPequena = calcularPlacas(3.80, 2.70, 'pequena')

console.log(`Placa Grande: ${resultadoGrande.totalPlacas} placas`)
console.log(`Placa Pequena: ${resultadoPequena.totalPlacas} placas`)
console.log()

// Teste de observações
console.log('📝 Observações para placa grande:')
resultadoGrande.observacoes.forEach(obs => {
  console.log(`  • ${obs}`)
})
console.log()

console.log('📝 Observações para placa pequena:')
resultadoPequena.observacoes.forEach(obs => {
  console.log(`  • ${obs}`)
})
console.log()

// Teste de diferentes ambientes
console.log('🏠 Testes com diferentes ambientes:')
const ambientesTest = [
  { largura: 2.50, comprimento: 2.50, nome: 'Sala pequena' },
  { largura: 5.00, comprimento: 4.00, nome: 'Sala média' },
  { largura: 1.25, comprimento: 2.50, nome: 'Corredor (encaixe perfeito largura)' },
  { largura: 2.50, comprimento: 1.25, nome: 'Área pequena (encaixe perfeito comprimento)' }
]

ambientesTest.forEach(ambiente => {
  const result = calcularPlacas(ambiente.largura, ambiente.comprimento, 'grande')
  console.log(`${ambiente.nome} (${ambiente.largura}m × ${ambiente.comprimento}m): ${result.totalPlacas} placas`)
  if (result.observacoes.length > 0) {
    result.observacoes.forEach(obs => console.log(`    → ${obs}`))
  }
})

console.log('\n✅ Teste concluído!')