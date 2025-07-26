import sgMail from '@sendgrid/mail'

// Configurar SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@calcpro.app.br'
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'CalcPro'

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (emailData: EmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API Key não configurada')
      return { success: false, error: 'Configuração de email não encontrada' }
    }

    const msg = {
      to: emailData.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME
      },
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, '') // Remove HTML tags for text version
    }

    await sgMail.send(msg)
    console.log(`✅ Email enviado com sucesso para: ${emailData.to}`)
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erro ao enviar email:', error)
    
    // Tratar diferentes tipos de erro do SendGrid
    if (error.response?.body?.errors) {
      const errorMessage = error.response.body.errors[0]?.message || 'Erro desconhecido'
      return { success: false, error: errorMessage }
    }
    
    return { success: false, error: 'Erro interno no envio de email' }
  }
}

// Template de email de verificação
export const createVerificationEmailTemplate = (code: string, userName: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Email - CalcPro</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                width: 60px;
                height: 60px;
                background: #3b82f6;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
            }
            .code-container {
                background: #f1f5f9;
                border: 2px dashed #cbd5e1;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
            }
            .verification-code {
                font-size: 32px;
                font-weight: bold;
                color: #1e40af;
                letter-spacing: 4px;
                margin: 10px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                text-align: center;
                color: #64748b;
                font-size: 14px;
            }
            .btn {
                display: inline-block;
                background: #3b82f6;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 500;
                margin: 20px 0;
            }
            .warning {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img 
                        src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo-vertical.png" 
                        alt="CalcPro" 
                        style="height: 80px; width: auto;"
                    />
                </div>
                <h1 style="margin: 0; color: #1e293b;">Verificação de Email</h1>
                <p style="margin: 5px 0 0 0; color: #64748b;">CalcPro - Calculadoras Técnicas</p>
            </div>

            <p>Olá <strong>${userName}</strong>,</p>
            
            <p>Obrigado por se cadastrar no CalcPro! Para concluir o processo de criação da sua conta, precisamos verificar seu endereço de email.</p>
            
            <p>Use o código abaixo para verificar sua conta:</p>

            <div class="code-container">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Seu código de verificação é:</p>
                <div class="verification-code">${code}</div>
                <p style="margin: 0; color: #64748b; font-size: 12px;">Este código expira em 15 minutos</p>
            </div>

            <p>Ou clique no botão abaixo para verificar automaticamente:</p>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verificacao?email=${encodeURIComponent(userName)}&code=${code}" class="btn">
                    Verificar Email Automaticamente
                </a>
            </div>

            <div class="warning">
                <p style="margin: 0;"><strong>⚠️ Importante:</strong></p>
                <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                    <li>Este código é válido por apenas 15 minutos</li>
                    <li>Não compartilhe este código com ninguém</li>
                    <li>Se você não se cadastrou no CalcPro, ignore este email</li>
                </ul>
            </div>

            <p>Se você está tendo problemas para verificar sua conta, entre em contato conosco em <a href="mailto:contato@calcpro.app.br">contato@calcpro.app.br</a></p>

            <div class="footer">
                <p><strong>CalcPro</strong> - Sistema de Calculadoras Técnicas para Construção</p>
                <p>Este email foi enviado para verificação de conta. Se você não solicitou este email, pode ignorá-lo.</p>
            </div>
        </div>
    </body>
    </html>
  `
}

// Função específica para enviar email de verificação
export const sendVerificationEmail = async (
  email: string, 
  code: string, 
  userName: string
): Promise<{ success: boolean; error?: string }> => {
  const emailData: EmailData = {
    to: email,
    subject: 'Verifique seu email - CalcPro',
    html: createVerificationEmailTemplate(code, userName)
  }

  return await sendEmail(emailData)
}