// Teste específico para validar o cálculo de perfis T

import { calcularPerfisT } from './perfis'
import { calcularForroModularCompleto } from './index'

console.log('=== TESTE CÁLCULO PERFIS T ===\n')

// Teste com ambiente 3,80m × 2,70m
console.log('🏠 Ambiente: 3,80m × 2,70m (placa grande 0,625m × 1,25m)')
console.log('📐 Cálculo manual esperado:')
console.log('  - Perfil T 3,12m: 3 barras')
console.log('  - Perfil T 1,25m: 15 barras')
console.log('')

const resultadoPerfis = calcularPerfisT(3.80, 2.70)

console.log('🧮 Resultado do sistema:')
console.log(`  - Perfil T 3,12m: ${resultadoPerfis.resumo.totalBarras312} barras`)
console.log(`  - Perfil T 1,25m: ${resultadoPerfis.resumo.totalBarras125} barras`)
console.log(`  - Perfil T 0,625m: ${resultadoPerfis.resumo.totalBarras0625} barras`)
console.log('')

console.log('📊 Detalhamento Perfil 3,12m:')
console.log(`  - Inteiras: ${resultadoPerfis.perfil312.inteiras}`)
console.log(`  - Recortes: ${resultadoPerfis.perfil312.recortes}`)
console.log(`  - Barras para recortes: ${resultadoPerfis.perfil312.detalhamento.barrasParaRecortes}`)
console.log('  - Aproveitamento:')
resultadoPerfis.perfil312.detalhamento.aproveitamento.forEach((apr, i) => {
  console.log(`    Barra ${apr.barra}: ${apr.uso1}m${apr.uso2 ? ` + ${apr.uso2}m` : ''} (sobra: ${apr.sobra?.toFixed(3)}m)`)
})
console.log('')

console.log('📊 Detalhamento Perfil 1,25m:')
console.log(`  - Inteiras: ${resultadoPerfis.perfil125.inteiras}`)
console.log(`  - Recortes: ${resultadoPerfis.perfil125.recortes}`)
console.log(`  - Barras para recortes: ${resultadoPerfis.perfil125.detalhamento.barrasParaRecortes}`)
console.log('  - Aproveitamento:')
resultadoPerfis.perfil125.detalhamento.aproveitamento.forEach((apr, i) => {
  console.log(`    Barra ${apr.barra}: ${apr.uso1}m${apr.uso2 ? ` + ${apr.uso2}m` : ''} (sobra: ${apr.sobra?.toFixed(3)}m)`)
})
console.log('')

// Teste completo
console.log('🔄 Teste do sistema completo:')
const resultadoCompleto = calcularForroModularCompleto(3.80, 2.70, 'grande')
console.log('Resultado completo:', JSON.stringify(resultadoCompleto.resumoMateriais, null, 2))

console.log('\n✅ Teste de perfis concluído!')