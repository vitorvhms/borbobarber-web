const agenda = {
  "Segunda-feira": ["09:00", "10:30", "14:00", "16:00", "18:00"],
  "Terça-feira": ["09:30", "11:00", "13:30", "15:00", "17:30"],
  "Quarta-feira": ["10:00", "12:00", "14:30", "16:30", "18:30"],
  "Quinta-feira": ["09:00", "11:30", "14:00", "17:00", "18:30"],
  "Sexta-feira": ["09:30", "11:00", "13:00", "15:30", "18:00"],
  "Sábado": ["09:00", "10:30", "12:00", "14:00", "16:00"]
};
const servicos = ["Corte — R$ 35", "Barba — R$ 25", "Corte + Barba — R$ 55", "Sobrancelha — R$ 15"];
const chat = document.querySelector("#chatBox");
const mensagens = document.querySelector("#chatMessages");
const opcoes = document.querySelector("#chatOptions");
const authModal = document.querySelector("#authModal");
const authForm = document.querySelector("#authForm");
const authName = document.querySelector("#authName");
const authPhone = document.querySelector("#authPhone");
const authEmail = document.querySelector("#authEmail");
const authError = document.querySelector("#authError");
const loginForm = document.querySelector("#loginForm");
const loginPhone = document.querySelector("#loginPhone");
const loginEmail = document.querySelector("#loginEmail");
const loginError = document.querySelector("#loginError");
const showRegister = document.querySelector("#showRegister");
const showLogin = document.querySelector("#showLogin");
const authTitle = document.querySelector("#authTitle");
const authText = document.querySelector("#authText");
const siteNotification = document.querySelector("#siteNotification");
const accountModal = document.querySelector("#accountModal");
const accountName = document.querySelector("#accountName");
const accountPhone = document.querySelector("#accountPhone");
const accountEmail = document.querySelector("#accountEmail");
let servicoEscolhido = "";
let diaEscolhido = "";
let iniciado = false;
let acaoDepoisDoCadastro = null;
let notificationTimer;

