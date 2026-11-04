/* ==========================================================
   dom.js · ajudantes para montar a página com o DOM
   h("div", {class: "x"}, "texto", outroElemento)
   ========================================================== */
function h(tag, props, ...filhos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === false || v == null) continue;
    if (k === "class") el.className = v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  filhos.flat(Infinity).forEach(f => {
    if (f == null || f === false) return;
    el.append(f.nodeType ? f : document.createTextNode(f));
  });
  return el;
}

/* atalhos de texto */
const forte = (...f) => h("strong", null, ...f);
const arq = (...f) => h("code", { class: "arq" }, ...f);
const tecla = (...f) => h("kbd", null, ...f);
const destaque = (...f) => h("span", { class: "destaque" }, ...f);

/* marca um elemento para aparecer no passo a passo */
const passo = (el) => { el.classList.add("passo"); return el; };

/* imagem decorativa da pasta img/ */
const imagem = (arquivo, classe, alt = "") =>
  h("img", { src: "img/" + arquivo, class: classe, alt, "aria-hidden": alt ? false : "true", loading: "lazy", onerror: (e) => e.target.remove() });

const icone = (nome, tam = 36) => h("img", { src: `img/icone-${nome}.svg`, class: "icone", width: tam, height: tam, alt: "", "aria-hidden": "true" });

/* lista numerada de passos */
function listaPassos(itens, classe = "") {
  return h("ol", { class: "passos " + classe }, itens.map(conteudo => passo(h("li", null, conteudo))));
}

/* cartões */
function cartao(tipo, rotulo, ...conteudo) {
  return passo(h("div", { class: "cartao " + tipo }, h("span", { class: "rotulo" }, rotulo), ...conteudo));
}

/* cartão de checkpoint: clique para marcar como cumprido (feedback + sticker) */
function checkpoint(...conteudo) {
  const el = passo(h("button", { type: "button", class: "cartao vitoria checkpoint", "aria-pressed": "false",
    title: "Clique quando a turma cumprir o checkpoint" },
    h("span", { class: "rotulo" }, "🏁 Checkpoint de vitória"), h("span", { class: "corpo" }, ...conteudo)));
  el.addEventListener("click", () => {
    const feito = el.classList.toggle("feito");
    el.setAttribute("aria-pressed", String(feito));
    if (feito) mostrarSticker();
  });
  return el;
}

/* bloco de código com nome do arquivo e botão copiar */
function blocoCodigo(nomeArquivo, texto, classe = "") {
  const code = h("code", null, texto);
  const pre = h("pre", { class: "codigo-telao " + classe }, code);
  const btn = h("button", { type: "button", class: "btn-copiar", "aria-label": "Copiar este código" }, "Copiar");
  btn.addEventListener("click", () => copiarTexto(code.textContent, btn, "Copiar"));
  const wrap = passo(h("div", { class: "bloco-codigo" }, h("span", { class: "nome-arquivo" }, nomeArquivo), btn, pre));
  wrap.codigo = code;
  return wrap;
}

function copiarTexto(texto, botao, rotuloOriginal) {
  const ok = () => {
    botao.classList.add("copiado");
    botao.firstChild.textContent = "Copiado ✓ ";
    setTimeout(() => { botao.classList.remove("copiado"); botao.firstChild.textContent = rotuloOriginal; }, 1400);
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(ok, () => {});
  else {
    const t = h("textarea", { "aria-hidden": "true" }); t.value = texto; document.body.append(t); t.select();
    try { document.execCommand("copy"); ok(); } catch (e) { /* sem permissão: ignora */ }
    t.remove();
  }
}

/* faixa superior de cada tela */
function faixa(n, rotulo, intervalo, pagina) {
  return h("div", { class: "faixa" },
    h("span", { class: "selo-bloco" }, `TELA ${n} DE 8 · ${rotulo}`),
    h("span", { class: "chip" }, intervalo),
    h("span", { class: "chip suave" }, `Micro-Roteiro · Página ${pagina}`));
}
