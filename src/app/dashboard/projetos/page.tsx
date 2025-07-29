'use client'

export default function ProjetosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
      <p className="mt-4 text-gray-600">Sistema de gerenciamento de projetos do CalcPro</p>
      
      <div className="mt-8 bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Funcionalidades</h2>
        <ul className="space-y-2">
          <li>✅ Página carregada com sucesso</li>
          <li>✅ Roteamento funcionando</li>
          <li>⏳ Sistema completo será restaurado</li>
        </ul>
        
        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Teste OK
          </button>
        </div>
      </div>
    </div>
  )
}