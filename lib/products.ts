export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  // Media options
  media?: {
    type: "instagram" | "local"
    url: string
  }
  ingredients: string[]
  additionals: Additional[]
  accompaniments: Accompaniment[]
}

export interface Additional {
  id: number
  name: string
  price: number
}

export interface Accompaniment {
  id: number
  name: string
  included: boolean
  price?: number
}

export const products: Product[] = [
  {
    id: 0,
    name: "Dupla de Fogo - 1º pedido",
    description:
      "Monte seu combo de boas vindas, a taxa de entrega não se aplica no 1º pedido",
    price: 32.50,
    image: "/images/produto0.jpg",
    // Example local video
    media: {
      type: "local",
      url: "/videos/produto0.mp4",
    },
    ingredients: ["Blend 150g", "Bacon", "Cheddar"],
    additionals: [
      { id: 1, name: "Blend bovino de 150g", price: 9.50 },
      { id: 2, name: "Fritas 400gr + Catupiry", price: 17.90 },
      { id: 3, name: "Fritas 400gr + Cheddar", price: 17.90 },
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
     
    ]
  },
  {
    id: 1,
    name: "Seu 1º Pedido - Entrega Grátis",
    description:
      "Monte seu combo de boas vindas, a taxa de entrega não se aplica no 1º pedido",
    price: 0.00,
    image: "/images/produto1.jpg",
    // Example local video
    ingredients: [
      
    ],
    additionals: [
      { id: 1, name: "Aesir", price: 27.50 },
      { id: 2, name: "Frigga", price: 22.50  },
      { id: 3, name: "Heimdall", price: 22.50  },
      { id: 4, name: "Jotunheim", price: 22.50 },
      { id: 5, name: "Midgard", price: 22.50  },
      { id: 6, name: "Forsetil", price:22.50  },
      { id: 7, name: "Iscas de frango com tempero da casa", price: 25.90 },
      { id: 8, name: "Fritas com bacon e Catupiry", price: 22.50 },
      { id: 9, name: "Fritas com bacon e cheddar", price: 22.50 },
    ],
    accompaniments: [
     
    ]
  },
  {
    id: 2,
    name: "Aesir",
    description: 
    `Aesir em sua versão suprema: pão brioche com 2 bifes de 150g de blend bovino, alface, tomate, cebola roxa, bacon e mussarela EM DOBRO!`,
    price: 39,
    image: "/images/produto2.jpg",
    media: {
      type: "local",
      url: "/videos/produto2.mp4",
    },
    ingredients: ["Blend 150g", "Bacon", "Muçarela","Alface", "Cebola roxa", "tomate"],
    additionals: [
      { id: 1, name: "Blend bovino de 150g", price: 9.50 },
      { id: 2, name: "Fritas 400gr + Catupiry", price: 17.90 },
      { id: 3, name: "Fritas 400gr + Cheddar", price: 17.90 },
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
      { id: 2, name: "Molho agridoce", included: true }
    ]
  },
  {
    id: 3,
    name: "Frigga",
    description:
      "Rendam-se aos sabores mitológicos do Frigga! Inspirado na majestosa deusa nórdica, nosso hambúrguer possui um blend bovino de 150g, a força do bacon, a ousadia do creme de gorgonzola e a doçura da geleia de frutas vermelhas",
    price: 33.00,
    image: "/images/produto3.jpg",
    media: {
      type: "local",
      url: "/videos/produto3.mp4",
    },
    ingredients: [
      "Blend bovino de 150g",
      "Geléia de frutas vermelhas",
      "Creme de Gorgonzola",
      "Bacon",
    ],
    additionals: [
      { id: 1, name: "Blend bovino de 150g", price: 9.50 },
      { id: 2, name: "Fritas 400gr + Catupiry", price: 17.90 },
      { id: 3, name: "Fritas 400gr + Cheddar", price: 17.90 },
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
      { id: 2, name: "Molho agridoce", included: true }
    ]
  },  
  {
    id: 4,
    name: "Heimdall",
    description:
      "O sabor irresistível do cheddar derretido combinado com um suculento hambúrguer e um bacon super crocante, é a combinação perfeita para matar aquela monstruosa fome de hamburguer",
    price: 37.50,
    image: "/images/produto4.jpg",
    media: {
      type: "local",
      url: "/videos/produto4.mp4",
    },
    ingredients: [
      "Blend bovino de 150g",
      "Pepino",
      "Cheddar",
      "Bacon",
      "Cebola caramelizada"
    ],
    additionals: [
      { id: 1, name: "Blend bovino de 150g", price: 9.50 },
      { id: 2, name: "Fritas 400gr + Catupiry", price: 17.90 },
      { id: 3, name: "Fritas 400gr + Cheddar", price: 17.90 },
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
      { id: 2, name: "Pepino", included: true },
      { id: 3, name: "Cheddar", included: true },
    ]
  },  
  {
    id: 5,
    name: "Jotunheim",
    description: "O sabor irresistível do provolone derretido combinado com um suculento hambúrguer e um bacon super crocante com cebola caramelizada, é a combinação perfeita para matar aquela monstruosa fome de hamburguer",
    price: 29.90,
    image: "/images/produto5.jpg",
    media: {
      type: "local",
      url: "/videos/produto5.mp4",
    },
    ingredients: [
      "Blend bovino de 150g",
      "Onion de bacon",
      "Cheddar",
      "Bacon",
      "Cebola caramelizada"
    ],
    additionals: [
      { id: 1, name: "Blend bovino de 150g", price: 9.50 },
      { id: 2, name: "Fritas 400gr + Catupiry", price: 17.90 },
      { id: 3, name: "Fritas 400gr + Cheddar", price: 17.90 },
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
      { id: 2, name: "Provolone", included: true },
      { id: 3, name: "Cheddar", included: true },
      { id: 4, name: "Cebola caramelizada", included: true },
    ]
  },  
  {
    id: 7,
    name: "Forseti",
    description: "Forseti é feito de um suculento hambúrguer de frango empanado, que conta também com catupiry, tiras de bacon, alface, tomate e cebola roxa - uma combinação digna dos deuses nórdicos",
    price: 19.90,
    image: "/images/produto7.jpg",
    media: {
      type: "local",
      url: "/videos/produto7.mp4",
    },
    ingredients: [
      "150g de blend frango empanado",
      "Alface americana",
      "Cebola roxa",
      "Bacon",
      "Catupiry",
    ],
    additionals: [
      { id: 1, name: "Blend bovino de 150g", price: 9.50 },
      { id: 2, name: "Fritas 400gr + Catupiry", price: 17.90 },
      { id: 3, name: "Fritas 400gr + Cheddar", price: 17.90 },
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
      { id: 2, name: "Molho agridoce", included: true }
    ]
  },  
  {
    id: 6,
    name: "Midgard",
    description: "Blend 180g, queijo american cheese, Catupiry e farofa de bacon defumado, no pão de brioche artesanal chapeado na manteiga.",
    price: 24.90,
    image: "/images/produto6.jpg",
    media: {
      type: "local",
      url: "/videos/produto6.mp4",
    },
    ingredients: [
      "Blend 180g",
      "Farofa de bacon",
      "Catupiry",
      "Pão de brioche"
    ],
    additionals: [
      { id: 1, name: "Blend bovino de 150g", price: 9.50 },
      { id: 2, name: "Fritas 400gr + Catupiry", price: 17.90 },
      { id: 3, name: "Fritas 400gr + Cheddar", price: 17.90 },
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
      { id: 2, name: "Blend de queijo coalho empanado 150g", included: true },
      { id: 3, name: "Onion de bacon", included: true },
      { id: 4, name: "Picles de pepino", included: true },
      { id: 5, name: "Queijo fundido", included: true },
    ]
  },
  {
    id: 9,
    name: "Iscas de frango com tempero da casa",
    description: "800gde Frango empanado, com tempero do Cheff",
    price: 89.90,
    image: "/images/produto9.jpg",
    ingredients: [
      "Frango empanado",
      "Maionese de Alho",
    ],
    additionals: [
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
    ]
  },
  {
    id: 10,
    name: "Fritas com bacon e cheddar",
    description: "500g de batata acompanhada de cheddar, e bacon",
    price: 59.90,
    image: "/images/produto10.jpg",
    ingredients: [
      "Batata",
      "Cheddar",
      "Bacon",
      "Maionese de alho",
    ],
    additionals: [
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
      { id: 2, name: "Bacon", included: true },
      { id: 3, name: "Cheddar", included: true }
    ]
  }  ,
  {
    id: 11,
    name: "Fritas com bacon e catupiry",
    description: "500g de batata acompanhada de catupiry, e bacon",
    price: 89.90,
    image: "/images/produto11.jpg",
    ingredients: [
      "Batata",
      "Catupiry",
      "Bacon",
      "Maionese de alho",
    ],
    additionals: [
      { id: 4, name: "Creme de Gorgonzola", price: 6.0 },
      { id: 5, name: "Catupiry", price: 5 },
      { id: 6, name: "Maionese - Mostar e Mel 120 ml", price: 3 },
      { id: 7, name: "Maionese - Alho 120 ml", price: 3 },
      { id: 8, name: "Maionese - Bacon ml", price: 3 },
      { id: 9, name: "Geléia de frutas vermelhas", price: 3 },
    ],
    accompaniments: [
      { id: 1, name: "Maionese - Alho 120 ml", included: true },
      { id: 2, name: "Bacon", included: true },
      { id: 3, name: "Catupiry", included: true }
    ]
  },
]
