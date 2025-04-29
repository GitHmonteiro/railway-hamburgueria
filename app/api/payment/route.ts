import { NextResponse } from "next/server";
import QRCode from 'qrcode';

async function generateQRCode(data: string): Promise<string> {
  return QRCode.toDataURL(data, { errorCorrectionLevel: 'H' });
}

// END-Point AXION
   // Venda 
   // https://api.axionpay.com.br/v1/transactions
   // Buscar Venda
   // https://api.axionpay.com.br/v1/transactions/{id}

//const token = 'sk_qQmlQ876zqRZb1XrdGKnkI6N0sLmmXLfzC53EwjqGWrE2iiZ';
//const senha = '@Hy10203040';


//const SkaleVenda ="https://api.conta.skalepay.com.br/v1/transactions";
//const  SkaleBuscarVenda =  `https://api.conta.skalepay.com.br/v1/transactions/${transactionId}`;

const tokenSkale = 'sk_live_v2KHGJ5RjtOjyqgljLXMpcfXmHDNfKEV8gMnwJmCxh';
const senhaSkale = 'x';

    // Junta token e senha
    const tokenSenha = tokenSkale + ':' + senhaSkale;

    // Converte para Base64
    const base64 = btoa(tokenSenha);

    // Monta o Authorization Header
    const authorizationHeader = 'Basic ' + base64;

    // Decodificando de volta pra conferir
    const decoded = atob(base64);
    const [decodedToken, decodedSenha] = decoded.split(':');

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();

    if (!paymentData?.amount || !paymentData?.client) {
      return NextResponse.json(
        { status: "error", message: "Dados de pagamento incompletos" },
        { status: 400 }
      );
    }

    const payload = {
      amount: paymentData.amount,
      paymentMethod: "pix",
      customer: {
        document: {
          type: "cnpj",
          number: "46908518000129",
        },
        name: "paymentData.client.name",
        phone: paymentData.client.telefone || "00000000000",
        email: paymentData.client.email || "cliente@exemplo.com",
      },
      pix: {
        expiresInDays: 1,
      },
      items: [
        {
          title: paymentData.description || "Shark Burguer",
          unitPrice: paymentData.amount,
          quantity: 1,
          tangible: true,
        },
      ],
    };

    

    const response = await fetch("https://api.conta.skalepay.com.br/v1/transactions/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `${authorizationHeader}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Erro Skale:", await response.text());
      throw new Error("Erro na requisição para Skale");
    }

    const data = await response.json();
    const paymentCode = data?.pix?.qrcode;

    if (!paymentCode) {
      throw new Error("QR Code não retornado pela API");
    }

    // Gerar o QR Code base64
    const qrCodeBase64 = await generateQRCode(paymentCode);

    return NextResponse.json({
      status: "success",
      message: "Pagamento gerado com sucesso",
      paymentCode,
      idTransaction: data.idTransaction || data.id || "SEM-ID",
      paymentCodeBase64: qrCodeBase64, // Aqui estamos inicializando a variável corretamente
    });

  } catch (error) {
    console.error("Erro geral:", error);
    return NextResponse.json({
      status: "error",
      //message: error.message || "Erro interno do servidor",
    }, { status: 500 });
  }
}

// app/api/status/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const transactionId = searchParams.get("id")

  const res = await fetch(
    `https://api.conta.skalepay.com.br/v1/transactions/${transactionId}`, {
    headers: {
      accept: "application/json",
      authorization: `${authorizationHeader}`
    }
  })

  const data = await res.json()
  return Response.json(data)
}
