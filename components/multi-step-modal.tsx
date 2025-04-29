"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingAnimation } from "@/components/loading-animation"
import { fetchAddressByCep } from "@/lib/api"

interface MultiStepModalProps {
  onComplete: (data: any) => void
}

export function MultiStepModal({ onComplete }: MultiStepModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    cep: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
    reference: "",
  })
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Special handling for CEP to allow both formats
    if (name === "cep") {
      // Allow typing with or without hyphen
      const formattedValue = value.replace(/[^0-9-]/g, "")
      setFormData({ ...formData, [name]: formattedValue })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Clear error when user types
    if (error) setError("")
  }

  const handleCepSearch = async () => {
    if (!formData.name.trim()) {
      setError("Por favor, informe seu nome")
      return
    }

    // Format CEP for validation - remove hyphen if present
    const cepDigitsOnly = formData.cep.replace("-", "")

    if (!cepDigitsOnly.trim() || cepDigitsOnly.length !== 8) {
      setError("Por favor, informe um CEP válido (8 dígitos)")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate loading for 2 seconds as requested
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Use the digits-only version for the API call
      const addressData = await fetchAddressByCep(cepDigitsOnly)

      if (addressData.erro) {
        setError("CEP não encontrado")
        setLoading(false)
        return
      }

      setFormData({
        ...formData,
        address: addressData.logradouro || "Endereço não disponível",
        neighborhood: addressData.bairro || "Bairro não disponível",
        city: addressData.localidade || "Cidade não disponível",
        state: addressData.uf || "UF",
      })

      setLoading(false)
      setStep(2)
    } catch (error) {
      console.error("Error in handleCepSearch:", error)
      setError("Erro ao buscar o CEP. Tente novamente.")
      setLoading(false)
    }
  }

  const handleStep2Submit = () => {
    if (!formData.complement.trim()) {
      setError("Por favor, informe o número do endereço")
      return
    }

    setStep(3)
  }

  const handleConfirm = () => {
    onComplete(formData)
  }

  // Format CEP as user types (add hyphen)
  const formatCepDisplay = (cep: string) => {
    // If already has a hyphen or is too short, return as is
    if (cep.includes("-") || cep.length <= 5) return cep

    // Add hyphen after the first 5 digits
    const digits = cep.replace(/\D/g, "")
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
    }
    return digits
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingAnimation />
            <p className="mt-4 text-gray-600">Localizando seu endereço...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-cyan-600">
                {step === 1 && "Informe seus dados"}
                {step === 2 && "Complete seu endereço"}
                {step === 3 && "Confirme seus dados"}
              </h2>
              <div className="flex gap-1">
                <div className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-pink-500" : "bg-gray-200"}`}></div>
                <div className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-pink-500" : "bg-gray-200"}`}></div>
                <div className={`h-2 w-8 rounded-full ${step >= 3 ? "bg-pink-500" : "bg-gray-200"}`}></div>
              </div>
            </div>

            {error && <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

            {step === 1 && (
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
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    value={formatCepDisplay(formData.cep)}
                    onChange={handleInputChange}
                    placeholder="Seu CEP"
                    maxLength={9} // 8 digits + 1 hyphen
                  />
                  <p className="text-xs text-gray-500 mt-1">Formato aceito: 00000-000 ou 00000000</p>
                </div>
                <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={handleCepSearch}>
                  Buscar endereço
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" name="address" value={formData.address} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="complement">Número</Label>
                    <Input
                      id="complement"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      placeholder="Número da residência"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reference">Referência (opcional)</Label>
                    <Input
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="Ponto de referência"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button className="flex-1 bg-pink-500 hover:bg-pink-600" onClick={handleStep2Submit}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Nome:</span>
                    <p>{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">CEP:</span>
                    <p>{formatCepDisplay(formData.cep)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Endereço:</span>
                    <p>
                      {formData.address}, {formData.complement}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bairro:</span>
                    <p>{formData.neighborhood}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Cidade/Estado:</span>
                    <p>
                      {formData.city} - {formData.state}
                    </p>
                  </div>
                  {formData.reference && (
                    <div>
                      <span className="text-sm text-gray-500">Referência:</span>
                      <p>{formData.reference}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button className="flex-1 bg-pink-500 hover:bg-pink-600" onClick={handleConfirm}>
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