function saudacaoPorHorario() {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}
function mostrarNotificacao(texto, tipo = "error") {
  clearTimeout(notificationTimer);
  siteNotification.textContent = texto;
  siteNotification.className = `site-notification ${tipo} show`;
  notificationTimer = setTimeout(() => siteNotification.classList.remove("show"), 3200);
}
function usuarioLogado() {
  try { return JSON.parse(localStorage.getItem("borboSessao") || "null"); } catch { return null; }
}
function cadastrosSalvos() {
  try {
    const dados = JSON.parse(localStorage.getItem("borboCadastros") || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch { return []; }
}
function normalizarTelefone(valor) { return valor.replace(/\D/g, ""); }
function mostrarModoAuth(modo = "cadastro") {
  const login = modo === "login";
  authForm.hidden = login;
  loginForm.hidden = !login;
  showRegister.classList.toggle("active", !login);
  showLogin.classList.toggle("active", login);
  authTitle.textContent = login ? "Entre na sua conta" : "Cadastre-se para agendar";
  authText.textContent = login ? "Use o telefone e o e-mail de uma conta já salva neste navegador." : "O agendamento é liberado somente após um cadastro rápido.";
  authError.textContent = "";
  loginError.textContent = "";
  setTimeout(() => (login ? loginPhone : authName).focus(), 100);
}
function abrirCadastro(acao, modo = "cadastro") {
  acaoDepoisDoCadastro = acao;
  mostrarModoAuth(modo);
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
}
function fecharCadastro() {
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
}
function exigirCadastro(acao) {
  if (usuarioLogado()) return acao();
  mostrarNotificacao("Você precisa entrar ou criar uma conta para realizar o agendamento.");
  setTimeout(() => abrirCadastro(acao, "login"), 450);
}
function mensagem(texto, tipo = "bot") {
  const div = document.createElement("div");
  div.className = `message ${tipo}`;
  div.textContent = texto;
  mensagens.appendChild(div);
  mensagens.scrollTop = mensagens.scrollHeight;
}
function botoes(itens, acao) {
  opcoes.innerHTML = "";
  itens.forEach(item => {
    const botao = document.createElement("button");
    botao.className = "option";
    botao.textContent = item;
    botao.onclick = () => acao(item);
    opcoes.appendChild(botao);
  });
}
function inicio() {
  const usuario = usuarioLogado();
  if (!iniciado) {
    const nome = usuario?.nome ? `, ${usuario.nome.split(" ")[0]}` : "";
    mensagem(`${saudacaoPorHorario()}${nome}! 👋 Seja bem-vindo à BORBOBARBER. Sou o assistente virtual da barbearia. Como posso ajudar?`);
    iniciado = true;
  } else mensagem("Como posso ajudar agora?");
  botoes(["Agendar horário", "Ver funcionamento", "Ver serviços"], opcaoInicial);
}
function opcaoInicial(valor) {
  mensagem(valor, "user");
  if (valor === "Agendar horário") exigirCadastro(() => { mensagem("Perfeito! Escolha o serviço que deseja agendar:"); botoes(servicos, escolherServico); });
  else if (valor === "Ver funcionamento") { mensagem("Funcionamos de segunda a sexta, das 09:00 às 19:00, e aos sábados, das 09:00 às 17:00. Aos domingos estamos fechados."); botoes(["Agendar horário", "Voltar ao início"], v => v === "Voltar ao início" ? inicio() : opcaoInicial(v)); }
  else { mensagem("Temos Corte por R$ 35, Barba por R$ 25, Corte + Barba por R$ 55 e Sobrancelha por R$ 15."); botoes(["Agendar horário", "Voltar ao início"], v => v === "Voltar ao início" ? inicio() : opcaoInicial(v)); }
}
function escolherServico(valor) { if (!usuarioLogado()) return exigirCadastro(() => inicio()); servicoEscolhido = valor; mensagem(valor, "user"); mensagem("Ótima escolha! Agora selecione o dia do atendimento:"); botoes(Object.keys(agenda), escolherDia); }
function escolherDia(valor) { if (!usuarioLogado()) return exigirCadastro(() => inicio()); diaEscolhido = valor; mensagem(valor, "user"); mensagem(`Estes são os horários disponíveis para ${valor}:`); botoes(agenda[valor], escolherHorario); }
function escolherHorario(valor) {
  const usuario = usuarioLogado();
  if (!usuario) return exigirCadastro(() => inicio());
  mensagem(valor, "user");
  mensagem(`Agendamento confirmado para ${usuario?.nome || "cliente"}! ✅ Serviço: ${servicoEscolhido}. Dia: ${diaEscolhido}. Horário: ${valor}. A BORBOBARBER agradece a preferência!`);
  botoes(["Novo agendamento", "Voltar ao início", "Encerrar atendimento"], v => { mensagem(v, "user"); if (v === "Novo agendamento") { mensagem("Escolha o serviço:"); botoes(servicos, escolherServico); } else if (v === "Voltar ao início") inicio(); else { mensagem("Atendimento encerrado. Obrigado por escolher a BORBOBARBER! 💈 Até breve."); opcoes.innerHTML = ""; } });
}
function abrirChat() {
  exigirCadastro(() => {
    chat.classList.add("open");
    inicio();
  });
}
function abrirMinhaConta() {
  const usuario = usuarioLogado();
  if (!usuario) {
    mostrarNotificacao("Você não está conectado. Faça seu cadastro para acessar sua conta.");
    setTimeout(() => abrirCadastro(null, "login"), 450);
    return;
  }
  accountName.textContent = usuario.nome;
  accountPhone.textContent = formatarTelefone(usuario.telefone);
  accountEmail.textContent = usuario.email;
  accountModal.classList.add("open");
  accountModal.setAttribute("aria-hidden", "false");
}
function formatarTelefone(valor) {
  const v = normalizarTelefone(valor);
  if (v.length === 11) return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (v.length === 10) return v.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return valor;
}
function sairDaConta() {
  localStorage.removeItem("borboSessao");
  accountModal.classList.remove("open");
  chat.classList.remove("open");
  mensagens.innerHTML = "";
  opcoes.innerHTML = "";
  iniciado = false;
  servicoEscolhido = "";
  diaEscolhido = "";
  mostrarNotificacao("Você saiu da conta. Faça cadastro para agendar novamente.", "success");
}
function iniciarAgendamento() { exigirCadastro(() => { abrirChat(); mensagem("Vamos iniciar seu agendamento. Escolha o serviço:"); botoes(servicos, escolherServico); }); }
function abrirChatComServico(servico) {
  exigirCadastro(() => {
    chat.classList.add("open");
    if (!iniciado) { const usuario = usuarioLogado(); mensagem(`${saudacaoPorHorario()}, ${usuario?.nome?.split(" ")[0] || "cliente"}! 👋 Seja bem-vindo à BORBOBARBER.`); iniciado = true; }
    mensagem(`Quero agendar: ${servico}`, "user"); servicoEscolhido = servico; mensagem("Perfeito! Agora escolha o dia do atendimento:"); botoes(Object.keys(agenda), escolherDia);
  });
}
authPhone.addEventListener("input", () => {
  let v = normalizarTelefone(authPhone.value).slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, "($1) $2");
  authPhone.value = v;
});
authForm.addEventListener("submit", event => {
  event.preventDefault(); authError.textContent = "";
  const nome = authName.value.trim();
  const telefone = normalizarTelefone(authPhone.value);
  const email = authEmail.value.trim().toLowerCase();
  if (nome.length < 3) return authError.textContent = "Digite seu nome completo.";
  if (telefone.length < 10 || telefone.length > 11) return authError.textContent = "Digite um telefone válido com DDD.";
  const cadastros = cadastrosSalvos();
  if (cadastros.some(c => c.email === email)) return authError.textContent = "Este e-mail já está cadastrado. Use outro e-mail.";
  if (cadastros.some(c => c.telefone === telefone)) return authError.textContent = "Este telefone já está cadastrado. Use outro telefone.";
  const cadastro = { nome, telefone, email };
  cadastros.push(cadastro);
  localStorage.setItem("borboCadastros", JSON.stringify(cadastros));
  localStorage.setItem("borboSessao", JSON.stringify(cadastro));
  fecharCadastro(); authForm.reset(); mostrarNotificacao("Cadastro realizado com sucesso! Agendamento liberado.", "success");
  const acao = acaoDepoisDoCadastro; acaoDepoisDoCadastro = null; if (acao) setTimeout(acao, 300);
});

showRegister.addEventListener("click", () => mostrarModoAuth("cadastro"));
showLogin.addEventListener("click", () => mostrarModoAuth("login"));
function aplicarMascaraTelefone(input) {
  let v = normalizarTelefone(input.value).slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, "($1) $2");
  input.value = v;
}
loginPhone.addEventListener("input", () => aplicarMascaraTelefone(loginPhone));
loginForm.addEventListener("submit", event => {
  event.preventDefault();
  loginError.textContent = "";
  const telefone = normalizarTelefone(loginPhone.value);
  const email = loginEmail.value.trim().toLowerCase();
  const cadastro = cadastrosSalvos().find(c => c.telefone === telefone && c.email === email);
  if (!cadastro) { loginError.textContent = "Conta não encontrada. Confira o telefone e o e-mail ou crie um cadastro."; return; }
  localStorage.setItem("borboSessao", JSON.stringify(cadastro));
  fecharCadastro();
  loginForm.reset();
  mostrarNotificacao(`Bem-vindo de volta, ${cadastro.nome.split(" ")[0]}!`, "success");
  const acao = acaoDepoisDoCadastro; acaoDepoisDoCadastro = null; if (acao) setTimeout(acao, 300);
});

