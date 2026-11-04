/* ==========================================================
   Slides-Guia · Painel Verde Garopaba · SNCT 2026
   Navegação por teclado, passo a passo, cronômetro por tela,
   QR Codes, gerador de QR, simulador do filtro e visão geral.
   ========================================================== */

/* ======= CONFIGURAÇÃO: edite só aqui ======= */
const CONFIG = {
  // Tela 1: painel pronto de demonstração (Starter Kit do Curso 2)
  painelDemo: "https://fleithpi.github.io/sntc2026-starter-kit-curso2/",
  // Tela 2: sala do Curso 2 no Moodle IFSC
  moodle: "https://moodle.ifsc.edu.br/course/view.php?id=2664",
  // Tela 8: link da pesquisa de satisfação do Curso 2 (Moodle ou Google Forms)
  pesquisa: ""
};

/* Permite configurar a pesquisa sem editar o código: ?pesquisa=https://... */
const params = new URLSearchParams(location.search);
const pesquisaParam = params.get("pesquisa");
if (pesquisaParam && /^https:\/\//i.test(pesquisaParam)) CONFIG.pesquisa = pesquisaParam;

/* Modo aluno (?modo=aluno): tudo visível, sem cronômetro. Ideal para o link do Moodle. */
const modoAluno = params.get("modo") === "aluno" || window.matchMedia("(max-width: 991px)").matches;
if (modoAluno) document.body.classList.add("modo-aluno");

const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const slides = Array.from(document.querySelectorAll(".slide"));
const indicador = document.getElementById("indicadorTela");
const cronometro = document.getElementById("cronometro");
const progresso = document.getElementById("progresso");
const pontos = document.getElementById("pontos");
const btnProximo = document.getElementById("btnProximo");

let indiceAtual = 0;
let restante = 0;
let timer = null;
let rodando = false;

/* ---------- passo a passo ---------- */
function passosDe(slide) { return Array.from(slide.querySelectorAll(".passo")); }

function definirPassoAPasso(ativo) {
  document.body.classList.toggle("passo-a-passo", ativo);
  if (!ativo) slides.forEach(s => passosDe(s).forEach(p => p.classList.add("visivel")));
  else passosDe(slides[indiceAtual]).forEach((p, k) => p.classList.toggle("visivel", false));
  atualizarBotao();
}

function atualizarBotao() {
  const pendentes = document.body.classList.contains("passo-a-passo")
    && passosDe(slides[indiceAtual]).some(p => !p.classList.contains("visivel"));
  if (indiceAtual === slides.length - 1 && !pendentes) btnProximo.textContent = "Fim ✓";
  else btnProximo.textContent = pendentes ? "Mostrar → " : "Próxima tela →";
}

/* ---------- navegação ---------- */
function irPara(i, mostrarTudo) {
  slides[indiceAtual].classList.remove("ativo");
  indiceAtual = Math.max(0, Math.min(slides.length - 1, i));
  const s = slides[indiceAtual];
  s.classList.add("ativo");
  s.scrollTop = 0;
  const passoAPasso = document.body.classList.contains("passo-a-passo");
  passosDe(s).forEach(p => p.classList.toggle("visivel", !passoAPasso || !!mostrarTudo));
  indicador.textContent = `Tela ${indiceAtual + 1} / ${slides.length}`;
  progresso.style.width = ((indiceAtual + 1) / slides.length * 100) + "%";
  progresso.style.background = getComputedStyle(s).getPropertyValue("--acento");
  Array.from(pontos.children).forEach((p, k) => {
    p.classList.toggle("ativo", k === indiceAtual);
    p.classList.toggle("feito", k < indiceAtual);
  });
  try { history.replaceState(null, "", location.search + "#" + (indiceAtual + 1)); } catch (e) { /* ignora */ }
  reiniciarCronometro();
  atualizarBotao();
  if (indiceAtual === slides.length - 1) lancarConfete();
}

function proximo() {
  const s = slides[indiceAtual];
  if (document.body.classList.contains("passo-a-passo")) {
    const oculto = passosDe(s).find(p => !p.classList.contains("visivel"));
    if (oculto) { oculto.classList.add("visivel"); atualizarBotao(); return; }
  }
  if (indiceAtual < slides.length - 1) irPara(indiceAtual + 1);
}
function anterior() { if (indiceAtual > 0) irPara(indiceAtual - 1, true); }
window.proximo = proximo;
window.anterior = anterior;

/* ---------- cronômetro por tela ---------- */
function formatar(s) {
  const a = Math.abs(s);
  return (s < 0 ? "−" : "") + String(Math.floor(a / 60)).padStart(2, "0") + ":" + String(a % 60).padStart(2, "0");
}
function pintarCronometro() {
  cronometro.textContent = (rodando ? "⏸ " : "▶ ") + formatar(restante);
  cronometro.classList.toggle("pausado", !rodando);
  cronometro.classList.toggle("alerta", restante <= 60 && restante >= 0);
  cronometro.classList.toggle("estourou", restante < 0);
}
function reiniciarCronometro() {
  restante = Number(slides[indiceAtual].dataset.min) * 60;
  pintarCronometro();
}
function alternarCronometro() {
  rodando = !rodando;
  clearInterval(timer);
  if (rodando) timer = setInterval(() => { restante--; pintarCronometro(); }, 1000);
  pintarCronometro();
}
cronometro.addEventListener("click", alternarCronometro);

/* ---------- pontos de progresso ---------- */
slides.forEach((s, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "ponto";
  b.setAttribute("aria-label", `Ir para a tela ${i + 1}: ${s.dataset.titulo}`);
  b.title = `${i + 1}. ${s.dataset.titulo}`;
  b.addEventListener("click", () => irPara(i, true));
  pontos.appendChild(b);
});

/* ---------- visão geral (G) ---------- */
const visaoGeral = document.getElementById("visao-geral");
const vgGrade = document.getElementById("vg-grade");
const NOMES_BLOCO = ["Acolhida", "Bloco 1", "Bloco 2", "Bloco 3", "Bloco 4"];
const COR_BLOCO = ["#86efac", "#4ade80", "#38bdf8", "#c084fc", "#fbbf24"];
slides.forEach((s, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "vg-item";
  const bl = Number(s.dataset.bloco);
  b.style.setProperty("--c", COR_BLOCO[bl]);
  b.innerHTML = `<span class="n">TELA ${i + 1}</span><span class="t"></span><span class="m"></span>`;
  b.querySelector(".t").textContent = s.dataset.titulo;
  b.querySelector(".m").textContent = `${NOMES_BLOCO[bl]} · ${s.dataset.min} min`;
  b.addEventListener("click", () => { fecharVisaoGeral(); irPara(i, true); });
  vgGrade.appendChild(b);
});
function abrirVisaoGeral() { visaoGeral.hidden = false; vgGrade.children[indiceAtual].focus(); }
function fecharVisaoGeral() { visaoGeral.hidden = true; }
document.getElementById("fechar-vg").addEventListener("click", fecharVisaoGeral);

/* ---------- teclado ---------- */
document.addEventListener("keydown", (ev) => {
  const alvo = ev.target;
  if (alvo && (alvo.tagName === "INPUT" || alvo.tagName === "TEXTAREA")) return;
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  const k = ev.key;
  if (!visaoGeral.hidden) { if (k === "Escape") fecharVisaoGeral(); return; }
  if (k === "ArrowRight" || k === "PageDown") { ev.preventDefault(); proximo(); }
  else if (k === " " && !(alvo && alvo.tagName === "BUTTON")) { ev.preventDefault(); proximo(); }
  else if (k === "ArrowLeft" || k === "PageUp") { ev.preventDefault(); anterior(); }
  else if (k === "Home") irPara(0, true);
  else if (k === "End") irPara(slides.length - 1, true);
  else if (k === "g" || k === "G" || k === "Escape") abrirVisaoGeral();
  else if (k === "p" || k === "P") alternarCronometro();
  else if (k === "r" || k === "R") reiniciarCronometro();
  else if (k === "s" || k === "S") definirPassoAPasso(!document.body.classList.contains("passo-a-passo"));
  else if (k === "f" || k === "F") {
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {});
  }
});

