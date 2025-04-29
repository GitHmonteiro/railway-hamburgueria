"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Copy, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChevronLeft, CreditCard, MapPin, ShoppingBag, Truck } from "lucide-react"
interface PixPaymentProps {
  paymentCode: string;
  paymentCodeBase64: string;
  transactionId: string;
  isSimulation?: boolean;
}

export function PixPayment({
  paymentCode,
  paymentCodeBase64,
  transactionId,
  isSimulation = false,
}: PixPaymentProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60)
  const [statusAtual, setStatusAtual] = useState("aguardando_pagamento")

  const statusEtapas = [
    { id: "aguardando_pagamento", label: "Aguardando pagamento" },
    { id: "confirmado_pagamento", label: "Pagamento confirmado" },
    { id: "confirmado_restaurante", label: "Aguardando confirmação do restaurante" },
    { id: "preparando_pedido", label: "Pedido está sendo preparado" },
    { id: "motoboy_busca", label: "Motoboy está indo buscar seu pedido" },
    { id: "motoboy_entrega", label: "Motoboy está indo até você" },
  ]

  const getGifForStatus = (status: string) => {
    return `/images/${status}.gif`
  }

  // Função que inicia as transições do status com base no pagamento
  useEffect(() => {
    if (isSimulation || !transactionId) return;

    let pollingActive = true;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payment?id=${transactionId}`);
        const data = await res.json();
        const status = data?.status;

        if (!pollingActive) return;

        if (status === "paid" || status === "approved") {
          pollingActive = false;

          // Inicia a transição de status após o pagamento ser confirmado
          setTimeout(() => setStatusAtual("confirmado_pagamento"), 30000); // 30 segundos

          setTimeout(() => setStatusAtual("confirmado_restaurante"), 50000); // 20 segundos após
          setTimeout(() => setStatusAtual("preparando_pedido"), 150000); // 20 minutos após
          setTimeout(() => setStatusAtual("motoboy_busca"), 42000); // 7 minutos após
          setTimeout(() => setStatusAtual("motoboy_entrega"), 30000); // 30 minutos após
        } else if (status === "waiting_payment") {
          setStatusAtual("aguardando_pagamento");
        } else {
          setStatusAtual("erro");
        }
      } catch (err) {
        console.error("Erro ao verificar status do pagamento", err);
        setStatusAtual("erro");
      }
    };

    const interval = setInterval(checkStatus, 5000);
    checkStatus(); // Primeira chamada imediata

    return () => {
      pollingActive = false;
      clearInterval(interval);
    };
  }, [transactionId, isSimulation]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const copyToClipboard = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(paymentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    } finally {
      setIsCopying(false);
    }
  }

  if (!paymentCode || !paymentCodeBase64) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Erro no pagamento
        </h2>
        <p className="text-gray-600 mb-4">
          Não foi possível gerar o QR Code de pagamento. Por favor, tente novamente.
        </p>
        <Button
          className="bg-pink-500 hover:bg-pink-600"
          onClick={() => router.push("/")}
        >
          Voltar ao início
        </Button>
      </div>
    );
  }

  const formattedQrCode = paymentCodeBase64.startsWith("data:image/") 
    ? paymentCodeBase64 
    : `data:image/png;base64,${paymentCodeBase64}`;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Pedido realizado com sucesso!
        </h2>
        <p className="text-gray-600">
          {isSimulation
            ? "Este é um ambiente de simulação. Nenhum pagamento real foi processado."
            : "Agora é só pagar com PIX para finalizar seu pedido."}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col items-center">
          <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 flex justify-center">
            <div className="relative w-48 h-48">
              <Image
                src={formattedQrCode}
                alt="QR Code PIX"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2 text-center">
            Escaneie o QR Code acima ou copie o código abaixo
          </p>

          <div className="w-full relative">
            <div className="bg-gray-50 p-3 rounded-md text-center font-mono text-sm break-all">
              {paymentCode}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-1 top-1"
              onClick={copyToClipboard}
              disabled={isCopying}
            >
              {copied ? (
                <span className="text-green-600">Copiado!</span>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </>
              )}
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={copyToClipboard}
          >
            Copiar código PIX
          </Button>
          
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-md flex items-start mb-6">
        <Clock className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-800 font-medium">
            O pedido será cancelado automaticamente se o pagamento não for confirmado em {minutes}:{seconds < 10 ? `0${seconds}` : seconds}.
          </p>
        </div>
      </div>

      {/* Status do pedido como Checkpoints */}
      <div className="mt-8 space-y-2">
  {statusEtapas.map((etapa, idx) => {
    const ativo = statusEtapas.findIndex(s => s.id === statusAtual) >= idx;
    return (
      <div key={etapa.id} className="flex items-center space-x-3">
        <div
          className={`w-6 h-6 rounded-full ${ativo ? "bg-[#41D0D0] pulsing" : "bg-gray-300"} transition-all duration-300`}
        />
        <span className={`text-sm ${ativo ? "text-[#41D0D0] font-medium" : "text-gray-400"}`}>
          {etapa.label}
        </span>
      </div>
    );
  })}
  <div className="mt-6 flex items-center text-sm text-gray-900">
                <Truck className="h-4 w-4 mr-2" />
                <span>Entrega estimada em até 45-60 minutos</span>
  </div>
</div>


      <div className="mt-6 flex justify-center">
        <img
          src={getGifForStatus(statusAtual)}
          alt={`GIF do status ${statusAtual}`}
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>

      <div className="text-center text-sm text-gray-500 my-4">
        <p>ID da transação: {transactionId}</p>
      </div>
    </div>
  );
}
/* Adiciona animação de "pulse" */

