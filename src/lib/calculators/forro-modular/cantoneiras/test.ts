// Teste para validar o sistema de cantoneiras otimizado

import { calcularCantoneirasMultiplosAmbientes } from './index'

console.log('=== TESTE SISTEMA CANTONEIRAS OTIMIZADO ===\n')

// Teste com ambiente 3,80m × 2,70m
console.log('🏠 Ambiente: 3,80m × 2,70m')
console.log('🎯 Resultado esperado: 5 cantoneiras')
console.log('📐 Lógica esperada:')
console.log('  - Cantoneiras 1 e 2: usadas inteiras para paredes de 2,70m')
console.log('  - Cantoneiras 3 e 4: usadas inteiras para paredes de 2,70m')  
console.log('  - Cantoneira 5: cortada 2x 0,80m para completar paredes de 3,80m')
console.log('  - Sobra: 3,00m - (2 × 0,80m) = 1,40m')
console.log('')

const resultado = calcularCantoneirasMultiplosAmbientes([
  { largura: 3.80, comprimento: 2.70, nome: 'Ambiente 01' }
])

console.log('🧮 Resultado do sistema:')
console.log(`  - Total: ${resultado.resumo.totalBarras300} cantoneiras`)
console.log(`  - Inteiras: ${resultado.cantoneira300.inteiras}`)
console.log(`  - Para recortes: ${resultado.cantoneira300.detalhamento.barrasParaRecortes}`)
console.log('')

console.log('📊 Detalhamento do aproveitamento:')
resultado.cantoneira300.detalhamento.aproveitamento.forEach((barra, i) => {
  console.log(`  Barra ${barra.barra}:`)
  console.log(`    • Uso 1: ${barra.uso1.medida}m (${barra.uso1.parede})`)
  if (barra.uso2) {
    console.log(`    • Uso 2: ${barra.uso2.medida}m (${barra.uso2.parede})`)
  }
  if (barra.sobra && barra.sobra > 0.01) {
    console.log(`    • Sobra: ${barra.sobra.toFixed(2)}m`)
  }
})

console.log('')

// Verificar se está correto
const totalEsperado = 5
const totalObtido = resultado.resumo.totalBarras300

if (totalObtido === totalEsperado) {
  console.log('✅ TESTE APROVADO! Resultado correto.')
} else {
  console.log(`❌ TESTE FALHOU! Esperado: ${totalEsperado}, Obtido: ${totalObtido}`)
}

console.log('\n=== FIM DO TESTE ===')