const agenda: Record<string, string[]> = {
    "Segunda-feira": ["09:00", "10:30", "14:00", "16:00", "18:00"],
    "Terça-feira": ["09:30", "11:00", "13:30", "15:00", "17:30"],
    "Quarta-feira": ["10:00", "12:00", "14:30", "16:30", "18:30"],
    "Quinta-feira": ["09:00", "11:30", "14:00", "17:00", "18:30"],
    "Sexta-feira": ["09:30", "11:00", "13:00", "15:30", "18:00"],
    "Sábado": ["09:00", "10:30", "12:00", "14:00", "16:00"]
};

const servicos = [
    "Corte — R$ 35",
    "Barba — R$ 25",
    "Corte + Barba — R$ 55",
    "Sobrancelha — R$ 15"
];

interface Usuario {
    nome: string;
    telefone: string;
    email: string;
}

const chat = document.querySelector("#chatBox") as HTMLElement;
const mensagens = document.querySelector("#chatMessages") as HTMLElement;
const opcoes = document.querySelector("#chatOptions") as HTMLElement;

const authModal = document.querySelector("#authModal") as HTMLElement;
const authForm = document.querySelector("#authForm") as HTMLFormElement;
const authName = document.querySelector("#authName") as HTMLInputElement;
const authPhone = document.querySelector("#authPhone") as HTMLInputElement;
const authEmail = document.querySelector("#authEmail") as HTMLInputElement;
const authError = document.querySelector("#authError") as HTMLElement;

const loginForm = document.querySelector("#loginForm") as HTMLFormElement;
const loginPhone = document.querySelector("#loginPhone") as HTMLInputElement;
const loginEmail = document.querySelector("#loginEmail") as HTMLInputElement;
const loginError = document.querySelector("#loginError") as HTMLElement;

const showRegister = document.querySelector("#showRegister") as HTMLElement;
const showLogin = document.querySelector("#showLogin") as HTMLElement;

const authTitle = document.querySelector("#authTitle") as HTMLElement;
const authText = document.querySelector("#authText") as HTMLElement;

const siteNotification = document.querySelector("#siteNotification") as HTMLElement;

const accountModal = document.querySelector("#accountModal") as HTMLElement;
const accountName = document.querySelector("#accountName") as HTMLElement;
const accountPhone = document.querySelector("#accountPhone") as HTMLElement;
const accountEmail = document.querySelector("#accountEmail") as HTMLElement;

let servicoEscolhido = "";
let diaEscolhido = "";
let horarioEscolhido = "";
let iniciado = false;

let acaoDepoisDoCadastro: (() => void) | null = null;

let notificationTimer: ReturnType<typeof setTimeout>;

function saudacaoPorHorario(): string {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) {
        return "Bom dia";
    }

    if (hora >= 12 && hora < 18) {
        return "Boa tarde";
    }

    return "Boa noite";
}

function mostrarNotificacao(
    texto: string,
    tipo: string = "error"
): void {
    clearTimeout(notificationTimer);

    siteNotification.textContent = texto;
    siteNotification.className = `site-notification ${tipo} show`;

    notificationTimer = setTimeout(() => {
        siteNotification.classList.remove("show");
    }, 3200);
}

function usuarioLogado(): Usuario | null {
    try {
        return JSON.parse(
            localStorage.getItem("borboSessao") || "null"
        );
    } catch {
        return null;
    }
}

