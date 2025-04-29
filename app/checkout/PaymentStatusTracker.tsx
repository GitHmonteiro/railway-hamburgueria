"use client"
import React, { useState, useEffect } from 'react'
import { CheckCircle2, Clock, AlertCircle, Loader2, Truck, Utensils, CircleDashed } from 'lucide-react'

const statusStages = [
  { id: 'waiting_payment', label: 'Aguardando pagamento', icon: Clock },
  { id: 'pending', label: 'Em processo de confirmação', icon: Loader2 },
  { id: 'approved', label: 'Pagamento aprovado', icon: CheckCircle2 },
  { id: 'preparing', label: 'Pedido sendo preparado', icon: Utensils },
  { id: 'collecting', label: 'Motoboy buscando seu pedido', icon: Truck },
  { id: 'delivering', label: 'Motoboy a caminho', icon: Truck },
  { id: 'delivered', label: 'Pedido entregue', icon: CheckCircle2 },
  { id: 'refused', label: 'Pagamento recusado', icon: AlertCircle },
  { id: 'cancelled', label: 'Pedido cancelado', icon: AlertCircle }
]

export function PaymentStatusTracker({ transactionId }: { transactionId: string }) {
  const [currentStatus, setCurrentStatus] = useState('waiting_payment')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulando polling da API
    const interval = setInterval(() => {
      checkPaymentStatus(transactionId)
    }, 5000) // Verifica a cada 5 segundos

    return () => clearInterval(interval)
  }, [transactionId])

  const checkPaymentStatus = async (id: string) => {
    try {
      // Substitua por sua chamada real à API
      const response = await fetch(`/api/transactions/${id}/status`)
      const data = await response.json()
      
      if (response.ok) {
        setCurrentStatus(data.status)
        
        // Lógica para avançar automaticamente nos status após aprovação
        if (data.status === 'approved') {
          simulateOrderProgress()
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateOrderProgress = () => {
    // Avança automaticamente pelos status após aprovação
    const stages = ['preparing', 'collecting', 'delivering', 'delivered']
    let currentIndex = 0
    
    const progressInterval = setInterval(() => {
      if (currentIndex < stages.length) {
        setCurrentStatus(stages[currentIndex])
        currentIndex++
      } else {
        clearInterval(progressInterval)
      }
    }, 10000) // Muda de status a cada 10 segundos (ajuste conforme necessário)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">Acompanhe seu pedido</h2>
      
      <div className="space-y-4">
        {statusStages.map((stage) => {
          const isActive = stage.id === currentStatus
          const isCompleted = statusStages.findIndex(s => s.id === currentStatus) > 
                             statusStages.findIndex(s => s.id === stage.id)
          
          return (
            <div 
              key={stage.id} 
              className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-blue-50 border border-blue-200' : ''
              } ${isCompleted ? 'opacity-100' : 'opacity-70'}`}
            >
              <div className={`mr-3 ${
                isActive ? 'text-blue-500 animate-pulse' : 
                isCompleted ? 'text-green-500' : 'text-gray-400'
              }`}>
                <stage.icon className="h-5 w-5" />
              </div>
              <div>
                <p className={`font-medium ${
                  isActive ? 'text-blue-800' : 
                  isCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {stage.label}
                </p>
                {isActive && (
                  <p className="text-xs text-gray-500 mt-1">
                    {stage.id === 'waiting_payment' && 'Aguardando confirmação do pagamento...'}
                    {stage.id === 'preparing' && 'Seu pedido está sendo preparado com cuidado!'}
                    {stage.id === 'collecting' && 'Nosso entregador está a caminho do restaurante'}
                    {stage.id === 'delivering' && 'Seu pedido está a caminho!'}
                  </p>
                )}
              </div>
              
              {isCompleted && (
                <div className="ml-auto text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {isLoading && (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
          <p className="text-sm text-gray-500 mt-2">Atualizando status...</p>
        </div>
      )}
    </div>
  )
}