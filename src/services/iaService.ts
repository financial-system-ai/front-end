import axios from 'axios';
import type { DefaultJson } from '../model/default-json';

const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY = import.meta.env.VITE_AZURE_OPENAI_APIKEY;
const AZURE_DEPLOYMENT_NAME = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;
const AZURE_API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

export async function getAIresponse(
  frase: string,
): Promise<DefaultJson | null> {
  const currentYear = new Date().getFullYear();

  const promptSystem = {
    role: 'system',
    content:
      'Você é um assistente que responde apenas com JSON válido, sem explicações.',
  };

  const promptUser = {
    role: 'user',
    content: `A partir da frase abaixo, identifique:

- A ação que o sistema deve executar (chave "acao").
- O propósito da transação (chave "purpose").
- A categoria do item (chave "category").
- O tipo da movimentação (chave "type", valores "DESPESA" ou "VENDA").
- A data de início (chave "startDate", formato "YYYY-MM-DD").
- A data de fim (chave "endDate", formato "YYYY-MM-DD").
- O centro de custo envolvido (chave "costCenter").
- A ação **nunca** deve ser null.

Regras para determinar "acao":
- Se a pergunta pedir **“quanto foi comprado”** (todas as contas) para um centro de custo, devolva  
  **"consultar_total_comprado_por_centro_custo_e_periodo"**
- Se a pergunta pedir **“quanto foi comprado de [categoria]”**, devolva  
  **"consultar_total_comprado_categoria_por_centro_custo_e_periodo"**  
  ► **Neste caso inclua obrigatoriamente o campo "type" com "DESPESA" ou "VENDA".**
- Se a pergunta pedir **“quanto foi pago”** (todas as compras) para um centro de custo, devolva  
  **"consultar_total_pago_por_centro_custo_e_periodo"**
- Se a pergunta pedir **“quanto foi vendido em valor”**, devolva  
  **"consultar_total_vendido_valor_por_centro_custo_e_periodo"**
- Se a pergunta pedir **“quanto foi vendido em quilos/KG”**, devolva  
  **"consultar_total_vendido_peso_por_centro_custo_e_periodo"**

Regras para purpose:
- "Compras" ou "Compra" → **compras**

Regras para category:
- "Algodão" → **algodao**
- "Energia Elétrica" → **Energia Eletrica**
- "Gás" → **gas**
- "Lenha" → **lenha**
- "Poliéster" → **poliester**
- "Produto Químico" → **Produto Quimico**

Regras para costCenter:
- "Produção" → **producao**
- "Logística" → **logistica**

Regras para startDate e endDate:
- Se o período mencionar apenas mês/meses e não citar ano, assuma o ano corrente (${currentYear}).
- Se for **um único mês/ano** (ex.: “janeiro de 2025”), use  
  "startDate" = primeiro dia do mês, "endDate" = último dia do mês.
- Se for **intervalo de meses** dentro do mesmo ano (ex.: “janeiro a março de 2025”), use  
  "startDate" = 1º dia do mês inicial, "endDate" = último dia do mês final.
- Se forem dadas **datas específicas** (ex.: “de 01/01/2025 a 15/02/2025”), preserve-as.
- Se o período não for informado, use null em ambos.

Regra para costCenter:
- Se o centro de custo não for mencionado, use null.

Retorne **apenas** um JSON neste formato (exemplo):

{
    "acao": "consultar_total_comprado_categoria_por_centro_custo_e_periodo",
    "purpose": "compras",
    "category": "algodao",
    "type": "DESPESA",
    "startDate": "2025-01-01",
    "endDate": "2025-01-31",
    "costCenter": "producao"
}

Frase: "${frase}""
    `.trim(),
  };

  const body = {
    messages: [promptSystem, promptUser],
    max_tokens: 500,
    temperature: 0.7,
  };

  const url = `${AZURE_ENDPOINT}openai/deployments/${AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${AZURE_API_VERSION}`;

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
      },
    });

    if (response.status !== 200) {
      console.error('Erro na resposta da API:', response.statusText);
      return null;
    }
    const result = response?.data?.choices?.[0]?.message?.content;

    if (!result.trim()) return null;

    const contentClean = result
      .trim()
      .replace(/```(?:json)?/g, '')
      .replace(/```/g, '')
      .trim();

    const json = JSON.parse(contentClean);

    const data: DefaultJson = {
      acao: json.acao,
      purpose: json.purpose,
      category: json.category ?? null,
      startDate: json.startDate ?? null,
      endDate: json.endDate ?? null,
      costCenter: json.costCenter ?? null,
      type: json.type ?? null,
    };

    return data;
  } catch (error) {
    console.error('Erro ao chamar a API do Azure:', error);
    return null;
  }
}