function cadastrosSalvos(): Usuario[] {
    try {
        const dados = JSON.parse(
            localStorage.getItem("borboCadastros") || "[]"
        );

        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function normalizarTelefone(valor: string): string {
    return valor.replace(/\D/g, "");
}

function mostrarModoAuth(
    modo: "cadastro" | "login" = "cadastro"
): void {
    const login = modo === "login";

    authForm.hidden = login;
    loginForm.hidden = !login;

    showRegister.classList.toggle("active", !login);
    showLogin.classList.toggle("active", login);

    authTitle.textContent = login
        ? "Entre na sua conta"
        : "Cadastre-se para agendar";

    authText.textContent = login
        ? "Use o telefone e o e-mail de uma conta já salva neste navegador."
        : "O agendamento é liberado somente após um cadastro rápido.";

    authError.textContent = "";
    loginError.textContent = "";

    setTimeout(() => {
        if (login) {
            loginPhone.focus();
        } else {
            authName.focus();
        }
    }, 100);
}

function abrirCadastro(
    acao: (() => void) | null,
    modo: "cadastro" | "login" = "cadastro"
): void {
    acaoDepoisDoCadastro = acao;

    mostrarModoAuth(modo);

    authModal.classList.add("open");
    authModal.setAttribute("aria-hidden", "false");
}

function fecharCadastro(): void {
    authModal.classList.remove("open");
    authModal.setAttribute("aria-hidden", "true");
}

function exigirCadastro(acao: () => void): void {
    if (usuarioLogado()) {
        acao();
        return;
    }

    mostrarNotificacao(
        "Você precisa entrar ou criar uma conta para realizar o agendamento."
    );

    setTimeout(() => {
        abrirCadastro(acao, "login");
    }, 450);
}

function mensagem(
    texto: string,
    tipo: "bot" | "user" = "bot"
): void {
    const div = document.createElement("div");

    div.className = `message ${tipo}`;
    div.textContent = texto;

    mensagens.appendChild(div);
    mensagens.scrollTop = mensagens.scrollHeight;
}

function botoes(
    itens: string[],
    acao: (item: string) => void
): void {
    opcoes.innerHTML = "";

    itens.forEach((item) => {
        const botao = document.createElement("button");

        botao.className = "option";
        botao.textContent = item;

        botao.onclick = () => {
            acao(item);
        };

        opcoes.appendChild(botao);
    });
}

/* =========================================
   NOVO: LIMPAR COMPLETAMENTE O CHAT
========================================= */

function limparChat(): void {
    mensagens.innerHTML = "";
    opcoes.innerHTML = "";

    servicoEscolhido = "";
    diaEscolhido = "";
    horarioEscolhido = "";

    iniciado = false;
}

/* =========================================
   NOVO: FECHAR E APAGAR A CONVERSA
========================================= */

function fecharChat(): void {
    chat.classList.remove("open");

    limparChat();
}

/* =========================================
   INÍCIO DO CHAT
========================================= */

function inicio(): void {
    const usuario = usuarioLogado();

    if (!iniciado) {
        const nome = usuario?.nome
            ? `, ${usuario.nome.split(" ")[0]}`
            : "";

        mensagem(
            `${saudacaoPorHorario()}${nome}! 👋 Seja bem-vindo à BORBOBARBER. Sou o assistente virtual da barbearia. Como posso ajudar?`
        );

        iniciado = true;
    }

    botoes(
        [
            "Agendar horário",
            "Ver funcionamento",
            "Ver serviços"
        ],
        opcaoInicial
    );
}

function opcaoInicial(valor: string): void {
    mensagem(valor, "user");

    if (valor === "Agendar horário") {
        exigirCadastro(() => {
            mensagem(
                "Perfeito! Escolha o serviço que deseja agendar:"
            );

            botoes(servicos, escolherServico);
        });

        return;
    }

    if (valor === "Ver funcionamento") {
        mensagem(
            "Funcionamos de segunda a sexta, das 09:00 às 19:00, e aos sábados, das 09:00 às 17:00. Aos domingos estamos fechados."
        );

        botoes(
            ["Agendar horário", "Voltar ao início"],
            (valor) => {
                if (valor === "Voltar ao início") {
                    inicio();
                } else {
                    opcaoInicial(valor);
                }
            }
        );

        return;
    }

    mensagem(
        "Temos Corte por R$ 35, Barba por R$ 25, Corte + Barba por R$ 55 e Sobrancelha por R$ 15."
    );

    botoes(
        ["Agendar horário", "Voltar ao início"],
        (valor) => {
            if (valor === "Voltar ao início") {
                inicio();
            } else {
                opcaoInicial(valor);
            }
        }
    );
}

function escolherServico(valor: string): void {
    if (!usuarioLogado()) {
        exigirCadastro(() => inicio());
        return;
    }

    servicoEscolhido = valor;

    mensagem(valor, "user");

    mensagem(
        "Ótima escolha! Agora selecione o dia do atendimento:"
    );

    botoes(
        Object.keys(agenda),
        escolherDia
    );
}

function escolherDia(valor: string): void {
    if (!usuarioLogado()) {
        exigirCadastro(() => inicio());
        return;
    }

    diaEscolhido = valor;

    mensagem(valor, "user");

    mensagem(
        `Estes são os horários disponíveis para ${valor}:`
    );

    botoes(
        agenda[valor],
        escolherHorario
    );
}

function escolherHorario(valor: string): void {
    const usuario = usuarioLogado();

    if (!usuario) {
        exigirCadastro(() => inicio());
        return;
    }

    horarioEscolhido = valor;

    mensagem(valor, "user");

    mensagem(
        `Agendamento confirmado para ${usuario.nome}! ✅ Serviço: ${servicoEscolhido}. Dia: ${diaEscolhido}. Horário: ${horarioEscolhido}. A BORBOBARBER agradece a preferência!`
    );

    botoes(
        [
            "Novo agendamento",
            "Voltar ao início",
            "Encerrar atendimento"
        ],
        (valor) => {
            mensagem(valor, "user");

            if (valor === "Novo agendamento") {
                servicoEscolhido = "";
                diaEscolhido = "";
                horarioEscolhido = "";

                mensagem("Escolha o serviço:");

                botoes(
                    servicos,
                    escolherServico
                );

                return;
            }

            if (valor === "Voltar ao início") {
                inicio();
                return;
            }

            mensagem(
                "Atendimento encerrado. Obrigado por escolher a BORBOBARBER! 💈 Até breve."
            );

            opcoes.innerHTML = "";
        }
    );
}

/* =========================================
   ABRIR CHAT
========================================= */

function abrirChat(): void {
    exigirCadastro(() => {
        chat.classList.add("open");

        if (!iniciado) {
            inicio();
        }
    });
}

function abrirMinhaConta(): void {
    const usuario = usuarioLogado();

    if (!usuario) {
        mostrarNotificacao(
            "Você não está conectado. Faça seu cadastro para acessar sua conta."
        );

        setTimeout(() => {
            abrirCadastro(null, "login");
        }, 450);

        return;
    }

    accountName.textContent = usuario.nome;
    accountPhone.textContent = formatarTelefone(usuario.telefone);
    accountEmail.textContent = usuario.email;

    accountModal.classList.add("open");
    accountModal.setAttribute(
        "aria-hidden",
        "false"
    );
}

function formatarTelefone(valor: string): string {
    const v = normalizarTelefone(valor);

    if (v.length === 11) {
        return v.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );
    }

    if (v.length === 10) {
        return v.replace(
            /(\d{2})(\d{4})(\d{4})/,
            "($1) $2-$3"
        );
    }

    return valor;
}

function sairDaConta(): void {
    localStorage.removeItem("borboSessao");

    accountModal.classList.remove("open");
    accountModal.setAttribute(
        "aria-hidden",
        "true"
    );

    chat.classList.remove("open");

    limparChat();

    mostrarNotificacao(
        "Você saiu da conta. Faça cadastro para agendar novamente.",
        "success"
    );
}

function iniciarAgendamento(): void {
    exigirCadastro(() => {
        chat.classList.add("open");

        /* Evita acumular conversa antiga */
        limparChat();

        const usuario = usuarioLogado();

        const nome = usuario?.nome
            ? `, ${usuario.nome.split(" ")[0]}`
            : "";

        mensagem(
            `${saudacaoPorHorario()}${nome}! Vamos realizar seu agendamento.`
        );

        iniciado = true;

        mensagem(
            "Escolha o serviço que deseja:"
        );

        botoes(
            servicos,
            escolherServico
        );
    });
}

function abrirChatComServico(
    servico: string
): void {
    exigirCadastro(() => {
        chat.classList.add("open");

        /* Nova conversa ao agendar pelo card */
        limparChat();

        const usuario = usuarioLogado();

        mensagem(
            `${saudacaoPorHorario()}, ${usuario?.nome?.split(" ")[0] || "cliente"}! 👋 Seja bem-vindo à BORBOBARBER.`
        );

        iniciado = true;

        mensagem(
            `Quero agendar: ${servico}`,
            "user"
        );

        servicoEscolhido = servico;

        mensagem(
            "Perfeito! Agora escolha o dia do atendimento:"
        );

        botoes(
            Object.keys(agenda),
            escolherDia
        );
    });
}

/* =========================================
   CADASTRO
========================================= */

authPhone.addEventListener(
    "input",
    () => {
        aplicarMascaraTelefone(authPhone);
    }
);

authForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        authError.textContent = "";

        const nome =
            authName.value.trim();

        const telefone =
            normalizarTelefone(
                authPhone.value
            );

        const email =
            authEmail.value
                .trim()
                .toLowerCase();

        if (nome.length < 3) {
            authError.textContent =
                "Digite seu nome completo.";

            return;
        }

        if (
            telefone.length < 10 ||
            telefone.length > 11
        ) {
            authError.textContent =
                "Digite um telefone válido com DDD.";

            return;
        }

        const cadastros =
            cadastrosSalvos();

        if (
            cadastros.some(
                (cadastro) =>
                    cadastro.email === email
            )
        ) {
            authError.textContent =
                "Este e-mail já está cadastrado. Entre na sua conta.";

            return;
        }

        if (
            cadastros.some(
                (cadastro) =>
                    cadastro.telefone === telefone
            )
        ) {
            authError.textContent =
                "Este telefone já está cadastrado. Entre na sua conta.";

            return;
        }

        const cadastro: Usuario = {
            nome,
            telefone,
            email
        };

        cadastros.push(cadastro);

        localStorage.setItem(
            "borboCadastros",
            JSON.stringify(cadastros)
        );

        localStorage.setItem(
            "borboSessao",
            JSON.stringify(cadastro)
        );

        fecharCadastro();

        authForm.reset();

        mostrarNotificacao(
            "Cadastro realizado com sucesso! Agendamento liberado.",
            "success"
        );

        const acao =
            acaoDepoisDoCadastro;

        acaoDepoisDoCadastro = null;

        if (acao) {
            setTimeout(
                acao,
                300
            );
        }
    }
);

