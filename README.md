# Comando de Voz para Consulta de Dados Financeiros - Frontend

Este projeto consiste na interface web para a aplicação de consulta de dados financeiros por meio de comandos de voz, com interpretação por IA e respostas em áudio. A interface foi desenvolvida para ser intuitiva e responsiva, garantindo uma experiência acessível e fluida para os usuários.

## Funcionalidades

- **Interface de Comando de Voz**: O usuário interage com a aplicação utilizando comandos de voz.
- **Conversão de Fala para Texto (STT)**: Utilização do Azure Speech Services para converter a fala do usuário em texto.
- **Consulta Inteligente**: O texto processado é enviado para o backend, que consulta os dados financeiros conforme a solicitação.
- **Síntese de Fala (TTS)**: A resposta do backend é convertida novamente em fala utilizando o Azure Speech Services, retornando ao usuário um feedback por áudio.
- **Interface Responsiva**: Desenvolvida com React, garantindo compatibilidade em diferentes dispositivos.

## Tecnologias Utilizadas

- **Vite**: Ferramenta de bundling e build para desenvolvimento rápido e eficiente.
- **React**: Biblioteca para construção da interface do usuário.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática ao código, aumentando a segurança e legibilidade.
- **Azure OpenAI**: Utilizado para o processamento e interpretação dos comandos de voz, permitindo respostas mais precisas e contextualizadas.
- **Azure Speech Services**: Responsável pelo reconhecimento de fala (speech-to-text) e pela síntese de fala (text-to-speech).


![Vite](https://img.shields.io/badge/vite-%238A74fE.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%23216CC0.svg?style=for-the-badge&logo=react&logoColor=white)
![Typescript](https://img.shields.io/badge/typescript-3178c6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![OpenAi](https://img.shields.io/badge/azure%20open%20ai-%2315A17D.svg?style=for-the-badge&logo=openai&logoColor=white)
![Azure](https://img.shields.io/badge/azure-%230078d4.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)