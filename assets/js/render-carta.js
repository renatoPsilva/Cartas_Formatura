/* ==========================================================================
   Renderer dos cartões
   Monta capa + um slide por bloco, inicializa o Reveal e publica o evento
   "cartao:pronto" para o modo de leitura.
   ========================================================================== */
(function () {
  "use strict";

  var ACENTOS = ["seal", "azul", "verde", "ameixa", "ocre"];
  var app = document.querySelector(".app");
  var elementoErro = document.querySelector("[data-erro]");
  var elementoErroTexto = document.querySelector("[data-erro-texto]");

  function esc(valor) {
    return String(valor == null ? "" : valor).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function comQuebras(valor) {
    return esc(valor).replace(/\n/g, "<br>");
  }

  /* Os dados guardam caminhos relativos à raiz do site (assets/...).
     A página do professor está em carta/<slug>/, então prefixamos ../../. */
  function urlImagem(valor) {
    var src = String(valor || "").trim();
    if (!src) return "";
    if (/^(https?:|data:|blob:|\/)/i.test(src)) return src;
    if (src.indexOf("../../") === 0 || src.indexOf("../") === 0) return src;
    return "../../" + src.replace(/^\.\//, "");
  }

  function iniciaisDe(professor) {
    var bruto = String(professor.selo || "").trim();
    if (bruto) return bruto.slice(0, 3).toUpperCase();

    var partes = String(professor.nome || "")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(function (parte) {
        return parte.length > 0;
      });
    var iniciais = partes
      .slice(0, 2)
      .map(function (parte) {
        return parte.charAt(0);
      })
      .join("");
    return (iniciais || "CG").toUpperCase();
  }

  function svgSelo(professor, opcoes) {
    var op = opcoes || {};
    var iniciais = iniciaisDe(professor || {});
    var ano = (professor && professor.ano) || "2026";
    var rodape = op.rodape || "ALPHA EDTECH";
    var tamanho =
      iniciais.length > 2 ? 50 : iniciais.length === 2 ? 62 : 70;
    var aria = op.decorativo === false ? "" : ' aria-hidden="true"';
    return (
      '<svg class="seal-mark" viewBox="0 0 200 200" focusable="false"' +
      aria +
      ">" +
      '<circle class="seal-line" cx="100" cy="100" r="95" stroke-width="1.3"/>' +
      '<circle class="seal-line" cx="100" cy="100" r="86" stroke-width="0.7" stroke-dasharray="1.5 5.5" opacity="0.58"/>' +
      '<circle class="seal-diamond" cx="100" cy="6" r="1.7"/>' +
      '<circle class="seal-diamond" cx="194" cy="100" r="1.7"/>' +
      '<circle class="seal-diamond" cx="100" cy="194" r="1.7"/>' +
      '<circle class="seal-diamond" cx="6" cy="100" r="1.7"/>' +
      '<text class="seal-year" x="100" y="50" text-anchor="middle">' +
      esc(ano) +
      "</text>" +
      '<text x="100" y="126" text-anchor="middle" font-size="' +
      tamanho +
      '" font-weight="360" letter-spacing="-1">' +
      esc(iniciais) +
      "</text>" +
      '<line class="seal-line" x1="69" y1="145" x2="131" y2="145" stroke-width="0.7" opacity="0.45"/>' +
      '<text class="seal-micro" x="100" y="165" text-anchor="middle">' +
      esc(rodape) +
      "</text>" +
      "</svg>"
    );
  }

  function retratoHtml(professor) {
    var src = String(professor.retrato || "").trim();
    var alt = String(professor.retratoAlt || "").trim();
    if (!alt) alt = "Retrato de " + (professor.nome || "professor");
    return (
      '<div class="retrato" data-retrato>' +
      '<div class="monograma" aria-hidden="true">' +
      '<span class="monograma__iniciais">' +
      esc(iniciaisDe(professor)) +
      "</span>" +
      '<span class="monograma__label">ALPHA EDTECH</span>' +
      "</div>" +
      (src
        ? '<img src="' +
          esc(urlImagem(src)) +
          '" alt="' +
          esc(alt) +
          '" loading="eager" decoding="async">'
        : "") +
      "</div>"
    );
  }

  function capaHtml(professor) {
    return (
      '<section class="slide slide--capa" data-titulo="Capa" aria-label="Capa da carta para ' +
      esc(professor.nome) +
      '" tabindex="-1">' +
      '<div class="card card--capa">' +
      '<header class="card__top"><span>Cartões de Gratidão</span><span>Alpha EdTech · 2026</span></header>' +
      '<div class="capa__main">' +
      '<div class="capa__identity">' +
      '<div class="capa__rule" aria-hidden="true"></div>' +
      '<p class="capa__para">Para</p>' +
      '<h1 class="capa__nome">' +
      esc(professor.nome) +
      "</h1>" +
      '<p class="capa__disciplina">' +
      esc(professor.disciplina || "Professor(a) da Alpha EdTech") +
      "</p>" +
      "</div>" +
      retratoHtml(professor) +
      "</div>" +
      '<div class="capa__open">' +
      '<button class="seal-button" type="button" data-open-card aria-label="Abrir a carta de ' +
      esc(professor.nome) +
      '">' +
      svgSelo(professor) +
      "</button>" +
      '<div class="capa__open-copy"><p>Abra o cartão</p><span>Toque no selo ou use as setas do teclado para entrar.</span></div>' +
      "</div>" +
      '<footer class="card__bottom"><span>Uma carta da turma</span><span>Alpha EdTech</span></footer>' +
      "</div></section>"
    );
  }

  function textoHtml(pagina) {
    var paragrafos = Array.isArray(pagina.paragrafos) ? pagina.paragrafos : [];
    var total = paragrafos.join(" ").length;
    var corpo = paragrafos
      .filter(function (p) {
        return String(p || "").trim() !== "";
      })
      .map(function (p) {
        return "<p>" + comQuebras(p) + "</p>";
      })
      .join("");
    if (!corpo) {
      corpo = '<p class="vazio">Esta página ainda está em branco.</p>';
    }
    return (
      '<div class="card card--page"><div class="page-text' +
      (total > 560 ? " page-text--long" : "") +
      '">' +
      (pagina.titulo ? "<h2>" + esc(pagina.titulo) + "</h2>" : "") +
      corpo +
      "</div></div>"
    );
  }

  function fotoFallbackHtml() {
    return (
      '<div class="photo__fallback"><div><span aria-hidden="true">□</span>Imagem ainda não adicionada.<br>Substitua no editor.</div></div>'
    );
  }

  function figuraHtml(foto) {
    var src = String(foto && foto.src ? foto.src : "").trim();
    var alt = String(foto && foto.alt ? foto.alt : "").trim();
    var legenda = String(foto && foto.legenda ? foto.legenda : "").trim();
    if (!alt) alt = legenda || "Foto da carta";
    return (
      "<figure class=\"photo\">" +
      '<div class="photo__frame">' +
      (src
        ? '<img src="' +
          esc(urlImagem(src)) +
          '" alt="' +
          esc(alt) +
          '" loading="lazy" decoding="async">'
        : "") +
      '<div class="photo__fallback"' +
      (src ? " hidden" : "") +
      '><div><span aria-hidden="true">□</span>Imagem ainda não adicionada.<br>Substitua no editor.</div></div>' +
      "</div>" +
      (legenda ? "<figcaption>" + esc(legenda) + "</figcaption>" : "") +
      "</figure>"
    );
  }

  function fotoHtml(pagina) {
    var fotos = Array.isArray(pagina.fotos) ? pagina.fotos.slice(0, 6) : [];
    if (!fotos.length) fotos = [{}];
    var classe =
      fotos.length === 1
        ? "photo-grid--1"
        : fotos.length === 2
          ? "photo-grid--2"
          : fotos.length === 3
            ? "photo-grid--3"
            : "photo-grid--many";
    return (
      '<div class="card card--foto">' +
      (pagina.titulo
        ? '<div class="page-head"><h2>' + esc(pagina.titulo) + "</h2></div>"
        : "") +
      '<div class="photo-grid ' +
      classe +
      '">' +
      fotos.map(figuraHtml).join("") +
      "</div></div>"
    );
  }

  function recadosHtml(pagina) {
    var recados = Array.isArray(pagina.recados) ? pagina.recados : [];
    var itens = recados
      .filter(function (recado) {
        return recado && String(recado.texto || "").trim() !== "";
      })
      .map(function (recado) {
        return (
          '<li><blockquote><p>' +
          comQuebras(recado.texto) +
          "</p></blockquote>" +
          (recado.autor ? "<cite>" + esc(recado.autor) + "</cite>" : "") +
          "</li>"
        );
      })
      .join("");
    if (!itens) {
      itens =
        '<li><blockquote><p>Os recados da turma ainda serão adicionados.</p></blockquote></li>';
    }
    return (
      '<div class="card card--recados">' +
      '<div class="page-head"><h2>' +
      esc(pagina.titulo || "Recados") +
      "</h2></div>" +
      '<ul class="recados-list">' +
      itens +
      "</ul></div>"
    );
  }

  function citacaoHtml(pagina) {
    var texto = String(pagina.texto || "").trim();
    if (!texto) texto = "Uma frase da turma ainda será escolhida.";
    return (
      '<div class="card card--citacao"><blockquote><p>' +
      comQuebras(texto) +
      "</p>" +
      (pagina.autor ? "<cite>" + esc(pagina.autor) + "</cite>" : "") +
      "</blockquote></div>"
    );
  }

  function separarAssinatura(texto) {
    var limpo = String(texto || "").trim();
    if (!limpo) {
      return { abertura: "Com carinho,", nome: "Turma Alpha EdTech" };
    }
    var indice = limpo.indexOf(",");
    if (indice > 0 && indice < limpo.length - 1) {
      return {
        abertura: limpo.slice(0, indice + 1).trim(),
        nome: limpo.slice(indice + 1).trim(),
      };
    }
    return { abertura: "Com carinho,", nome: limpo };
  }

  function assinaturaHtml(pagina, professor, padrao) {
    var dados = pagina || {};
    var partes = separarAssinatura(
      dados.texto || (padrao ? "Com carinho, Turma Alpha EdTech" : "")
    );
    var ano = dados.ano || "2026";
    return (
      '<div class="card card--assinatura"><div class="assinatura__content">' +
      "<p>" +
      esc(partes.abertura) +
      "</p>" +
      "<strong>" +
      esc(partes.nome) +
      "</strong>" +
      '<span class="assinatura__ano">' +
      esc(ano) +
      "</span>" +
      '<div class="assinatura__seal">' +
      svgSelo(professor) +
      "</div>" +
      "</div></div>"
    );
  }

  function rotuloPagina(pagina, indice) {
    var tipo = pagina && pagina.tipo;
    var titulo = pagina && pagina.titulo;
    if (titulo) return titulo;
    if (tipo === "foto") return "Fotos";
    if (tipo === "recados") return "Recados";
    if (tipo === "citacao") return "Citação";
    if (tipo === "assinatura") return "Assinatura";
    return "Página " + indice;
  }

  function criarSlide(html, rotulo, indice) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    var slide = wrapper.firstElementChild;
    if (!slide.classList.contains("slide")) {
      var secao = document.createElement("section");
      secao.className = "slide";
      secao.appendChild(slide);
      slide = secao;
    }
    slide.setAttribute("data-titulo", rotulo);
    slide.setAttribute("aria-label", "Página " + indice + ": " + rotulo);
    slide.setAttribute("tabindex", "-1");
    return slide;
  }

  function mostrarErro(mensagem) {
    if (app) app.dataset.estado = "erro";
    if (elementoErro) elementoErro.hidden = false;
    if (elementoErroTexto) elementoErroTexto.textContent = mensagem;
    document.title = "Carta não encontrada — Cartões de Gratidão";
  }

  function ligarImagens() {
    var retratos = document.querySelectorAll(".retrato img");
    Array.prototype.forEach.call(retratos, function (img) {
      function carregou() {
        var caixa = img.closest(".retrato");
        if (caixa) caixa.classList.add("has-image");
      }
      function falhou() {
        if (img.parentNode) img.parentNode.removeChild(img);
      }
      if (img.complete && img.naturalWidth > 0) carregou();
      img.addEventListener("load", carregou);
      img.addEventListener("error", falhou);
    });

    var fotos = document.querySelectorAll(".photo__frame img");
    Array.prototype.forEach.call(fotos, function (img) {
      function falhou() {
        img.hidden = true;
        var fallback = img.parentNode.querySelector(".photo__fallback");
        if (fallback) fallback.hidden = false;
      }
      if (img.complete && img.naturalWidth === 0) falhou();
      img.addEventListener("error", falhou);
    });
  }

  function iniciar() {
    var slug = document.body.getAttribute("data-professor");
    var lista = Array.isArray(window.DADOS) ? window.DADOS : null;
    if (!lista) {
      mostrarErro(
        "Os dados da carta não carregaram. Recarregue a página ou avise a turma."
      );
      return;
    }

    var professor = null;
    for (var i = 0; i < lista.length; i += 1) {
      if (lista[i] && lista[i].slug === slug) {
        professor = lista[i];
        break;
      }
    }

    if (!professor) {
      mostrarErro(
        "O link pode estar incompleto ou a carta ainda não foi publicada. Confira o endereço e tente de novo."
      );
      return;
    }

    var acento = ACENTOS.indexOf(professor.acento) >= 0 ? professor.acento : "seal";
    document.body.setAttribute("data-acento", acento);

    var paginas = Array.isArray(professor.paginas) ? professor.paginas : [];
    var slidesEl = document.querySelector(".reveal .slides");
    if (!slidesEl) {
      mostrarErro("Não foi possível montar a carta. Recarregue a página.");
      return;
    }

    slidesEl.innerHTML = "";
    slidesEl.appendChild(criarSlide(capaHtml(professor), "Capa", 1));

    paginas.forEach(function (pagina, indice) {
      if (!pagina || !pagina.tipo) return;
      var rotulo = rotuloPagina(pagina, indice + 2);
      var html = "";
      if (pagina.tipo === "texto") html = textoHtml(pagina);
      else if (pagina.tipo === "foto") html = fotoHtml(pagina);
      else if (pagina.tipo === "recados") html = recadosHtml(pagina);
      else if (pagina.tipo === "citacao") html = citacaoHtml(pagina);
      else if (pagina.tipo === "assinatura")
        html = assinaturaHtml(pagina, professor, false);
      if (html) {
        slidesEl.appendChild(
          criarSlide(html, rotulo, slidesEl.children.length + 1)
        );
      }
    });

    var temAssinatura = paginas.some(function (pagina) {
      return pagina && pagina.tipo === "assinatura";
    });
    if (!temAssinatura) {
      slidesEl.appendChild(
        criarSlide(
          assinaturaHtml(null, professor, true),
          "Assinatura",
          slidesEl.children.length + 1
        )
      );
    }

    ligarImagens();

    if (!window.Reveal) {
      mostrarErro(
        "O leitor do cartão não carregou. Recarregue a página ou avise a turma."
      );
      return;
    }

    window.Reveal.initialize({
      width: 820,
      height: 1160,
      margin: 0.02,
      minScale: 0.2,
      maxScale: 1.5,
      center: false,
      controls: true,
      controlsLayout: "bottom-right",
      controlsBackArrows: "visible",
      controlsTutorial: false,
      progress: true,
      keyboard: true,
      touch: true,
      hash: true,
      history: false,
      transition: "fade",
      transitionSpeed: "slow",
      autoSlide: 0,
      loop: false,
      backgroundTransition: "fade",
      autoAnimate: false,
      slideNumber: false,
      showNotes: false,
      help: false,
      pause: true,
      scrollActivationWidth: 0,
      respondToHashChanges: true,
    }).then(function () {
      if (app) app.dataset.estado = "pronto";
      ligarIndicador();
      ligarAbertura();

      window.Cartao = {
        professor: professor,
        paginas: paginas,
        reveal: window.Reveal,
        svgSelo: svgSelo,
        urlImagem: urlImagem,
        esc: esc,
      };

      document.dispatchEvent(
        new CustomEvent("cartao:pronto", {
          detail: { professor: professor, paginas: paginas },
        })
      );
    }).catch(function (erro) {
      mostrarErro(
        "Não foi possível abrir o cartão neste navegador. Recarregue a página ou tente outro navegador."
      );
      if (window.console && console.error) console.error(erro);
    });
  }

  function ligarIndicador() {
    var atual = document.querySelector("[data-page-current]");
    var total = document.querySelector("[data-page-total]");
    function atualizar() {
      var indices = window.Reveal.getIndices();
      if (atual) atual.textContent = String(indices.h + 1);
      if (total) total.textContent = String(window.Reveal.getTotalSlides());
    }
    atualizar();
    window.Reveal.on("slidechanged", atualizar);
    window.Reveal.on("ready", atualizar);
  }

  function ligarAbertura() {
    var botao = document.querySelector("[data-open-card]");
    if (!botao) return;
    botao.addEventListener("click", function () {
      window.Reveal.next();
      window.setTimeout(function () {
        var slide = window.Reveal.getCurrentSlide();
        if (slide) {
          slide.setAttribute("tabindex", "-1");
          slide.focus({ preventScroll: true });
        }
      }, 80);
    });
  }

  try {
    iniciar();
  } catch (erro) {
    mostrarErro(
      "Algo deu errado ao abrir esta carta. Recarregue a página ou avise a turma."
    );
    if (window.console && console.error) console.error(erro);
  }
})();