/* =========================================
   TROCAR CADASTRO / LOGIN
========================================= */

showRegister.addEventListener(
    "click",
    () => mostrarModoAuth("cadastro")
);

showLogin.addEventListener(
    "click",
    () => mostrarModoAuth("login")
);

function aplicarMascaraTelefone(
    input: HTMLInputElement
): void {
    let v = normalizarTelefone(
        input.value
    ).slice(0, 11);

    if (v.length > 10) {
        v = v.replace(
            /(\d{2})(\d{5})(\d{0,4})/,
            "($1) $2-$3"
        );
    } else if (v.length > 6) {
        v = v.replace(
            /(\d{2})(\d{4})(\d{0,4})/,
            "($1) $2-$3"
        );
    } else if (v.length > 2) {
        v = v.replace(
            /(\d{2})(\d+)/,
            "($1) $2"
        );
    }

    input.value = v;
}

/* =========================================
   LOGIN
========================================= */

loginPhone.addEventListener(
    "input",
    () => aplicarMascaraTelefone(loginPhone)
);

loginForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        loginError.textContent = "";

        const telefone =
            normalizarTelefone(
                loginPhone.value
            );

        const email =
            loginEmail.value
                .trim()
                .toLowerCase();

        const cadastro =
            cadastrosSalvos().find(
                (cadastro) =>
                    cadastro.telefone === telefone &&
                    cadastro.email === email
            );

        if (!cadastro) {
            loginError.textContent =
                "Conta não encontrada. Confira o telefone e o e-mail ou crie um cadastro.";

            return;
        }

        localStorage.setItem(
            "borboSessao",
            JSON.stringify(cadastro)
        );

        fecharCadastro();

        loginForm.reset();

        mostrarNotificacao(
            `Bem-vindo de volta, ${cadastro.nome.split(" ")[0]}!`,
            "success"
        );

        const acao =
            acaoDepoisDoCadastro;

        acaoDepoisDoCadastro = null;

        if (acao) {
            setTimeout(
                acao,
                300
            );
        }
    }
);

