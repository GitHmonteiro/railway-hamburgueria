"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, CreditCard, MapPin, ShoppingBag, Truck } from "lucide-react"
import { useCartStore } from "@/lib/cart"
import { generatePixPayment } from "@/lib/payment"
import { PixPayment } from "@/components/pix-payment"
import Link from "next/link"
import { LoadingAnimation } from "@/components/loading-animation"
import Script from "next/script"
import { FacebookPixelService } from './pixel.service';
FacebookPixelService.initialize();


// Para rastrear eventos

interface CheckoutFormData {
  name: string
  email: string
  phone: string
  document: string
  address: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  notes: string
}
declare global {
  function fbq(...args: any[]): void;
}


export default function CheckoutPage() {  

  FacebookPixelService.track('InitiateCheckout', {
    content_type: 'product',
  });



  const router = useRouter()
  const { items, getSubtotal, getDeliveryFee, getTotal } = useCartStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSimulation, setIsSimulation] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    paymentCode: string;
    paymentCodeBase64: string;
    transactionId: string; // Agora apenas string
  } | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    document: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    notes: "",
  })

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const savedUserInfo = localStorage.getItem("sushi4you_user_info")

      if (savedUserInfo) {
        const userInfo = JSON.parse(savedUserInfo)
        setFormData((prev) => ({
          ...prev,
          name: userInfo.name || "",
          address: userInfo.address || "",
          number: userInfo.complement || "",
          complement: userInfo.reference || "",
          neighborhood: userInfo.neighborhood || "",
          city: userInfo.city || "",
          state: userInfo.state || "",
        }))
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0 && !paymentData) {
      router.push("/")
    }
  }, [items, router, paymentData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (error) setError("")
  }

  const validateForm = () => {
    // Required fields for step 1
    if (step === 1) {
      if (!formData.name.trim()) return "Nome é obrigatório"
      if (!formData.email.trim()) return "E-mail é obrigatório"
      if (!formData.phone.trim()) return "Telefone é obrigatório"
      if (!formData.document.trim()) return "CPF é obrigatório"

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) return "E-mail inválido"

      // Basic phone validation (at least 10 digits)
      const phoneDigits = formData.phone.replace(/\D/g, "")
      if (phoneDigits.length < 10) return "Telefone inválido"

      // Basic CPF validation (11 digits)
      const documentDigits = formData.document.replace(/\D/g, "")
      if (documentDigits.length !== 11) return "CPF inválido"
    }

    // Required fields for step 2
    if (step === 2) {
      if (!formData.address.trim()) return "Endereço é obrigatório"
      if (!formData.number.trim()) return "Número é obrigatório"
      if (!formData.neighborhood.trim()) return "Bairro é obrigatório"
      if (!formData.city.trim()) return "Cidade é obrigatória"
      if (!formData.state.trim()) return "Estado é obrigatório"
    }

    return null
  }

  const handleNextStep = () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const rawTotal = getTotal() as string | number;
      const total = typeof rawTotal === "string"
        ? parseFloat(rawTotal.replace(/\./g, "").replace(",", "."))
        : rawTotal;
      const amountInCents = Math.round(total * 100);
  
      FacebookPixelService.track('Purchase', {
        value: total,
        currency: 'BRL',
      });
  
      const response = await generatePixPayment({
        amount: amountInCents,
        client: {
          name: formData.name,
          document: formData.document.replace(/\D/g, ""),
          telefone: formData.phone.replace(/\D/g, ""),
          email: formData.email,
        },
      });
  
      console.log("Response:", response);
  
      if (response?.status === "success" && response.paymentCode && response.paymentCodeBase64) {
        setPaymentData({
          paymentCode: response.paymentCode,
          paymentCodeBase64: response.paymentCodeBase64,
          transactionId: String(response.idTransaction || "SEM-ID"), // Conversão explícita para string
        });
  
        const transactionIdStr = String(response.idTransaction || "");
        setIsSimulation(transactionIdStr.startsWith("SIMU-"));
  
        setStep(4);
      } else {
        setError(response?.message || "Erro ao gerar pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // Format price to Brazilian Real
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",")
  }

  // Format CPF as user types
  const formatCpf = (cpf: string) => {
    const digits = cpf.replace(/\D/g, "")
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
  }

  // Format phone as user types
  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  if (items.length === 0 && !paymentData) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-cyan-500 hover:text-cyan-600 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Voltar ao cardápio
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar Pedido</h1>

      {/* Progress Steps */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-1">
              <div className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-cyan-500" : "bg-gray-200"}`}></div>
              <div className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-cyan-500" : "bg-gray-200"}`}></div>
              <div className={`h-2 w-8 rounded-full ${step >= 3 ? "bg-cyan-500" : "bg-gray-200"}`}></div>
            </div>
            <span className="text-sm text-gray-500">
              {step === 1 && "Dados Pessoais"}
              {step === 2 && "Endereço de Entrega"}
              {step === 3 && "Revisão e Pagamento"}
            </span>
          </div>
        </div>
      )}

      {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingAnimation />
          <p className="mt-4 text-gray-600">Processando seu pagamento...</p>
          
        </div>
      ) : step === 4 && paymentData ? (
        <PixPayment
  paymentCode={paymentData.paymentCode}
  paymentCodeBase64={paymentData.paymentCodeBase64}
  transactionId={paymentData.transactionId}
  isSimulation={isSimulation}
/>

      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-cyan-100 p-2 rounded-full mr-3">
                    <ShoppingBag className="h-5 w-5 text-cyan-500" />
                  </div>
                  <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formatPhone(formData.phone)}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value)
                          setFormData((prev) => ({ ...prev, phone: formatted }))
                        }}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="document">CPF</Label>
                    <Input
                      id="document"
                      name="document"
                      value={formatCpf(formData.document)}
                      onChange={(e) => {
                        const formatted = formatCpf(e.target.value)
                        setFormData((prev) => ({ ...prev, document: formatted }))
                      }}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button className="bg-cyan-500 hover:bg-cyan-600" onClick={handleNextStep}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Address */}
            {step === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-cyan-100 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-cyan-500" />
                  </div>
                  <h2 className="text-lg font-semibold">Endereço de Entrega</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        placeholder="123"
                      />
                    </div>

                    <div>
                      <Label htmlFor="complement">Complemento (opcional)</Label>
                      <Input
                        id="complement"
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        placeholder="Apto, Bloco, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      placeholder="Seu bairro"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Sua cidade"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="UF"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Instruções para entrega (opcional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Instruções especiais para entrega, pontos de referência, etc."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button className="bg-cyan-500 hover:bg-cyan-600" onClick={handleNextStep}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review and Payment */}
            {step === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-cyan-100 p-2 rounded-full mr-3">
                    <CreditCard className="h-5 w-5 text-cyan-500" />
                  </div>
                  <h2 className="text-lg font-semibold">Revisão e Pagamento</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Dados Pessoais</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p>
                        <span className="text-gray-500">Nome:</span> {formData.name}
                      </p>
                      <p>
                        <span className="text-gray-500">E-mail:</span> {formData.email}
                      </p>
                      <p>
                        <span className="text-gray-500">Telefone:</span> {formData.phone}
                      </p>
                      <p>
                        <span className="text-gray-500">CPF:</span> {formData.document}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Endereço de Entrega</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p>
                        {formData.address}, {formData.number}
                        {formData.complement && `, ${formData.complement}`}
                      </p>
                      <p>
                        {formData.neighborhood}, {formData.city} - {formData.state}
                      </p>
                      {formData.notes && (
                        <p className="mt-2">
                          <span className="text-gray-500">Instruções:</span> {formData.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>,
                    <h3 className="font-medium text-gray-700 mb-2">Método de Pagamento</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                      <div className="h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                      <span
                        style={{
                          backgroundImage: "url('/images/pix.png')",
                          width: '24px',
                          height: '24px',
                          backgroundSize: 'cover'
                        }}></span>
                      </div>
                        <div>
                          <p className="font-medium">Pagamento via PIX</p>
                          <p className="text-sm text-gray-500">Pagamento instantâneo</p>

                          
                        </div>
                        
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Pagamento na entrega indisponível</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button className="bg-cyan-500 hover:bg-cyan-600" onClick={handleSubmit}>
                    Finalizar Pedido
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

              <div className="space-y-4 mb-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm pb-2 border-b">
                    <div>
                      <span className="font-medium">{item.quantity}x</span> {item.product.name}
                      {item.additionals.length > 0 && (
                       <div className="text-xs text-gray-500 ml-4">
                       {item.additionals.map((id) => {
                         // Garantir que 'id' é um número
                         if (typeof id === 'number') {
                           const additional = item.product.additionals.find((a) => a.id === id);
                           return additional ? <div key={additional.id}>+ {additional.name}</div> : null;
                         }
                         return null;
                       })}
                     </div>
                     
                      )}
                    </div>
                    <span>R$ {formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de entrega</span>
                  <span>R$ {formatPrice(getDeliveryFee())}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t mt-2">
                  <span>Total</span>
                  <span className="text-cyan-500">R$ {formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center text-sm text-gray-500">
                <Truck className="h-4 w-4 mr-2" />
                <span>Entrega em aproximadamente 45-60 minutos</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
