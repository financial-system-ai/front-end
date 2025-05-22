//prettier-ignore
export const MESSAGE_ERROR = {
  "ENTITY_NOT_FOUND": (type:string) => `Nenhum ${type} encontrado`,
  "NO_TRANSACTIONS_FOUND": (type:string) => `Nenhuma transação encontrada para o tipo ${type}`,
  "INVALID_PERIOD": () => `O Período informado é inválido`,
  "API_FIELDS_INVALID": () => `Ocorreu um erro ao processar os campos`,
  "INVALID_TRANSACTION_TYPE": () => `Tipo de transação inválido`,
  "INSUFFICIENT_BRANCHES_FOR_COMPARISON": () => `Número insuficiente de filiais para comparação`
};
