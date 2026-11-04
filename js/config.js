/* ==========================================================
   config.js · edite só aqui
   Slides-Guia · Painel Verde Garopaba (Curso 2) · SNCT 2026
   ========================================================== */
const CONFIG = {
  // Tela 1: painel pronto de demonstração (Starter Kit do Curso 2, Frente 2)
  painelDemo: "https://fleithpi.github.io/sntc2026-starter-kit-curso2/",
  // Tela 2: sala do Curso 2 no Moodle IFSC
  moodle: "https://moodle.ifsc.edu.br/course/view.php?id=2664",
  // Tela 8: link da pesquisa de satisfação (vem da Frente 4)
  pesquisa: ""
};

/* Configura sem editar código:  ?pesquisa=https://...  e  ?modo=aluno */
const PARAMS = new URLSearchParams(location.search);
const pesquisaParam = PARAMS.get("pesquisa");
if (pesquisaParam && /^https:\/\//i.test(pesquisaParam)) CONFIG.pesquisa = pesquisaParam;

const MODO_ALUNO = PARAMS.get("modo") === "aluno" || window.matchMedia("(max-width: 991px)").matches;
const REDUZ_MOVIMENTO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (MODO_ALUNO) document.body.classList.add("modo-aluno");