/* ---------- impressão: mostra tudo e restaura depois ---------- */
let eraPassoAPasso = false;
window.addEventListener("beforeprint", () => {
  eraPassoAPasso = document.body.classList.contains("passo-a-passo");
  document.body.classList.remove("passo-a-passo");
});
window.addEventListener("afterprint", () => { if (eraPassoAPasso) document.body.classList.add("passo-a-passo"); });

/* ---------- QR Codes ---------- */
function criarQr(id, url, tamanho) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.innerHTML = "";
  if (!url || typeof QRCode === "undefined") {
    el.innerHTML = '<div style="width:' + tamanho + 'px;height:' + tamanho + 'px;display:flex;align-items:center;justify-content:center;color:#444;font:600 1.05rem system-ui;text-align:center;line-height:1.3;padding:12px">QR indisponível<br>(sem link ou sem internet)</div>';
    return false;
  }
  new QRCode(el, { text: url, width: tamanho, height: tamanho, correctLevel: QRCode.CorrectLevel.M });
  return true;
}
criarQr("qr-demo", CONFIG.painelDemo, 240);
document.getElementById("qr-demo-link").textContent = CONFIG.painelDemo.replace("https://", "");
criarQr("qr-moodle", CONFIG.moodle, 190);
if (!criarQr("qr-pesquisa", CONFIG.pesquisa, 240)) document.getElementById("aviso-pesquisa").hidden = false;

