# Convenções para agentes

Este repositório é uma base estática para os **Cartões de Gratidão** da turma da Alpha EdTech.

## Antes de mexer no visual

1. Leia `.opencode/skills/frontend-design/SKILL.md` **inteiro**.
2. Leia `DESIGN.md` e `PLANO.md` para entender a direção, os tokens e as restrições.
3. Se for uma mudança visual, tire screenshots em claro/escuro e em 390 × 844 e 1440 × 900; critique o resultado antes de finalizar.

## Stack e restrições

- HTML, CSS e JavaScript puros. Sem React, Vue, Svelte, Astro, Tailwind ou framework equivalente.
- Sem build step. O site é servido diretamente pelo GitHub Pages.
- Sem CDN em runtime. Reveal.js, fflate e fontes são vendorizados no repositório.
- Sem backend, banco, login ou token.
- Caminhos relativos em todos os arquivos. O site vive em `/cartas-formatura/`. A exceção é `404.html`, que usa `<base href="/cartas-formatura/">` porque o GitHub Pages serve o 404 mantendo a URL profunda original.
- `.nojekyll` na raiz.
- Site em pt-BR; `lang="pt-BR"` em todas as páginas.
- Todas as páginas com `noindex, nofollow`. `robots.txt` com `Disallow: /`.
- Sem dados reais de professores. Nomes, disciplinas e imagens são placeholders.
- Sem lista pública de professores na raiz.
- Sem confete, dourado, autoplay, música automática ou clichês de formatura.

## Estrutura de conteúdo

- `dados.js` define `window.DADOS`, um script clássico.
- A capa é automática: `nome`, `disciplina`, `retrato`, `retratoAlt`, `acento`, `selo`.
- `paginas` é uma lista ordenada de blocos: `texto`, `foto`, `recados`, `citacao`, `assinatura`.
- Se não houver `assinatura`, o renderer adiciona uma no fim.
- **Caminhos de imagem nos dados são relativos à raiz do site** (`assets/img/...`). `render-carta.js` prefixa `../../` nas páginas de professor. O editor prefixa `../` na prévia. O ZIP mantém os caminhos da raiz.
- Acentos válidos: `seal`, `azul`, `verde`, `ameixa`, `ocre`.
- Se `retrato` estiver vazio ou a imagem falhar, use o monograma. Nunca deixe ícone quebrado.
- Mantenha os textos de página dentro do cartão. O modo “Ler a carta inteira” é o fallback; o editor avisa acima de ~600 caracteres.

## Direção visual

- O cartão parece uma folha, não um slide corporativo.
- Capa com identidade: nome grande, disciplina, retrato/monograma, selo, acento.
- Interior de texto limpo: sem molduras, carimbos, números ou enfeites dentro da folha.
- Números de página, setas e progresso ficam **fora** do cartão, no fundo.
- O selo é o elemento memorável. Não adicione um segundo.
- O acento aparece no selo, no monograma e em linhas finas; nunca no corpo do texto.
- Fraunces para display/corpo da carta; IBM Plex Sans para navegação e interface.
- Textura de papel discreta via CSS, não imagem de fundo pesada.

## Acessibilidade

- Teclado e foco visível em tudo.
- `aria-pressed` no toggle de tema; persistir em `cg-theme`.
- `prefers-reduced-motion` desliga animações/transições.
- Skip link para o modo de leitura.
- `<dialog>` para “Ler a carta inteira”, com foco preso, Esc e retorno de foco.
- Suspenda teclado/swipe do Reveal enquanto o diálogo estiver aberto.
- Alt text em todas as imagens; fallback quando faltarem.
- Contraste AA. `--muted` claro é `#67635B`; textos pequenos do selo usam `--accent-ink`, não o acento puro.
- Não usar texto essencial dentro de imagem.

## Editor

- Página não listada em `editor/`, com `noindex, nofollow`; não linkar do site público.
- Deve carregar `../dados.js` e usar `window.DADOS`.
- Upload de imagens: maior lado ≤ 1600 px, WebP com fallback JPEG, aviso para < 800 px ou > 500 KB.
- Rascunho textual em `localStorage` (`cg-editor-draft-v1`); blobs em IndexedDB (`cartoes-gratidao-editor`).
- Exportação: `dados.js` e ZIP com `dados.js` + imagens + `LEIA-ME.txt`.
- O ZIP deve manter exatamente os caminhos referenciados nos dados.
- O editor não cria shells HTML. Ao adicionar professor, documente que é preciso duplicar uma pasta em `carta/` e ajustar `data-professor` e meta tags.
- Após a formatura, o editor deve ser removido ou bloqueado. Veja o README.

## Testes antes de publicar

- Servidor local: `python3 -m http.server 8000`.
- Playwright em 390 × 844 e 1440 × 900.
- Raiz, piloto, pelo menos um placeholder, editor e 404.
- Claro/escuro + persistência.
- Teclado: setas, Home/End, Enter/Space no selo, Esc no modo leitura.
- Swipe quando possível.
- “Ler a carta inteira” abre, rola, fecha e devolve o foco.
- `prefers-reduced-motion` sem transições.
- Console sem erros; imagens/fallbacks; meta tags e `noindex`.
- ZIP do editor com `dados.js` + imagens + `LEIA-ME.txt`.
- Verificar a URL publicada do GitHub Pages depois do deploy.

## O que não fazer

- Não usar Google Drive, Cloudflare Images, backend, banco ou tokens.
- Não commitar `node_modules`, screenshots de teste, ZIPs, arquivos temporários ou dados pessoais.
- Não renomear/slug sem atualizar a pasta `carta/<slug>/`, as meta tags e os caminhos de imagem.
- Não editar o conteúdo de `.opencode/skills/frontend-design/SKILL.md` nem remover a licença.
- Não transformar a raiz em uma lista de cartões.
