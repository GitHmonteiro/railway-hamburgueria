"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Minus, Plus, ShoppingBag } from "lucide-react"
import { products } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { IframeModal } from "@/components/iframe-modal"
import { InstagramVideo } from "@/components/instagram-video"
import { useCartStore, type CartItem } from "@/lib/cart"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { FacebookPixelService } from '@/app/checkout/pixel.service';
FacebookPixelService.initialize();
FacebookPixelService.track('PageView', {
  content_type: 'product',
  contents: products,
  num_items: products.length
});
export default function ProductPage({ params }: { params: { id: string } }) {
  const [verMais, setVerMais] = useState(false)
  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId)
  const router = useRouter()
  const { addItem } = useCartStore()

  const [quantity, setQuantity] = useState(1)
  const [selectedAdditionals, setSelectedAdditionals] = useState<number[]>([])


  const [removedAccompaniments, setRemovedAccompaniments] = useState<number[]>([])
  const [showIframeModal, setShowIframeModal] = useState(false)
  const [notes, setNotes] = useState("")

  // This URL will be replaced later with the actual iframe URL
  const [iframeUrl, setIframeUrl] = useState("about:blank")

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
        <Link href="/" className="text-cyan-500 hover:underline">
          Voltar para o cardápio
        </Link>
      </div>
    )
  }

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleIncreaseAdditional = (id: number) => {
    setSelectedAdditionals(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }))
  }
  
  const handleDecreaseAdditional = (id: number) => {
    setSelectedAdditionals(prev => {
      if (!prev[id]) return prev // Se já é 0, não faz nada
      const updated = { ...prev, [id]: prev[id] - 1 }
      if (updated[id] <= 0) {
        delete updated[id] // Se quantidade for 0, remove do objeto
      }
      return updated
    })
  }

  const handleAccompanimentToggle = (id: number) => {
    setRemovedAccompaniments((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const calculateTotalPrice = () => {
    let total = product.price * quantity

    // Add price of selected additionals
    Object.entries(selectedAdditionals).forEach(([id, qty]) => {
      const additional = product.additionals.find((a) => a.id === Number(id))
      if (additional) {
        total += additional.price * qty
      }
    })

    return total
  }

  const handleAddToOrder = () => {

    FacebookPixelService.track('AddToCart', {
      content_type: 'product',
      contents: products,
      num_items: products.length
    });

    FacebookPixelService.track('PageView', {
      content_type: 'product',
      contents: products,
      num_items: products.length
    });
    
    // Create cart item
    const cartItem: CartItem = {
      product,
      quantity,
      additionals: Object.entries(selectedAdditionals).map(([id, quantity]) => ({
        id: Number(id),
        quantity,
      })), // aqui está o valor correto
      removedAccompaniments,
      notes: notes.trim() || undefined,
    }

    // Add to cart
    addItem(cartItem)

    // Show success toast
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao seu carrinho.`,
      duration: 3000,
      className: "shadow-md rounded-md",
      style: {
        border: "2px solid #ff23ab",
      },
    });
    

    // Redirect to home page
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center text-cyan-500 hover:text-cyan-600 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Voltar ao cardápio
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full rounded-lg object-cover aspect-video"
          />

          {/* Media Section - Instagram or Local Video */}
          {product.media && (
            <div className="mt-8">
              <InstagramVideo videoUrl={product.media.url} isLocalVideo={product.media.type === "local"} />
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-cyan-600">Ingredientes</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {product.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <div className="text-gray-600 mb-4 text-sm">
            <div
              dangerouslySetInnerHTML={{
                __html: verMais
                  ? product.description.replace(/\n/g, "<br />")
                  : product.description.split("\n").slice(0, 10).join("<br />") + "...",
              }}
            />
            <button
              onClick={() => setVerMais(!verMais)}
              className="text-cyan-500 font-medium mt-2 block"
            >
              {verMais ? "Ver menos ▲" : "Ver mais ▼"}
            </button>
          </div>

          {product.id !== 1 && (
          <div className="text-2xl font-bold text-cyan-500 mb-6">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </div>
          )}


          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-cyan-600">Quantidade</h2>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 font-medium text-lg">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {product.accompaniments.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-cyan-600">Acompanhamentos</h2>
              <p className="text-sm text-gray-500 mb-2">Marque os itens que você deseja incluir no pedido:</p>
              <div className="bg-gray-50 p-4 rounded-md">
                {product.accompaniments.map((item) => {
                  const isRemoved = removedAccompaniments.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between py-2 px-3 rounded-md ${
                        isRemoved ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          id={`accompaniment-${item.id}`}
                          checked={!isRemoved}
                          onCheckedChange={(checked) => {
                            if (checked === false) {
                              handleAccompanimentToggle(item.id)
                            } else {
                              handleAccompanimentToggle(item.id)
                            }
                          }}
                        />
                        <Label
                          htmlFor={`accompaniment-${item.id}`}
                          className={`ml-2 cursor-pointer ${isRemoved ? "text-gray-400 line-through" : ""}`}
                        >
                          {item.name}
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm ${isRemoved ? "text-gray-400" : "text-gray-500"}`}>
                          {item.included ? "Incluso" : `+ R$ ${item.price?.toFixed(2).replace(".", ",")}`}
                        </span>
                        {isRemoved && (
                          <span className="ml-2 text-xs bg-yellow-400 text-gray-800 px-2 py-0.5 rounded">Removido</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

{product.additionals.length > 0 && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-3 text-cyan-600">Adicionais</h2>
    <div className="space-y-2">
      {product.additionals.map((item) => {
        const quantity = selectedAdditionals[item.id] || 0
        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-md border border-gray-200"
          >
            <div>
              <Label className="font-medium">{item.name}</Label>
              <div className="text-sm text-gray-500">+ R$ {item.price.toFixed(2).replace(".", ",")}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDecreaseAdditional(item.id)}
                disabled={quantity <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleIncreaseAdditional(item.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)}


          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg">Total:</span>
              <span className="text-2xl font-bold text-cyan-500">
                R$ {calculateTotalPrice().toFixed(2).replace(".", ",")}
              </span>
            </div>

            <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-lg py-6" onClick={handleAddToOrder}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Adicionar ao pedido
            </Button>
          </div>
        </div>
      </div>

      {/* Iframe Modal */}
      {showIframeModal && <IframeModal url={iframeUrl} onClose={() => setShowIframeModal(false)} />}
    </div>
  )
}