document.querySelector("#closeAuth").addEventListener("click", fecharCadastro);
authModal.addEventListener("click", event => { if (event.target === authModal) fecharCadastro(); });
document.querySelector("#chatToggle")?.addEventListener("click", abrirChat);
document.querySelector("#minhaConta")?.addEventListener("click", abrirMinhaConta);
document.querySelector("#closeAccount")?.addEventListener("click", () => { accountModal.classList.remove("open"); accountModal.setAttribute("aria-hidden", "true"); });
document.querySelector("#logoutBtn")?.addEventListener("click", sairDaConta);
accountModal?.addEventListener("click", event => { if (event.target === accountModal) { accountModal.classList.remove("open"); accountModal.setAttribute("aria-hidden", "true"); } });
document.querySelector("#closeChat")?.addEventListener("click", () => chat.classList.remove("open"));
["#agendarTopo", "#agendarHero", "#agendarFinal"].forEach(id => document.querySelector(id)?.addEventListener("click", iniciarAgendamento));
document.querySelectorAll(".service[data-service]").forEach(card => {
  const abrir = () => abrirChatComServico(card.dataset.service || "");
  card.querySelector(".service-btn")?.addEventListener("click", event => { event.stopPropagation(); abrir(); });
  card.addEventListener("click", abrir);
  card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") abrir(); });
});
