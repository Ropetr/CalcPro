import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/sendgrid'

export async function POST(request: NextRequest) {
  try {
    const { email, code, userName } = await request.json()

    if (!email || !code || !userName) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    const result = await sendVerificationEmail(email, code, userName)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro na API de envio de email:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}