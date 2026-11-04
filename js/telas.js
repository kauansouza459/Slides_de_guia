/* ==========================================================
   telas.js · conteúdo das 8 telas (Tabela 3 do roteiro · Curso 2)
   Cada tela: bloco (cor), min (duração), intervalo, pagina do
   Micro-Roteiro, notas do instrutor (tecla N) e render().
   Regras de projeção: <= 12 linhas de código · texto >= 1.35rem
   ========================================================== */
const TELAS = [
  /* ---------------- TELA 1 · ACOLHIDA ---------------- */
  {
    rotulo: "ACOLHIDA", titulo: "Acolhida", bloco: 0, min: 10, intervalo: "00–10 min", pagina: 1,
    notas: ["Receba a turma com esta tela já projetada.", "Peça para apontarem a câmera do celular para o QR: é o resultado que vão construir.",
            "Combine o sinal de ajuda: cartão verde = terminei, cartão vermelho = estou travado."],
    render: () => h("div", { class: "row align-items-center g-5" },
      h("div", { class: "col-12 col-lg-7" },
        h("h1", { class: "display-3 resumo" }, "Painel Verde de Garopaba ", destaque("no ar em 120 minutos")),
        h("p", { class: "lead-telao" }, "Coleta seletiva & ecopontos · SNCT 2026 · IFSC Câmpus Garopaba"),
        cartao("meta", "🎯 Meta de hoje", "Você sai daqui com o ", forte("seu Painel Verde publicado na internet"), " e abrindo no celular por QR Code."),
        passo(h("ul", { class: "fichas" },
          h("li", null, h("strong", null, "4"), " blocos práticos"),
          h("li", null, h("strong", null, "0"), " instalações"),
          h("li", null, h("strong", null, "1"), " site seu, no ar"))),
        passo(h("div", { class: "semaforo" },
          h("span", { class: "luz verde" }, "🟩 Terminei, quero conferir"),
          h("span", { class: "luz vermelha" }, "🟥 Estou com problema")))),
      h("div", { class: "col-12 col-lg-5 text-center" },
        passo(h("div", { class: "moldura-qr" },
          caixaQr(CONFIG.painelDemo, 230, false),
          h("p", { class: "legenda" }, "📱 Aponte a câmera: este é o painel ", forte("pronto")),
          h("p", { class: "link-curto" }, CONFIG.painelDemo.replace("https://", "")))),
        passo(imagem("to-no-ifsc.gif", "gif-ifsc gif-canto"))))
  },

  /* ---------------- TELA 2 · MOODLE ---------------- */
  {
    rotulo: "SALA NO MOODLE", titulo: "Sala no Moodle", bloco: 0, min: 5, intervalo: "10–15 min", pagina: 1,
    notas: ["Mostre o caminho na tela do professor e espere todos entrarem.", "A chave SNCT2026 copia com um clique.",
            "Quem não achou o PDF: ele está na Seção 0 (Geral)."],
    render: () => [
      h("h2", { class: "display-5 resumo" }, "Entre na ", destaque("sala do Curso 2"), " no Moodle IFSC"),
      h("div", { class: "row g-5 align-items-center" },
        h("div", { class: "col-12 col-lg-7" }, listaPassos([
          ["Acesse ", forte("moodle.ifsc.edu.br"), " e abra ", forte("SNCT 2026 — Oficina: Painel Verde Garopaba")],
          ["Chave de inscrição: ", chipCopiar("SNCT2026")],
          ["Na ", forte("Seção 0"), ": abra o ", forte("Micro-Roteiro (PDF)")],
          ["Na ", forte("Seção 1"), ": baixe ", arq("starter-kit-painel-verde.zip")]
        ])),
        h("div", { class: "col-12 col-lg-5 text-center" },
          passo(h("div", null, caixaQr(CONFIG.moodle, 200, true), h("p", { class: "legenda" }, "📱 QR da sala no Moodle")))))
    ]
  },

  /* ---------------- TELA 3 · BLOCO 1 ---------------- */
  {
    rotulo: "BLOCO 1", titulo: "Bloco 1 · Título e cores", bloco: 1, min: 20, intervalo: "15–35 min", pagina: 1,
    notas: ["Mostre a pasta extraída antes de abrir o index.html.", "Use o seletor de cor da tela para decidir o tom, depois cada um edita o seu arquivo.",
            "Checkpoint: todos apertam F5 e enxergam o próprio título."],
    render: () => {
      const hex = "#15803d";
      const css = (cor) => `:root {\n  --verde-principal: ${cor};\n  --fundo-pagina: #f0fdf4;\n  --fundo-cartao: #ffffff;\n  --texto-escuro: #1e293b;\n}`;
      const bloco = blocoCodigo("css/estilo.css", css(hex));
      const previa = h("div", { class: "previa-painel", style: `--cor:${hex}` }, h("span", null, "Onde Descartar em Garopaba?"));
      const seletor = h("input", { type: "color", value: hex, "aria-label": "Escolher a cor principal" });
      seletor.addEventListener("input", () => {
        bloco.codigo.textContent = css(seletor.value);
        previa.style.setProperty("--cor", seletor.value);
      });
      return [
        h("h2", { class: "display-6 resumo" }, "Baixe o kit e personalize ", destaque("título e cores")),
        h("div", { class: "row g-4" },
          h("div", { class: "col-12 col-lg-5" },
            listaPassos([
              ["Extraia ", arq("starter-kit-painel-verde.zip")],
              ["Abra ", arq("index.html"), " com duplo clique"],
              ["Edite o título no ", arq("index.html")],
              ["Troque a cor no ", arq("css/estilo.css")]
            ], "compacto"),
            passo(h("pre", { class: "arvore", "aria-label": "Estrutura de pastas" }, "starter-kit-painel-verde/\n├─ index.html\n├─ css/estilo.css\n├─ js/app.js\n└─ README.md"))),
          h("div", { class: "col-12 col-lg-7" },
            blocoCodigo("index.html", `<!-- BLOCO 1: Personalize o título e o subtítulo ambiental da sua comunidade -->\n<span class="selo-ambiental">SNCT 2026 · Garopaba Sustentavel</span>\n<h1>Onde Descartar em Garopaba?</h1>`, "pequeno"),
            bloco,
            passo(h("div", { class: "seletor-cor" }, h("label", null, "🎨 Teste uma cor: "), seletor, previa)))),
        checkpoint("Salve, aperte ", tecla("F5"), " no navegador e veja ", forte("o seu título e a sua cor"), ".")
      ];
    }
  },

  /* ---------------- TELA 4 · BLOCO 2A ---------------- */
  {
    rotulo: "BLOCO 2A", titulo: "Bloco 2A · Novo ecoponto", bloco: 2, min: 20, intervalo: "35–55 min", pagina: 2,
    notas: ["Digite junto com a turma, narrando cada linha em voz alta.", "Clique em “Esqueça a vírgula” para mostrar o erro mais comum antes de ele acontecer.",
            "Lembre: a categoria precisa ser igual ao texto de um botão."],
    render: () => {
      const linha1 = "  },   // <- coloque a vírgula aqui";
      const corpo = (ok) => `${ok ? linha1 : "  }    // <- sem vírgula!"}\n  {\n    nome: "Meu Ecoponto",\n    bairro: "Meu Bairro",\n    categoria: "Oleo",\n    horario: "Sabados, 09h as 13h",\n    mapaUrl: "https://maps.google.com/?q=Garopaba"\n  }\n];`;
      const bloco = blocoCodigo("js/app.js", corpo(true));
      const erro = passo(h("div", { class: "cartao alerta" }, h("span", { class: "rotulo" }, "⚠️ Erro nº 1 dos iniciantes"),
        h("span", { class: "msg-erro" }, "Esqueceu a ", forte("vírgula"), " depois do ", arq("}"), " anterior? A lista inteira para de funcionar.")));
      let ok = true;
      const botao = h("button", { type: "button", class: "btn btn-outline-warning btn-lg" }, "💥 Esqueça a vírgula");
      botao.addEventListener("click", () => {
        ok = !ok;
        bloco.codigo.textContent = corpo(ok);
        erro.classList.toggle("estourou", !ok);
        erro.querySelector(".msg-erro").replaceChildren(...(ok
          ? ["Esqueceu a ", forte("vírgula"), " depois do ", arq("}"), " anterior? A lista inteira para de funcionar."]
          : [arq("SyntaxError: Unexpected token '{'"), " → a lista inteira parou. Volte e coloque a vírgula!"]));
        botao.textContent = ok ? "💥 Esqueça a vírgula" : "🩹 Corrigir";
      });
      return [
        h("h2", { class: "display-6 resumo" }, "Cadastre um ", destaque("novo ecoponto"), " no array"),
        h("p", { class: "lead-telao mb-1" }, "Em ", arq("js/app.js"), " · lista ", arq("LOCAIS_COLETA"), " · ", forte("no final"), ", antes do ", arq("];")),
        h("div", { class: "row g-4" },
          h("div", { class: "col-12 col-lg-7" }, bloco),
          h("div", { class: "col-12 col-lg-5" }, erro, passo(h("div", { class: "text-center mt-2" }, botao)),
            cartao("", "🏷️ Categoria igual ao botão",
              h("div", { class: "etiquetas" }, CATEGORIAS.slice(1).map(([c]) => h("span", null, icone(c.toLowerCase(), 26), c)))))),
        checkpoint("Salve, aperte ", tecla("F5"), " e o ", forte("seu ecoponto"), " aparece em um novo cartão.")
      ];
    }
  },

  /* ---------------- TELA 5 · BLOCO 2B ---------------- */
  {
    rotulo: "BLOCO 2B", titulo: "Bloco 2B · Filtros e mapa", bloco: 2, min: 15, intervalo: "55–70 min", pagina: 2,
    notas: ["Deixe a turma clicar no simulador antes de explicar o .filter().", "Peça que cada um abra o link do Google Maps do próprio ecoponto.",
            "Se o filtro “Oleo” ficar vazio, é porque ainda não há item dessa categoria: volte à Tela 4."],
    render: () => [
      h("h2", { class: "display-6 resumo" }, "Teste os ", destaque("filtros"), " e o link do ", destaque("Google Maps")),
      h("div", { class: "row g-4" },
        h("div", { class: "col-12 col-lg-6" },
          blocoCodigo("index.html · cada botão", `<button class="btn-filtro"\n  onclick="filtrarEcopontos('Vidro')">Vidro</button>`, "pequeno"),
          blocoCodigo("js/app.js · o filtro", `const filtrados = categoriaEscolhida === "Todos"\n  ? LOCAIS_COLETA\n  : LOCAIS_COLETA.filter(item =>\n      item.categoria === categoriaEscolhida);`, "pequeno"),
          passo(h("p", { class: "dica" }, "💡 ", arq(".filter()"), " guarda ", forte("só"), " os locais cuja categoria é igual ao botão."))),
        h("div", { class: "col-12 col-lg-6" }, simuladorFiltro())),
      listaPassos([["Clique em ", forte("cada botão")], ["Veja ", forte("só aquele tipo")], ["Abra o link do ", forte("Google Maps")]], "horizontal"),
      checkpoint("Todos os filtros respondem e o mapa abre no local certo.")
    ]
  },

  /* ---------------- TELA 6 · BLOCO 3 ---------------- */
  {
    rotulo: "BLOCO 3", titulo: "Bloco 3 · GitHub Pages", bloco: 3, min: 25, intervalo: "70–95 min", pagina: 3,
    notas: ["Momento de mais dúvidas: circule pela sala e use os cartões de ajuda.", "Se aparecer 404, quase sempre o index.html está dentro de uma pasta.",
            "O Pages leva cerca de 1 minuto: aproveite para pausar e perguntar quem já terminou."],
    render: () => [
      h("h2", { class: "display-6 resumo" }, "Suba no ", destaque("GitHub"), " e ative o ", destaque("Pages")),
      h("div", { class: "row g-4" },
        h("div", { class: "col-12 col-lg-8" }, listaPassos([
          [forte("github.com"), " → ", forte("New repository"), " → nome ", arq("painel-verde"), " · ", forte("Public")],
          [forte("uploading an existing file"), " → arraste ", arq("index.html"), ", ", arq("css/"), " e ", arq("js/"), " → ", forte("Commit changes")],
          [forte("Settings → Pages"), " → Branch ", arq("main"), " / ", arq("/(root)"), " → ", forte("Save")],
          ["Aguarde ~1 min e abra ", arq("https://SEU-USUARIO.github.io/painel-verde/")]
        ], "compacto")),
        h("div", { class: "col-12 col-lg-4" }, cartao("alerta", "⚠️ Se aparecer erro 404", arq("index.html"), " precisa estar na ", forte("raiz"), " do repositório, não dentro de uma pasta."),
          passo(imagem("ilustracao-painel.svg", "ilustracao", "Lixeiras de coleta seletiva em frente ao mar de Garopaba")))),
      passo(h("div", { class: "fluxo", "aria-label": "Caminho: pasta, GitHub, Pages, endereço" },
        ["💻 Pasta do kit", "🐙 Repositório", "⚙️ Pages ligado", "🌐 .github.io", "📱 QR Code"].map((t, i) => [i > 0 && h("span", { class: "seta" }, "→"), h("span", { class: "etapa" }, t)]))),
      checkpoint("Seu painel abre no endereço ", forte(".github.io"), ", não pelo arquivo do computador.")
    ]
  },

  /* ---------------- TELA 7 · BLOCO 4 ---------------- */
  {
    rotulo: "BLOCO 4", titulo: "Bloco 4 · QR Code e Mural", bloco: 4, min: 15, intervalo: "95–110 min", pagina: 4,
    notas: ["Cada aluno cola a própria URL .github.io no gerador.", "Peça que testem o QR no celular do colega ao lado.",
            "O Mural do Curso 2 fica na Seção 4 do Moodle."],
    render: () => [
      h("h2", { class: "display-6 resumo" }, "Gere o ", destaque("QR Code"), " do seu Painel e poste no Mural"),
      h("div", { class: "row g-4 align-items-center" },
        h("div", { class: "col-12 col-lg-7" }, listaPassos([
          ["Cole a ", forte("URL .github.io"), " do seu painel no gerador"],
          ["Clique em ", forte("Baixar PNG")],
          ["No Moodle, abra o ", forte("Mural do Curso 2"), " e poste ", forte("QR + link")],
          ["Teste no ", forte("celular de um colega"), " 📱"]
        ], "compacto")),
        h("div", { class: "col-12 col-lg-5" }, geradorQr())),
      checkpoint("O Painel Verde abre no ", forte("celular de outra pessoa"), " pelo QR Code.")
    ]
  },

  /* ---------------- TELA 8 · ENCERRAMENTO ---------------- */
  {
    rotulo: "ENCERRAMENTO", titulo: "Encerramento e pesquisa", bloco: 0, min: 10, intervalo: "110–120 min", pagina: 4,
    notas: ["Agradeça e peça para escanearem o QR da pesquisa de satisfação.", "Marque as conquistas com a turma: cada clique é uma vitória.",
            "Se o QR não aparece, falta o link da Frente 4: use ?pesquisa=LINK na URL."],
    render: () => {
      const total = 3;
      const lista = h("ul", { class: "conquistas" });
      ["Personalizou o Painel Verde", "Cadastrou um ecoponto de Garopaba", "Publicou na internet e gerou o QR Code"].forEach(t => {
        const li = h("li", { tabindex: "0", role: "checkbox", "aria-checked": "false" }, h("span", { class: "caixa" }, "☐"), " " + t);
        const alternar = () => {
          const marcado = li.classList.toggle("feito");
          li.setAttribute("aria-checked", String(marcado));
          li.firstChild.textContent = marcado ? "✅" : "☐";
          if (marcado) mostrarSticker();
          if (lista.querySelectorAll(".feito").length === total) lancarConfete();
        };
        li.addEventListener("click", alternar);
        li.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); alternar(); } });
        lista.append(li);
      });
      const caixa = h("div", { class: "qr-caixa" });
      const temQr = criarQr(caixa, CONFIG.pesquisa, 230);
      return h("div", { class: "row align-items-center g-5" },
        h("div", { class: "col-12 col-lg-7" },
          h("h2", { class: "display-4 resumo" }, "Missão cumprida! ", destaque("Conte como foi.")),
          h("p", { class: "lead-telao" }, "Responda a ", forte("pesquisa de satisfação"), " (2 minutos). Ela também está na ", forte("Seção 4"), " da sala do Curso 2."),
          passo(lista),
          cartao("", "🌱 Para Garopaba", "Você publicou algo útil. Compartilhe o link com a sua comunidade!")),
        h("div", { class: "col-12 col-lg-5 text-center" },
          passo(h("div", { class: "moldura-qr" }, caixa, h("p", { class: "legenda" }, "📱 QR da pesquisa de satisfação"),
            !temQr && h("div", { class: "aviso-config" }, "⚠️ Falta o link da pesquisa (Frente 4). Defina ", h("code", null, "CONFIG.pesquisa"), " em ", h("code", null, "js/config.js"), " ou abra com ", h("code", null, "?pesquisa=LINK"), "."))),
          passo(imagem("fiz-ifsc.gif", "gif-ifsc gif-medio fundo-claro"))));
    }
  }
];

/* chave copiável (Tela 2) */
function chipCopiar(texto) {
  const b = h("button", { type: "button", class: "copiar-chip", title: "Copiar chave" }, texto + " ", h("span", { "aria-hidden": "true" }, "⧉"));
  const original = b.firstChild.textContent;
  b.addEventListener("click", () => copiarTexto(texto, b, original));
  return b;
}
