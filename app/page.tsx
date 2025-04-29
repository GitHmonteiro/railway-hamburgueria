"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { MultiStepModal } from "@/components/multi-step-modal";
import { Logo } from "@/components/logo";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart";
import { fetchEnderecoLojaProxima } from "@/lib/api";
import { CartDrawer } from "@/components/cart-drawer";

interface UserInfo {
  name: string;
  cep: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  reference: string;
}

interface LojaFake {
  neighborhood: string;
  address: string;
}

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [storeInfo, setStoreInfo] = useState<LojaFake | null>(null);
  const [showStoreFound, setShowStoreFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    try {
      const savedUserInfo = localStorage.getItem("sushi4you_user_info");
      const savedStoreInfo = localStorage.getItem("sushi4you_store_info");

      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo));
        setShowModal(false);
      } else {
        setShowModal(true);
      }

      if (savedStoreInfo) {
        setStoreInfo(JSON.parse(savedStoreInfo));
      }
    } catch (error) {
      console.error("Erro ao acessar localStorage:", error);
      setShowModal(true);
    }

    setIsLoading(false);
  }, []);

  const handleModalComplete = async (data: UserInfo) => {
    setUserInfo(data);
    setShowModal(false);

    try {
      localStorage.setItem("sushi4you_user_info", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }

    try {
      const storeData = await fetchEnderecoLojaProxima(data.cep);

      if (storeData) {
        const lojaFake: LojaFake = {
          neighborhood: storeData.bairro,
          address: storeData.logradouro,
        };

        setStoreInfo(lojaFake);
        localStorage.setItem("sushi4you_store_info", JSON.stringify(lojaFake));

        setShowStoreFound(true);
        setTimeout(() => setShowStoreFound(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço da loja próxima:", error);
    }
  };

  const clearUserData = () => {
    try {
      localStorage.removeItem("sushi4you_user_info");
      localStorage.removeItem("sushi4you_store_info");
      setUserInfo(null);
      setStoreInfo(null);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao limpar os dados:", error);
    }
  };

  const promotionalProducts = products.slice(0, 4);
  const regularProducts = products.slice(4);
  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-white">
      {showModal && <MultiStepModal onComplete={handleModalComplete} />}

      {showStoreFound && storeInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">Loja encontrada!</h2>
            <p className="text-lg">
              Loja encontrada a 2,2 km em {storeInfo.address}, {storeInfo.neighborhood}
            </p>
            <Button className="mt-4 bg-cyan-500 hover:bg-cyan-600" onClick={() => setShowStoreFound(false)}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      <header
        style={{
          backgroundImage: 'url("/images/381043306_684701029912554_6472057376029863136_n.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
        className="text-white py-6"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <Logo />
            {userInfo && (
              <div className="mt-2 text-center">
                <p className="text-sm">
                  {userInfo.address}, {userInfo.complement} - {userInfo.neighborhood}
                </p>
                {storeInfo && (
                  <div className="flex justify-center mt-3 mb-2">
                    <div className="bg-white text-black px-4 py-1 rounded-full flex items-center shadow-sm">
                      <span className="text-sm font-medium">
                        Loja mais próxima em - {storeInfo.address}, {storeInfo.neighborhood}
                      </span>
                      <div className="ml-2 h-3 w-3 rounded-full bg-cyan-500 animate-pulse"></div>
                    </div>
                  </div>
                )}
                <button onClick={clearUserData} className="text-xs underline mt-1 opacity-70 hover:opacity-100">
                  Alterar endereço
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black-600">Promoções</h2>
            <div className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              Ofertas especiais
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promotionalProducts.map((product) => (
              <ProductCard key={product.id} product={product} isPromo={true}hidePrice={product.id === 1}  />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black-600 mb-6">Cardápio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProducts.map((product) => (
              <ProductCard key={product.id} product={product} isPromo={false} />


            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-4 right-4">
        <Button
          className="bg-cyan-500 hover:bg-cyan-600 rounded-full h-16 w-16 shadow-lg relative"
          onClick={() => setShowCart(true)}
        >
          <ShoppingBag className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
              {itemCount}
            </span>
          )}
        </Button>
      </div>

      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
}
