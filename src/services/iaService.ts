import axios from 'axios';

const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY = import.meta.env.VITE_AZURE_OPENAI_APIKEY;
const AZURE_DEPLOYMENT_NAME = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;
const AZURE_API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

type DefaultJson = {
  acao: string;
  tipo: string;
  mesInicio: number | null;
  mesFim: number | null;
  filial: string | null;
  ano: number;
  dataInicio?: string;
  dataFim?: string;
};

export async function getAIresponse(
  frase: string,
): Promise<DefaultJson | null> {
  const promptSystem = {
    role: 'system',
    content:
      'Você é um assistente que responde apenas com JSON válido, sem explicações.',
  };

  const promptUser = {
    role: 'user',
    content: `
    A partir da frase abaixo, identifique:

    - A ação que o sistema deve executar (chave "acao").
    - O tipo da transação (chave "tipo") com os possíveis valores: "entrada", "despesa" ou "lucro".
    - O mês de início (chave "mesInicio", número de 1 a 12).
    - O mês de fim (chave "mesFim", número de 1 a 12).
    - A filial envolvida, as opções de filiais disponíveis estarão detalhadas abaixo na seção ("Regras para filial").
    - A ação nunca deve ser null.

    Regras para determinar "acao":
    - Se mencionar uma filial que se encaixe nas opções de filiais descritas abaixo, um intervalo de tempo e o tipo de transação, retorne: "consultar_somatorio_transacao_por_filial_tipo_e_intervalo"
    - Se perguntar qual filial teve maior movimentação, responda com: "consultar_filial_maior_transacao_somatorio_tipo_e_intervalo"
    - Se mencionar uma filial que se encaixe nas opções de filiais descritas abaixo, um intervalo de tempo, (considere usar essa função APENAS e SOMENTE se NÃO for citada um tipo), retorne: "consultar_transacoes_detalhadas_por_filial_e_periodo"
    - Se quiser comparar valores entre filiais por tipo, retorne: "consultar_comparativo_entre_filiais_por_tipo_e_periodo"
    - Se quiser o total geral de um tipo (considere usar essa função APENAS e SOMENTE se NÃO for citada uma filial), use: "consultar_total_geral_por_tipo_e_periodo"

    Regras para "tipo":
    - "entrada" → entrada
    - "despesa" → despesa
    - "lucro" → lucro
    - "faturamento" → entrada

    Regras para "mesInicio" e "mesFim":
    - Se só um mês for citado, use o mesmo em ambos
    - Se for intervalo (ex: "janeiro a março"), converta corretamente
    - Se nenhum for citado, use null

    Regra para "filial":
    - Existem 3 filiais: "Matriz", "Filial São Paulo" e "Filial Rio de Janeiro", utilize apenas essas opções ao montar o JSON
    - Se a filial não for mencionada, use null

    Retorne apenas um JSON neste formato:

    {
        "acao": "consultar_somatorio_transacao_por_filial_tipo_e_intervalo",
        "tipo": "entrada",
        "mesInicio": 1,
        "mesFim": 3,
        "filial": "Matriz"
    }

    Frase: "${frase}"
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

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();

    const data: DefaultJson = {
      acao: json.acao,
      tipo: json.tipo,
      mesInicio: json.mesInicio ?? null,
      mesFim: json.mesFim ?? null,
      filial: json.filial ?? null,
      ano: anoAtual,
    };

    if (data.mesInicio)
      data.dataInicio = new Date(anoAtual, data.mesInicio - 1, 1)
        .toISOString()
        .split('T')[0];

    if (data.mesFim)
      data.dataFim = new Date(anoAtual, data.mesFim, 0)
        .toISOString()
        .split('T')[0];

    return data;
  } catch (error) {
    console.error('Erro ao chamar a API do Azure:', error);
    return null;
  }
}
