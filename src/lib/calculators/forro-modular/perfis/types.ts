// Tipos para o sistema de perfis T do forro modular

export interface PerfilTInfo {
  tamanho: number // em metros
  codigo: string
  nome: string
}

export interface RecorteNecessario {
  ambiente: string
  medida: number
  quantidade: number
}

export interface ResultadoPerfil {
  inteiras: number
  recortes: number
  total: number
  detalhamento: {
    barrasInteiras: number
    barrasParaRecortes: number
    aproveitamento: Array<{
      barra: number
      uso1: number
      uso2?: number
      sobra?: number
    }>
  }
}

export interface ResultadoPerfisT {
  perfil312: ResultadoPerfil
  perfil125: ResultadoPerfil
  perfil0625: ResultadoPerfil
  resumo: {
    totalBarras312: number
    totalBarras125: number
    totalBarras0625: number
  }
}