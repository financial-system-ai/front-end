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

export const formatCurrency = (valor: number, tipo: string | null) => {
  const [reais, centavos] = valor.toFixed(2).split('.');

  return `${reais} reais${centavos !== '00' ? ` e ${centavos} centavos` : ''} ${
    tipo ? `de ${tipo}s` : ''
  }`.trim();
};
