import { MESSAGE_ERROR } from '../config';
import type { DefaultJson } from '../model/default-json';
import type { DetailedTransactionsBranchPeriodResponse } from '../model/detailed-transactions-branch-period.response';
import type { TotalByCostCenterCategoryPeriodResponse } from '../model/total-by-cost-center-category-period.response';
import type { TotalByCostCenterPeriodResponse } from '../model/total-by-cost-center-period.response';
import { formatCurrency, formatWeight, getParams } from '../utils';
import { api } from './axios';

const totalByCostCenterAndPeriod = async (json: DefaultJson) => {
  try {
    const response = await api.get(`/transactions/purchases`, {
      params: getParams(json),
    });
    const data: TotalByCostCenterPeriodResponse = response.data;

    return {
      error: false,
      message: `${formatCurrency(data.total, null)}`,
    };
  } catch (error: any) {
    const response: keyof typeof MESSAGE_ERROR = error.response.data.error;
    return {
      error: true,
      message: MESSAGE_ERROR[response](json.type) || 'Erro ao buscar dados',
    };
  }
};
const totalByCategoryCostCenterAndPeriod = async (json: DefaultJson) => {
  try {
    const response = await api.get(`/transactions/total`, {
      params: getParams(json, 'DESPESA'),
    });
    const data: TotalByCostCenterCategoryPeriodResponse = response.data;

    return {
      error: false,
      message: `${formatCurrency(data.total, null)}`,
    };
  } catch (error: any) {
    const response: keyof typeof MESSAGE_ERROR = error.response.data.error;
    return {
      error: true,
      message: MESSAGE_ERROR[response](json.type) || 'Erro ao buscar dados',
    };
  }
};
const detailedTransactionsByBranchAndPeriod = async (json: DefaultJson) => {
  try {
    const response = await api.get(`/transactions/total/expenses`, {
      params: getParams(json),
    });
    const data: DetailedTransactionsBranchPeriodResponse = response.data;
    return {
      error: false,
      message: `O centro de custo ${
        data.costCenterName
      } pagou um total de ${formatCurrency(data.total, null)}`,
    };
  } catch (error: any) {
    const response: keyof typeof MESSAGE_ERROR = error.response.data.error;
    return {
      error: true,
      message: MESSAGE_ERROR[response](json.type) || 'Erro ao buscar dados',
    };
  }
};

const totalSoldByCostCenter = async (json: DefaultJson) => {
  try {
    const response = await api.get(`/transactions/total/sales`, {
      params: getParams(json, 'VENDA'),
    });
    const data: DetailedTransactionsBranchPeriodResponse = response.data;

    return {
      error: false,
      message: `As vendas do centro de custo ${data.costCenterName} de ${
        json.category
      } foram de ${formatCurrency(data.total, null)}`,
    };
  } catch (error: any) {
    const response: keyof typeof MESSAGE_ERROR = error.response.data.error;
    return {
      error: true,
      message: MESSAGE_ERROR[response](json.type) || 'Erro ao buscar dados',
    };
  }
};
const soldByWeightCostCenterPeriod = async (json: DefaultJson) => {
  try {
    const response = await api.get(`transactions/total/sales/kg`, {
      params: getParams(json, 'VENDA'),
    });
    const data: DetailedTransactionsBranchPeriodResponse = response.data;

    return {
      error: false,
      message: `As vendas do centro de custo ${data.costCenterName} de ${
        json.category
      } em KILOS foram de ${formatWeight(data.total, null)}`,
    };
  } catch (error: any) {
    const response: keyof typeof MESSAGE_ERROR = error.response.data.error;
    return {
      error: true,
      message: MESSAGE_ERROR[response](json.type) || 'Erro ao buscar dados',
    };
  }
};

//prettier-ignore
export const convertApiCalls = {
  "consultar_total_comprado_por_centro_custo_e_periodo": async (
    data: DefaultJson,
  ) => await totalByCostCenterAndPeriod(data),
  "consultar_total_comprado_categoria_por_centro_custo_e_periodo": async (
    data: DefaultJson,
  ) => await totalByCategoryCostCenterAndPeriod(data),
  "consultar_total_pago_por_centro_custo_e_periodo": async (
    data: DefaultJson,
  ) => await detailedTransactionsByBranchAndPeriod(data),
  "consultar_total_vendido_valor_por_centro_custo_e_periodo": async (
    data: DefaultJson,
  ) => await totalSoldByCostCenter(data),
  "consultar_total_vendido_peso_por_centro_custo_e_periodo": async (data: DefaultJson) =>
    await soldByWeightCostCenterPeriod(data),
} as const;