/* gerador ao vivo (Tela 7) */
const urlQr = document.getElementById("urlQr");
const baixarQr = document.getElementById("baixar-qr");
function atualizarGerador() {
  const url = urlQr.value.trim();
  if (!/^https?:\/\//i.test(url)) { criarQr("qr-gerador", "", 190); baixarQr.removeAttribute("href"); return; }
  criarQr("qr-gerador", url, 190);
  setTimeout(() => {
    const canvas = document.querySelector("#qr-gerador canvas");
    if (canvas) baixarQr.href = canvas.toDataURL("image/png");
  }, 60);
}
urlQr.addEventListener("input", atualizarGerador);
atualizarGerador();

/* ---------- simulador do filtro (Tela 5) · dados iguais ao Starter Kit ---------- */
const LOCAIS_SIM = [
  { nome: "Ecoponto Central — Secretaria de Meio Ambiente", bairro: "Centro", categoria: "Eletronicos", horario: "Segunda a Sexta, 08h as 17h" },
  { nome: "Ponto Verde IFSC Campus Garopaba", bairro: "Campo D'Una", categoria: "Reciclaveis", horario: "Segunda a Sexta, 08h as 22h" },
  { nome: "Coleta de Vidro e Oleo — Associacao Comunitaria", bairro: "Ferrugem", categoria: "Vidro", horario: "Sabados, 09h as 13h" }
];
const simBotoes = document.getElementById("sim-botoes");
const simGrade = document.getElementById("sim-grade");
function filtrarSim(cat) {
  const lista = cat === "Todos" ? LOCAIS_SIM : LOCAIS_SIM.filter(l => l.categoria === cat);
  simGrade.innerHTML = "";
  if (!lista.length) {
    const v = document.createElement("div");
    v.className = "vazio-sim";
    v.textContent = "Nenhum ecoponto nesta categoria ainda. Cadastre o seu na Tela 4!";
    simGrade.appendChild(v);
  }
  lista.forEach(l => {
    const c = document.createElement("div");
    c.className = "cartao-sim";
    const tag = document.createElement("span"); tag.className = "tag"; tag.textContent = l.categoria;
    const nome = document.createElement("strong"); nome.textContent = l.nome;
    const info = document.createElement("span"); info.textContent = `${l.bairro} · ${l.horario}`;
    c.append(tag, nome, info);
    simGrade.appendChild(c);
  });
  Array.from(simBotoes.children).forEach(b => b.classList.toggle("ativo", b.dataset.cat === cat));
}
["Todos", "Reciclaveis", "Vidro", "Eletronicos", "Oleo"].forEach(cat => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn-sim";
  b.dataset.cat = cat;
  b.textContent = cat === "Oleo" ? "Oleo de Cozinha" : cat;
  b.addEventListener("click", () => filtrarSim(cat));
  simBotoes.appendChild(b);
});
filtrarSim("Todos");

/* ---------- copiar (código e chave) ---------- */
function copiar(texto, botao, rotuloOriginal) {
  const ok = () => { botao.classList.add("copiado"); botao.firstChild.textContent = "Copiado ✓ "; setTimeout(() => { botao.classList.remove("copiado"); botao.firstChild.textContent = rotuloOriginal; }, 1400); };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(ok, () => {});
  else {
    const t = document.createElement("textarea"); t.value = texto; document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); ok(); } catch (e) { /* ignora */ }
    t.remove();
  }
}
document.querySelectorAll("pre[data-copiar]").forEach(pre => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn-copiar";
  b.appendChild(document.createTextNode("Copiar"));
  b.setAttribute("aria-label", "Copiar este código");
  b.addEventListener("click", () => copiar(pre.querySelector("code").textContent, b, "Copiar"));
  pre.parentElement.appendChild(b);
});
document.querySelectorAll(".copiar-chip").forEach(b => {
  const original = b.firstChild.textContent;
  b.addEventListener("click", () => copiar(b.dataset.copia, b, original));
});

/* ---------- confete na última tela ---------- */
let confeteAtivo = false;
function lancarConfete() {
  if (reduzMovimento || confeteAtivo) return;
  const canvas = document.getElementById("confete");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth; canvas.height = innerHeight;
  const cores = ["#22c55e", "#86efac", "#facc15", "#38bdf8", "#c084fc", "#fb923c"];
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

/* ---------- reage a mudanças de # (botão voltar, links diretos) ---------- */
window.addEventListener("hashchange", () => {
  const n = parseInt(location.hash.slice(1), 10);
  if (n >= 1 && n <= slides.length && n - 1 !== indiceAtual) irPara(n - 1, true);
});

/* ---------- início ---------- */
definirPassoAPasso(!modoAluno);
const inicio = parseInt(location.hash.slice(1), 10);
const comHash = inicio >= 1 && inicio <= slides.length;
slides[0].classList.remove("ativo");
indiceAtual = 0;
irPara(comHash ? inicio - 1 : 0, comHash || modoAluno);
if (modoAluno) rodando = false;
