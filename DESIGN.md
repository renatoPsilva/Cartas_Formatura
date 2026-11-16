# Design — Cartões de Gratidão

## Conceito

Uma **coleção de cartões**, não um site de formatura. Cada professor recebe uma peça com capa e páginas internas, como uma carta impressa que foi digitalizada com cuidado. O cartão é o objeto principal; o site é apenas a mesa onde ele é aberto.

O elemento memorável é o **selo tipográfico**: um carimbo circular com iniciais, ano e uma microcoroa de linhas. Ele aparece na capa como botão de abertura, no fim da carta e na capa da coleção. O resto é quieto: papel, tipografia e margens.

**Nome:** Cartões de Gratidão.
**Público:** professores da Alpha EdTech e a turma que escreve.
**Trabalho principal:** fazer cada professor reconhecer, em poucos segundos, que aquela carta foi feita para ele(a) — e então ler com calma.

## Direção visual

- Editorial, tátil e contido.
- Papel sobre pedra; tinta escura; um único acento por professor.
- Nada de confete, dourado, fitas, polaroides, scrapbook, música automática ou clichês de formatura.
- A capa tem identidade; as páginas de texto têm apenas o texto.
- O selo é a única exceção decorativa. Ele é desenhado por tipografia e réguas finas, não por textura de cera.

### Revisão contra os padrões genéricos

A direção original do plano já pedia pedra + papel + Fraunces + selo. O risco seria cair no “cartão SaaS” ou no “scrapbook de formatura”. As decisões para evitar isso:

- **Sem cards repetidos com sombra genérica.** Existe um único objeto: a folha. O chrome (botões, controles, numeração) fica fora dela.
- **Sem papel creme + serifa de banco + terracota como fórmula.** O fundo é pedra fria (`#E9E4DA`), a tinta é verde-azulada (`#1B2A2E`) e o selo padrão é um vermelho queimado. O acento varia por professor e aparece só em marcas, nunca no corpo.
- **Sem marcadores numerados decorativos.** Só a numeração real de página, fora do cartão.
- **Sem micro-labels em caixa alta por toda parte.** Os rótulos internos do selo são a exceção: são parte do carimbo.
- **Movimento mínimo.** A transição de páginas é um fade lento; o único gesto orquestrado é abrir o selo. `prefers-reduced-motion` desliga tudo.
- **Assimetria discreta.** A capa usa nome grande à esquerda e retrato/monograma à direita; a abertura fica embaixo, deslocada, não centralizada como um hero genérico.

## Tokens

### Cor — tema claro

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#E9E4DA` | fundo pedra |
| `--card` | `#FAF7F0` | papel do cartão |
| `--ink` | `#1B2A2E` | tinta principal |
| `--muted` | `#67635B` | texto secundário (AA sobre pedra e papel) |
| `--line` | `#D8D0C3` | linhas e bordas |
| `--seal` | `#A33B32` | acento padrão |

### Cor — tema escuro

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0E1618` | fundo |
| `--card` | `#162225` | papel |
| `--ink` | `#F2ECE1` | tinta |
| `--muted` | `#A8A196` | secundário |
| `--line` | `#2E3D40` | linhas |
| `--seal` | `#C46A5E` | acento padrão |

### Acentos por professor

| Nome | Claro | Escuro |
|---|---|---|
| `seal` | `#A33B32` | `#C46A5E` |
| `azul` | `#2F5D7A` | `#7FA6C0` |
| `verde` | `#4E6B52` | `#93B394` |
| `ameixa` | `#7A4E5A` | `#C48C9C` |
| `ocre` | `#B07A3C` | `#D8A75E` |

O acento aparece no selo, no monograma, na linha curta da capa e em uma borda de citação. **Nunca no corpo do texto.**

Contraste: `--muted` foi ajustado para `#67635B` para passar AA sobre o pedra. Os textos internos do selo usam `--accent-ink`, uma variação mais escura/clara do acento, em vez do acento puro. O ocre puro não é usado em texto pequeno.

## Tipografia

- **Fraunces** (variável, self-hosted): títulos, nome do professor e corpo da carta. O eixo `opsz` é usado grande na capa e menor no texto; `SOFT` alta no corpo para uma leitura mais macia; `WONK` em 0 para manter a carta quieta.
- **IBM Plex Sans** (variável, self-hosted): navegação, rótulos, legendas, metadados e interface do editor.
- Sem fonte manuscrita, sem script, sem “assinatura” falsa.
- Corpo da carta: 28 px no desenho de 820 px; 38 px no viewport estreito, compensando a escala do Reveal. Linha de 1.55–1.62; medida confortável abaixo de 70ch.
- Títulos de página: 42 px no desenho; 48 px no mobile.
- Nome na capa: 74 px no desenho; até 92 px em viewports muito estreitos.
- `font-display: swap` e preload do subset latino.

## Layout

### Capa

```text
┌──────────────────────────────────────────┐
│ Cartões de Gratidão        Alpha EdTech · 2026 │
│ ──────────────────────────────────────── │
│                                          │
│   ───                                    │
│   Para                    ┌────────────┐  │
│   Nome do professor       │ retrato ou │  │
│   Disciplina              │ monograma  │  │
│                           └────────────┘  │
│                                          │
│   ( selo )   Abra o cartão               │
│              Toque no selo ou use as setas│
│ ──────────────────────────────────────── │
│ Uma carta da turma             Alpha EdTech│
└──────────────────────────────────────────┘
```

