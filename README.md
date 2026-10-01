# 💈 BORBOBARBER

Projeto acadêmico desenvolvido para o **SENAI**, com o objetivo de criar um site moderno e responsivo para uma barbearia, utilizando **HTML, CSS e TypeScript**.

O projeto apresenta os serviços da **BORBOBARBER** e possui um chatbot que auxilia o cliente durante o processo de atendimento e agendamento.

## 📌 Sobre o projeto

A BORBOBARBER foi desenvolvida como uma simulação de um sistema de atendimento para uma barbearia.

O cliente pode navegar pelo site, visualizar os serviços disponíveis e utilizar um chatbot para realizar uma simulação de agendamento.

Para acessar o sistema de agendamento, o usuário precisa primeiro realizar um cadastro ou login.

Como este é um projeto acadêmico, os dados são armazenados localmente no navegador utilizando `localStorage`, sem utilização de banco de dados externo.

## 🚀 Funcionalidades

- Site responsivo para computador e celular
- Apresentação da BORBOBARBER
- Exibição dos serviços e preços
- Sistema de cadastro
- Sistema de login
- Dados armazenados com `localStorage`
- Agendamento disponível apenas para usuários cadastrados
- Chatbot de atendimento
- Saudação automática de acordo com o horário:
  - Bom dia
  - Boa tarde
  - Boa noite
- Escolha do serviço
- Escolha do dia
- Escolha do horário disponível
- Confirmação da solicitação de agendamento
- Botões interativos utilizando TypeScript

## 🤖 Chatbot

O chatbot da BORBOBARBER auxilia o cliente durante o processo de agendamento.

O fluxo funciona da seguinte maneira:

**Cliente cadastrado → Serviço → Dia → Horário → Confirmação**

Ao iniciar uma conversa, o chatbot identifica o horário atual do dispositivo e utiliza automaticamente uma saudação adequada.

Exemplo:

`Bom dia! Bem-vindo à BORBOBARBER. 💈 Como posso ajudar?`

## 💻 Tecnologias utilizadas

- HTML5
- CSS3
- TypeScript
- JavaScript
- LocalStorage
- Visual Studio Code

## 📂 Estrutura do projeto

```text
BORBOBARBER/
│
├── index.html
├── style.css
├── script.ts
├── script.js
└── README.md
```

## ▶️ Como executar

1. Baixe ou clone o projeto.
2. Abra a pasta no Visual Studio Code.
3. Abra o arquivo `index.html`.
4. Utilize a extensão **Live Server** para executar o site.
5. Acesse o site pelo navegador.
6. Crie um cadastro para liberar o sistema de agendamento.

## 🎯 Objetivo

O objetivo do projeto é aplicar conhecimentos de desenvolvimento web estudados no SENAI, trabalhando conceitos como:

- Estruturação de páginas com HTML
- Estilização e responsividade com CSS
- Programação com TypeScript
- Manipulação do DOM
- Funções
- Condicionais
- Eventos
- Arrays e objetos
- Armazenamento local
- Interação entre usuário e sistema

## ⚠️ Observação

Este projeto foi desenvolvido exclusivamente para **fins acadêmicos**.

O cadastro, login e agendamento são simulações executadas no próprio navegador e não devem ser utilizados como sistema de autenticação ou agendamento em produção.

## 👨‍💻 Projeto acadêmico

**Projeto:** BORBOBARBER  
**Instituição:** SENAI  
**Tipo:** Projeto de Desenvolvimento Web
