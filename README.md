# Slides-Guia de Projeção — Painel Verde de Garopaba (Curso 2)

**Frente 3 · SNCT 2026 · Programação para a Internet 2 · IFSC Câmpus Garopaba**

Apresentação interativa de **8 telas** em HTML5 + Bootstrap 5 + JavaScript puro para projetar na oficina de 120 minutos (legível a 6 m).
Sincronizada com o Micro-Roteiro (Frente 1) e com o Starter Kit do Curso 2 (Frente 2).

## Como usar

| Ação | Como |
|---|---|
| Projetar | Abrir o link do GitHub Pages (ou `index.html`) e apertar `F` para tela cheia |
| Avançar / voltar | `→` `Espaço` / `←` (revela os itens de cada tela passo a passo) |
| Ir direto à tela | `1`–`8` · `Home` · `End` · clique na linha do tempo do rodapé |
| Visão geral | `G` |
| Notas do instrutor | `N` |
| Cronômetro da tela | `P` inicia/pausa · `R` reinicia |
| Passo a passo liga/desliga | `S` |
| Versão para o aluno (tudo visível) | `index.html?modo=aluno` |
| Link da pesquisa de satisfação (Tela 8) | `index.html?pesquisa=https://...` ou `js/config.js` |
| Plano B offline | `pdf/Slides-Guia-Painel-Verde.pdf` (8 páginas A4 paisagem) |

## Estrutura

```
index.html            página-casca (as telas são montadas pelo DOM)
css/estilo.css        tema, projeção, impressão
js/config.js          links e parâmetros (edite aqui)
js/dom.js             ajudantes h() para criar elementos
js/telas.js           conteúdo das 8 telas
js/componentes.js     QR Code, gerador, simulador de filtro, sticker, confete
js/navegacao.js       navegação, cronômetro, linha do tempo, visão geral, notas
js/app.js             inicialização
img/                  ícones e ilustração (SVG) e GIFs do canal @ifsc
pdf/                  cópia offline para o pen-drive
```

## Boas práticas aplicadas

- Uma ideia por tela e revelação passo a passo, para não despejar tudo de uma vez.
- Texto a partir de 1.35rem (22px) e código a partir de 1.25rem (20px); no máximo 12 linhas de código por tela.
- Alto contraste e cor por bloco (a cor da barra de progresso muda a cada bloco).
- Interações para a turma participar: simulador de filtro, seletor de cor, erro da vírgula, gerador de QR Code, checkpoints clicáveis.
- Ritmo: cronômetro por tela e linha do tempo proporcional aos 120 minutos.
- Acessibilidade: navegação por teclado, `aria-label`, foco visível, `prefers-reduced-motion`.

## Créditos

GIFs "TÔ NO IFSC" e "FIZ IFSC": canal oficial [@ifsc no GIPHY](https://giphy.com/ifsc). QR Codes: [qrcodejs](https://github.com/davidshimjs/qrcodejs).
