import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "./products"
import { Item } from "@radix-ui/react-accordion"

export interface CartItem {
  product: Product
  quantity: number
  additionals: { id: number; quantity: number }[]
  removedAccompaniments: number[]
  notes?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateItem: (index: number, item: CartItem) => void
  removeItem: (index: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getDeliveryFee: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem: CartItem) => {
        set((state) => {
          // Check if the product already exists in the cart with the same additionals and removals
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === newItem.product.id &&
              JSON.stringify([...item.additionals].sort((a, b) => a.id - b.id)) ===
                JSON.stringify([...newItem.additionals].sort((a, b) => a.id - b.id)) &&
              JSON.stringify([...item.removedAccompaniments].sort()) ===
                JSON.stringify([...newItem.removedAccompaniments].sort()))
            

          if (existingItemIndex !== -1) {
            // If item exists, update its quantity
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += newItem.quantity
            return { items: updatedItems }
          } else {
            // Otherwise add as new item
            return { items: [...state.items, newItem] }
          }
        })
      },

      updateItem: (index: number, updatedItem: CartItem) => {
        set((state) => {
          const newItems = [...state.items]
          newItems[index] = updatedItem
          return { items: newItems }
        })
      },

      removeItem: (index: number) => {
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        }))
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          let itemTotal = item.product.price * item.quantity

          item.additionals.forEach(({ id, quantity }) => {
            const additional = item.product.additionals.find((a) => a.id === id)
            if (additional) {
              itemTotal += additional.price * quantity
            }
          })

          return total + itemTotal
        }, 0)
      },

      getDeliveryFee: () => {
        const cart = useCartStore.getState();
      const idProduto = cart.items[0]?.product.id;
        if(idProduto === 0){
          return 0.0;
        }
        return 4.90
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee()
      },
    }),
    {
      name: "sushi4you-cart",
    },
  ),
)