- Proporção 820 × 1160, próxima de A4.
- Padding generoso (62–68 px no desenho).
- Nome em Fraunces, alinhado à esquerda.
- Retrato em bloco 274 × 352; se não houver imagem, monograma com iniciais grandes, linhas finas e microtexto.
- Selo de 172 px como botão acessível; texto de apoio ao lado.
- Cabeçalho e rodapé com réguas de 1 px.

### Página de texto

- Só o conteúdo, verticalmente centrado.
- Título opcional; parágrafos com 0.9em de respiro.
- Nenhum número, moldura, carimbo ou nota de margem dentro da folha.
- A numeração e as setas ficam no fundo, fora do cartão.

### Página de foto

- 1–3 imagens, grid limpo; 1 grande, 2 lado a lado, 3 com a primeira ocupando duas linhas.
- Legendas em Plex, pequenas, abaixo da imagem.
- Falha de imagem vira um placeholder visual com aviso discreto, nunca um ícone quebrado.

### Recados

- Lista de mensagens curtas com autor.
- Duas colunas no desktop; uma coluna no mobile.
- Réguas finas separam os blocos.

### Citação

- Trecho grande em Fraunces, com uma régua de acento à esquerda e autor opcional abaixo.
- Sem aspas gigantes decorativas.

### Assinatura

- Fechamento centralizado, com “Com carinho,”, o nome da turma, o ano e um selo menor.
- É a única página interna centralizada; funciona como o fim de uma carta.

## Interação

- Reveal.js 6.0.2, um deck por professor, 820 × 1160, margem 0.02, centro desligado, fade lento, sem autoplay.
- Teclado, setas, swipe e controles; o progresso fica na base da tela.
- O selo da capa é um `<button>` com rótulo “Abrir a carta de …”; ao clicar, chama `Reveal.next()` e move o foco para a página atual.
- **Ler a carta inteira** abre um `<dialog>` com todas as páginas em um artigo linear, rolável, fechável por Esc ou botão.
- Enquanto o diálogo está aberto, o teclado e o swipe do Reveal são suspensos para não trocar slides atrás da leitura.
- Toggle claro/escuro fixo, com `aria-pressed`, ícone sol/lua e persistência em `localStorage` (`cg-theme`). Na primeira visita, segue `prefers-color-scheme`. O tema é aplicado antes do CSS para evitar flash.
- O indicador “2 / 6” fica fora do cartão, no canto inferior esquerdo; os controles ficam à direita.
- `prefers-reduced-motion`: transições e animações zeradas; o conteúdo aparece imediatamente.

## Acessibilidade

- `lang="pt-BR"` em todas as páginas.
- Skip link para “Ler a carta inteira”.
- Foco visível em todos os botões, links e campos.
- Contraste AA: tinta 13.8:1, secundário 4.7:1 sobre pedra e 5.6:1 sobre papel no tema claro; no escuro, secundário 7.2:1.
- Alt text obrigatório nas imagens; fallback visual quando a imagem falta.
- O modo de leitura é um diálogo nativo, com foco preso e retorno de foco ao botão que o abriu.
- O selo e as imagens decorativas são `aria-hidden`; o botão tem rótulo textual.
- Não há texto essencial dentro de imagens. A imagem OG é a exceção de compartilhamento, não conteúdo da página.
- O deck usa a região `aria-live` nativa do Reveal para anunciar a página atual.

## Responsivo

- **Desktop:** cartão retrato centralizado, chrome discreto nas bordas, muito ar.
- **Mobile (390 × 844):** o Reveal escala o desenho de 820 px; os tamanhos de texto internos sobem para manter ~16–18 px na tela. A capa empilha o retrato acima do nome em telas muito estreitas. A página de recados passa a uma coluna.
- **Tablet:** escala intermediária; nenhuma alteração estrutural.
- Se o texto não couber no cartão, **Ler a carta inteira** é o caminho garantido. O editor avisa acima de ~600 caracteres.

## Imagens

- `assets/img/professores/<slug>/retrato.webp` e `foto-01.webp`, `foto-02.webp`.
- Placeholders atuais: SVGs abstratos e monogramas CSS, sem fotos falsas da internet.
- Imagem OG 1200 × 630, gerada a partir de HTML com as fontes do próprio projeto.
- Favicon SVG com o selo CG.
- `loading="lazy"` e `decoding="async"` nas imagens de conteúdo; retrato da capa com `loading="eager"`.

## Editor

O editor é uma ferramenta de trabalho: mais funcional do que o site, mas com os mesmos tokens. Três colunas no desktop (cartões, formulário, prévia), duas no tablet e uma no celular. A prévia usa as mesmas classes de cartão, escaladas por `transform`, para não divergir do resultado publicado.

## O que evitar

- Confete, glitter, dourado, balões, música automática, autoplay.
- Papel creme + terracota + serifa de banco como identidade padrão.
- Scrapbook, fita adesiva, polaroid, carimbo de “Parabéns”.
- Texto dentro de imagem no conteúdo.
- Cards SaaS repetidos e sombras genéricas.
- Excesso de animação; mais de um momento orquestrado.
- Lista pública de professores na raiz.
- Fontes manuscritas.
