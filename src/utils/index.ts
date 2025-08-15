import type { DefaultJson } from '../model/default-json';

export const dateSolver = (date: String) => {
  const dateParts = date.split('-');
  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  return months[parseInt(dateParts[1]) - 1];
};

export const formatCurrency = (valor: string, tipo: string | null) => {
  const [reais, centavos] = valor.split('.');
  return `${reais} reais${centavos !== '00' ? ` e ${centavos} centavos` : ''} ${
    tipo ? `de ${tipo}s` : ''
  }`.trim();
};
export const formatWeight = (valor: string, tipo: string | null) => {
  const [kilos, gramas] = valor.split('.');
  return `${kilos} kilos${gramas !== '00' ? ` e ${gramas} gramas` : ''} ${
    tipo ? `de ${tipo}s` : ''
  }`.trim();
};

export const getParams = (json: DefaultJson, type?: string) =>
  Object.fromEntries(
    Object.entries({
      type: type,
      purpose: json.purpose,
      category: json.category,
      costCenter: json.costCenter,
      startDate: json.startDate,
      endDate: json.endDate,
    }).filter(([_, value]) => value !== null && value !== undefined),
  );
