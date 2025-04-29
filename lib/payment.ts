// BytePayCash API integration

export interface PaymentRequest {
  amount: number
  client: {
    name: string
    document: string
    telefone: string
    email: string
  }
  utms?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
}

export interface PaymentResponse {
  status: string;
  message: string;
  paymentCode?: string;
  idTransaction?: string | number; // Aceita string ou number
  paymentCodeBase64?: string;
}

export async function generatePixPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  try {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Erro na resposta da API:", errorData)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error generating PIX payment:", error)
    return {
      status: "error",
      message: "Falha ao gerar o pagamento PIX. Por favor, tente novamente.",
    }
  }
}
