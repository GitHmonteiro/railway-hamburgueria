"use client"

import { useEffect, useRef } from "react"
import { X, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FacebookPixelService } from '../app/checkout/pixel.service';
interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateItem, getSubtotal, getDeliveryFee, getTotal } = useCartStore()
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const item = items[index]
    updateItem(index, { ...item, quantity: newQuantity })
  }

  const handleCheckout = () => {
    FacebookPixelService.initialize();
    function trackInitiateCheckout(products: Array<{ id: string; quantity: number }>) {
      FacebookPixelService.track('InitiateCheckout', {
        content_type: 'product',
        contents: products,
        num_items: products.length
      });
    }
    onClose()
    router.push("/checkout")
  }

  // Format price to Brazilian Real
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",")
  }

  // Get additional name by id
  const getAdditionalName = (item: (typeof items)[0], additionalId: number) => {
    return item.product.additionals.find((a) => a.id === additionalId)?.name || ""
  }

  // Get removed accompaniment name by id
  const getRemovedAccompanimentName = (item: (typeof items)[0], accompanimentId: number) => {
    return item.product.accompaniments.find((a) => a.id === accompanimentId)?.name || ""
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div
        ref={drawerRef}
        className="bg-white w-full max-w-md h-full flex flex-col shadow-xl transform transition-transform duration-300"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-cyan-600 flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Seu Pedido
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Seu carrinho está vazio</h3>
            <p className="text-gray-500 mb-6">Adicione itens do cardápio para começar seu pedido</p>
            <Button onClick={onClose} className="bg-cyan-500 hover:bg-cyan-600">
              Ver Cardápio
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {items.map((item, index) => (
                <div key={index} className="mb-6 border-b pb-6">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        {item.additionals.length > 0 && (
                          <div className="mt-1">
                            <span className="text-xs font-medium text-gray-700">Adicionais:</span>
                            <ul className="text-xs ml-2">
                            {item.additionals.map((additional) => (
                                <li key={additional.id}>
                                  + {getAdditionalName(item, additional.id)} ({additional.quantity}x)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.removedAccompaniments.length > 0 && (
                          <div className="mt-1">
                            <span className="text-xs font-medium text-gray-700">Removidos:</span>
                            <ul className="text-xs ml-2">
                              {item.removedAccompaniments.map((id) => (
                                <li key={id}>- {getRemovedAccompanimentName(item, id)}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-md">
                          <button
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(index, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="px-2 py-1">{item.quantity}</span>
                          <button
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(index, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="font-medium text-cyan-500">
                          R$ {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 bg-gray-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de entrega</span>
                  <span>R$ {formatPrice(getDeliveryFee())}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t">
                  <span>Total</span>
                  <span className="text-cyan-500">R$ {formatPrice(getTotal())}</span>
                </div>
              </div>

              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-lg py-6" onClick={handleCheckout}>
                Finalizar Pedido
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
