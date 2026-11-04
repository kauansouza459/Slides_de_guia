/* ==========================================================
   componentes.js · QR Code, gerador, simulador, sticker, confete
   ========================================================== */

/* ---------- QR Code (biblioteca qrcodejs) ---------- */
function criarQr(el, url, tamanho) {
  el.replaceChildren();
  if (!url || typeof QRCode === "undefined") {
    el.append(h("div", { class: "qr-placeholder" }, h("b", null, "▦"), "QR aparece aqui", h("small", null, "(falta o link ou a internet)")));
    return false;
  }
  new QRCode(el, { text: url, width: tamanho, height: tamanho, correctLevel: QRCode.CorrectLevel.M });
  return true;
}
function caixaQr(url, tamanho, pequeno) {
  const caixa = h("div", { class: "qr-caixa" + (pequeno ? " pequeno" : "") });
  criarQr(caixa, url, tamanho);
  return caixa;
}

/* ---------- Tela 7: gerador de QR Code ao vivo ---------- */
function geradorQr() {
  const entrada = h("input", { id: "urlQr", type: "url", inputmode: "url", autocomplete: "off", spellcheck: "false",
    value: "https://SEU-USUARIO.github.io/painel-verde/", "aria-label": "URL do seu painel" });
  const caixa = h("div", { class: "qr-caixa" });
  const baixar = h("a", { class: "btn-baixar", download: "qr-painel-verde.png", href: "#" }, "⬇ Baixar PNG");
  function atualizar() {
    const url = entrada.value.trim();
    if (!/^https?:\/\//i.test(url)) { criarQr(caixa, "", 230); baixar.removeAttribute("href"); return; }
    criarQr(caixa, url, 230);
    setTimeout(() => { const c = caixa.querySelector("canvas"); if (c) baixar.href = c.toDataURL("image/png"); }, 60);
  }
  entrada.addEventListener("input", atualizar);
  atualizar();
  return passo(h("div", { class: "cartao gerador" },
    h("label", { for: "urlQr", class: "rotulo" }, "Gerador de QR Code"), entrada, caixa, h("div", null, baixar),
    h("p", { class: "mini-nota" }, "Roda no seu navegador: nenhum dado é enviado.")));
}

/* ---------- Tela 5: simulador do filtro (dados iguais ao Starter Kit) ---------- */
const LOCAIS_SIM = [
  { nome: "Ecoponto Central — Secretaria de Meio Ambiente", bairro: "Centro", categoria: "Eletronicos", horario: "Seg a Sex, 08h às 17h" },
  { nome: "Ponto Verde IFSC Campus Garopaba", bairro: "Campo D'Una", categoria: "Reciclaveis", horario: "Seg a Sex, 08h às 22h" },
  { nome: "Coleta de Vidro e Óleo — Associação Comunitária", bairro: "Ferrugem", categoria: "Vidro", horario: "Sábados, 09h às 13h" }
];
const CATEGORIAS = [["Todos", "Todos"], ["Reciclaveis", "Reciclaveis"], ["Vidro", "Vidro"], ["Eletronicos", "Eletronicos"], ["Oleo", "Oleo de Cozinha"]];

function simuladorFiltro() {
  const botoes = h("div", { class: "barra-filtros" });
  const grade = h("div", { class: "grade-sim", "aria-live": "polite" });
  function filtrarSim(cat) {
    const lista = cat === "Todos" ? LOCAIS_SIM : LOCAIS_SIM.filter(l => l.categoria === cat);
    grade.replaceChildren(...(lista.length
      ? lista.map(l => h("div", { class: "cartao-sim" },
          icone(l.categoria.toLowerCase(), 30),
          h("div", null, h("strong", null, l.nome), h("span", null, `${l.bairro} · ${l.horario}`))))
      : [h("div", { class: "vazio-sim" }, imagem("reciclem.gif", "", "Latinha, garrafa e caixa pedindo reciclagem"),
          "Nenhum ecoponto desta categoria. Cadastre o seu na Tela 4!", h("span", { class: "cred" }, "GIF via GIPHY"))]));
    [...botoes.children].forEach(b => b.classList.toggle("ativo", b.dataset.cat === cat));
  }
  CATEGORIAS.forEach(([cat, rotulo]) =>
    botoes.append(h("button", { type: "button", class: "btn-sim", dataset: { cat }, onclick: () => filtrarSim(cat) }, rotulo)));
  filtrarSim("Todos");
  return passo(h("div", { class: "celular", role: "group", "aria-label": "Simulação do Painel Verde no celular" },
    h("div", { class: "celular-tela" }, h("h3", null, "Onde Descartar em Garopaba?"), botoes, grade)));
}

/* ---------- sticker de recompensa (GIF de festa) ---------- */
let stickerTimer = null;
function mostrarSticker() {
  if (REDUZ_MOVIMENTO) return;
  let s = document.getElementById("sticker");
  if (!s) { s = h("img", { id: "sticker", src: "img/festa.gif", alt: "", "aria-hidden": "true" }); document.body.append(s); }
  s.classList.remove("some"); void s.offsetWidth; s.classList.add("aparece");
  clearTimeout(stickerTimer);
  stickerTimer = setTimeout(() => { s.classList.remove("aparece"); }, 2200);
}

/* ---------- confete na última tela ---------- */
let confeteAtivo = false;
function lancarConfete() {
  if (REDUZ_MOVIMENTO || confeteAtivo) return;
  const canvas = document.getElementById("confete");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth; canvas.height = innerHeight;
  const cores = ["#12a150", "#62e99b", "#f59f00", "#0a6cc4", "#6d3fc8", "#c2255c"];
  const parts = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width, y: -20 - Math.random() * canvas.height * .5,
    r: 5 + Math.random() * 7, vx: -2 + Math.random() * 4, vy: 3 + Math.random() * 5,
    c: cores[Math.floor(Math.random() * cores.length)], rot: Math.random() * 6
  }));
  const fim = performance.now() + 3200;
  confeteAtivo = true;
  (function quadro(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += .1;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); ctx.restore();
    });
    if (t < fim) requestAnimationFrame(quadro);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); confeteAtivo = false; }
  })(performance.now());
}