/* =========================================
   EVENTOS
========================================= */

document
    .querySelector("#closeAuth")
    ?.addEventListener(
        "click",
        fecharCadastro
    );

authModal.addEventListener(
    "click",
    (event) => {
        if (event.target === authModal) {
            fecharCadastro();
        }
    }
);

document
    .querySelector("#chatToggle")
    ?.addEventListener(
        "click",
        abrirChat
    );

document
    .querySelector("#minhaConta")
    ?.addEventListener(
        "click",
        abrirMinhaConta
    );

document
    .querySelector("#closeAccount")
    ?.addEventListener(
        "click",
        () => {
            accountModal.classList.remove(
                "open"
            );

            accountModal.setAttribute(
                "aria-hidden",
                "true"
            );
        }
    );

document
    .querySelector("#logoutBtn")
    ?.addEventListener(
        "click",
        sairDaConta
    );

accountModal?.addEventListener(
    "click",
    (event) => {
        if (
            event.target ===
            accountModal
        ) {
            accountModal.classList.remove(
                "open"
            );

            accountModal.setAttribute(
                "aria-hidden",
                "true"
            );
        }
    }
);

/* =========================================
   PRINCIPAL ALTERAÇÃO

   Ao clicar no X:
   1. fecha o chat
   2. apaga mensagens
   3. apaga opções
   4. esquece serviço
   5. esquece dia
   6. esquece horário
   7. próxima abertura começa do zero
========================================= */

document
    .querySelector("#closeChat")
    ?.addEventListener(
        "click",
        fecharChat
    );

/* BOTÕES DE AGENDAMENTO */

[
    "#agendarTopo",
    "#agendarHero",
    "#agendarFinal"
].forEach((id) => {
    document
        .querySelector(id)
        ?.addEventListener(
            "click",
            iniciarAgendamento
        );
});

/* SERVIÇOS */

document
    .querySelectorAll<HTMLElement>(
        ".service[data-service]"
    )
    .forEach((card) => {
        const abrir = () => {
            abrirChatComServico(
                card.dataset.service || ""
            );
        };

        card
            .querySelector(".service-btn")
            ?.addEventListener(
                "click",
                (event) => {
                    event.stopPropagation();
                    abrir();
                }
            );

        card.addEventListener(
            "click",
            abrir
        );

        card.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    abrir();
                }
            }
        );
    });