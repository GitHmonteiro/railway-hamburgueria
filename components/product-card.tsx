import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
  isPromo: boolean
  hidePrice?: boolean;
}

export function ProductCard({ product, isPromo,hidePrice  }: ProductCardProps) {
  return (
    <Link href={`/produto/${product.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={300}
            className="w-full  object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isPromo && <Badge className="absolute top-2 right-2 bg-yellow-400 text-gray-800">Promoção</Badge>}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
          <div className="mt-3 flex justify-between items-center">
            
          <div>
  {hidePrice ? null : (
    isPromo ? (
      <div className="flex items-center gap-2">
        <span className="text-gray-500 line-through text-sm">
          R$ {(product.price * 1.2).toFixed(2).replace(".", ",")}
        </span>
        <span className="font-bold text-pink-500">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </span>
      </div>
    ) : (
      <span className="font-bold text-gray-800">
        R$ {product.price.toFixed(2).replace(".", ",")}
      </span>
    )
  )}
</div>

                

            <span className="text-xs text-cyan-500">Ver detalhes →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
