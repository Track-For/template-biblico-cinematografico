# Playbook — da referência ao projeto

## Níveis
- **Essential:** FadeUp, TextReveal, StaggerGrid; custo baixo.
- **Premium:** + ParallaxImage, ImageClipReveal, PinnedStory, marquee selecionado; cuidado com pinning.
- **Experimental:** + R3F e fragment shaders, page transitions, meshes, FBO; suporte visual estático necessário.

## Exemplos de prompts para Codex

### Site imobiliário premium
"Leia AGENTS.md. Crie hero com revelação de linhas, galeria com máscara e parallax suave. Use `TextReveal`, `ImageClipReveal`, `ParallaxImage`, e apenas um `PinnedStory` para apresentação do empreendimento. Mobile: remova pin e reduza deslocamento. Priorize velocidade e formulário de contato."

### Loja de moda
"Leia AGENTS.md. Introduza editorial image reveal e stagger nos cards, CTA magnético apenas com mouse e transição suave entre estados. Não atrapalhe compra, filtros, carrinho ou checkout."

### Site de branding experimental
"Leia AGENTS.md e catálogo. Crie hero com imagem WebGL em distorção baixa, seguindo movimento ou scroll, usando um único canvas e fallback responsivo. Mantenha copy e CTA em HTML acessível."

## Checklist de QA
- `npm run typecheck` e `npm run build`
- Navegação por teclado sem dependência do mouse
- Redução de movimento habilitada nas preferências do SO
- Mobile de baixa potência / touch
- Chrome, Safari, Firefox; navegadores sem WebGL
- Imagens com `alt` e links/CTAs semanticamente corretos
- Verificar CLS / LCP e não ocultar conteúdo crítico
