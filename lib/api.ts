interface Endereco {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchEnderecoLojaProxima(cepOriginal: string): Promise<Endereco> {
  const cepLimpo = cepOriginal.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    throw new Error("CEP inválido: precisa conter 8 dígitos");
  }

  const baseCep = cepLimpo.slice(0, 5);
  const sufixosTestar: string[] = [];

  for (let i = 0; i < 1000; i++) {
    const sufixo = i.toString().padStart(3, "0");
    sufixosTestar.push(sufixo);
  }

  const enderecoOriginal = await buscarCep(cepLimpo);
  if (!enderecoOriginal || enderecoOriginal.erro) {
    throw new Error("CEP original inválido");
  }

  for (const sufixo of sufixosTestar) {
    const novoCep = baseCep + sufixo;
    if (novoCep === cepLimpo) continue;

    try {
      const endereco = await buscarCep(novoCep);

      if (
        endereco &&
        !endereco.erro &&
        endereco.localidade === enderecoOriginal.localidade &&
        endereco.uf === enderecoOriginal.uf &&
        endereco.bairro &&
        endereco.logradouro
      ) {
        return endereco;
      }
    } catch {
      // Continua tentando
    }
  }

  throw new Error("CEP inválido: nenhum endereço próximo encontrado.");
}

export async function fetchAddressByCep(cep: string): Promise<Endereco> {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    throw new Error("CEP inválido: precisa conter 8 dígitos");
  }

  const endereco = await buscarCep(cepLimpo);
  if (!endereco || endereco.erro) {
    throw new Error("CEP não encontrado");
  }

  return endereco;
}

async function buscarCep(cep: string): Promise<Endereco> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error("Erro na requisição para a API ViaCEP");
  }

  const data = await response.json();
  return data;
}
