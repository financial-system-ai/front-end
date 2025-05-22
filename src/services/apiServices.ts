import axios from 'axios';
import { dateSolver, formatCurrency } from '../utils';
import type { getDetailedTransactions } from '../model/get-detailed.response';
import type { getBranchesComparative } from '../model/get-branches-comparative.response';
import type { getTotalTypePeriod } from '../model/get-total-type-period.response';
import type { getBranchTransactionTypeTimespan } from '../model/get-branch-transaction-type-timespan.response';
import type { getTransactionBranchTimespan } from '../model/get-transaction-branch-timespan.response';

const BASE_URL = 'http://localhost:8080/v1/';

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

const transactionByBranchAndTimeSpan = async (json: DefaultJson) => {
  const response = await axios.get(
    BASE_URL +
      `transactions/branch?type=${json.tipo.toUpperCase()}&branch=${
        json.filial
      }&startDate=${json.dataInicio}&endDate=${json.dataFim}`,
  );
  if (response.status === 204)
    return { error: true, message: 'Nenhum dado encontrado' };
  if (response.status !== 200)
    return { error: true, message: 'Erro ao buscar dados' };

  const data: getTransactionBranchTimespan = response.data;

  return {
    error: false,
    message: `${data.transactionType} de ${dateSolver(
      data.startDate,
    )} a ${dateSolver(data.endDate)} da ${data.branch} é ${formatCurrency(
      data.total,
      json.tipo,
    )}`,
  };
};

const branchTransactionByTypeAndTimeSpan = async (json: DefaultJson) => {
  const response = await axios.get(
    BASE_URL + `transactions/branch/top?type=${json.tipo.toUpperCase()}`,
  );
  if (response.status === 204)
    return { error: true, message: 'Nenhum dado encontrado' };
  if (response.status !== 200)
    return { error: true, message: 'Erro ao buscar dados' };

  const data: getBranchTransactionTypeTimespan = response.data;

  return {
    error: false,
    message: `A filial com maior movimentação de ${json.tipo} é a ${
      data.branch
    } com ${formatCurrency(data.amount, json.tipo)}`,
  };
};

const detailedTransactionsByBranchAndPeriod = async (json: DefaultJson) => {
  const response = await axios.get(
    BASE_URL +
      `transactions/detailed?branch=${json.filial}&startDate=${json.dataInicio}&endDate=${json.dataFim}`,
  );
  if (response.status === 204)
    return { error: true, message: 'Nenhum dado encontrado' };
  if (response.status !== 200)
    return { error: true, message: 'Erro ao buscar dados' };

  const data: getDetailedTransactions[] = response.data;

  return {
    error: false,
    message: `As transações detalhadas da ${json.filial} são:
      ${data.map(element => {
        return `${element.transactionType} em ${dateSolver(
          element.date,
        )} no valor de ${formatCurrency(element.amount, null)}`;
      })}
    
    `,
  };
};

const compareBranchesByTypeAndPeriod = async (json: DefaultJson) => {
  const response = await axios.get(
    BASE_URL +
      `transactions/comparison?type=${json.tipo.toUpperCase()}&startDate=${
        json.dataInicio
      }&endDate=${json.dataFim}`,
  );
  if (response.status === 204)
    return { error: true, message: 'Nenhum dado encontrado' };
  if (response.status !== 200)
    return { error: true, message: 'Erro ao buscar dados' };

  const data: getBranchesComparative = response.data;

  if (data.topBranches.length === 1) {
    return {
      error: false,
      message: `Apenas a ${data.topBranches[0].branch} teve movimentação de ${
        json.tipo
      }s nesse período, com ${formatCurrency(
        data.topBranches[0].amount,
        json.tipo,
      )}`,
    };
  }
  return {
    error: false,
    message: `${data.topBranches.map((element: any) => {
      return `${element.branch} teve ${formatCurrency(
        element.amount,
        json.tipo,
      )}`;
    })} e a diferença entre as filiais é de ${formatCurrency(
      data.difference,
      null,
    )}`,
  };
};

const totalByTypeAndPeriod = async (json: DefaultJson) => {
  const response = await axios.get(
    BASE_URL +
      `transactions/period?type=${json.tipo.toUpperCase()}&startDate=${
        json.dataInicio
      }&endDate=${json.dataFim}`,
  );
  if (response.status === 204)
    return { error: true, message: 'Nenhum dado encontrado' };
  if (response.status !== 200)
    return { error: true, message: 'Erro ao buscar dados' };

  const data: getTotalTypePeriod = response.data;

  return {
    error: false,
    message: `${data.transactionType} de ${dateSolver(
      data.startDate,
    )} a ${dateSolver(data.endDate)} é ${formatCurrency(
      data.total,
      json.tipo,
    )}`,
  };
};

//prettier-ignore
export const convertApiCalls = {
  "consultar_somatorio_transacao_por_filial_tipo_e_intervalo": async (
    data: DefaultJson,
  ) => await transactionByBranchAndTimeSpan(data),

 "consultar_filial_maior_transacao_somatorio_tipo_e_intervalo" : async (
    data: DefaultJson,
  ) => await branchTransactionByTypeAndTimeSpan(data),

  "consultar_transacoes_detalhadas_por_filial_e_periodo" : async (
    data: DefaultJson,
  ) => await detailedTransactionsByBranchAndPeriod(data),

  "consultar_comparativo_entre_filiais_por_tipo_e_periodo" : async (
    data: DefaultJson,
  ) => await compareBranchesByTypeAndPeriod(data),

  "consultar_total_geral_por_tipo_e_periodo" : async (
    data: DefaultJson,
  ) => await totalByTypeAndPeriod(data),
  
} as const;
