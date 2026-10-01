BORBOBARBER - Projeto SENAI

Arquivos:
- index.html: estrutura do site
- style.css: visual e responsividade
- script.ts: código TypeScript do chatbot
- script.js: versão compilada pronta para o navegador

Como abrir:
1. Abra a pasta BORBOBARBER no VS Code.
2. Abra index.html com Live Server ou diretamente no navegador.
3. Clique no botão de chat no canto inferior direito.

Para executar/compilar TypeScript:
npm init -y
npm install -D typescript tsx @types/node
npx tsc script.ts --target ES2020 --lib ES2020,DOM

Observação: os horários do projeto são demonstrativos e podem ser alterados no objeto 'agenda' em script.ts.
