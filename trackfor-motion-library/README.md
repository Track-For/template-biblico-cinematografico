# Track For Motion Library — Codex Edition

Biblioteca autoral de efeitos cinematográficos, inspirada em padrões de interação de sites experimentais e do Awwwards. **Não é uma extração de código do Awwwards nem do site Sphere.**

## Início rápido
```bash
npm install
npm run dev
npm run typecheck
```

## Usar no projeto existente
1. Copie `src/effects`, `src/shaders`, `src/components` e `src/styles/motion.css` para o seu projeto React/TS.
2. Instale as dependências de `package.json`, preservando as versões compatíveis com seu React.
3. Importe `motion.css` uma vez e os componentes desejados individualmente.
4. Para Codex: cole o `AGENTS.md` no projeto (ou mantenha o arquivo junto à biblioteca) e consulte `docs/EFFECT_CATALOG.md`.

```tsx
import { TextReveal, ParallaxImage } from './effects/ScrollEffects';
import { MagneticButton } from './effects/InteractiveEffects';
<TextReveal as="h1">Arquitetura extraordinária.</TextReveal>
<ParallaxImage src="/images/hero.webp" alt="Projeto de arquitetura" />
<MagneticButton>Conhecer projeto</MagneticButton>
```

## O que funciona imediatamente
`FadeUp`, `TextReveal`, `ParallaxImage`, `ImageClipReveal`, `StaggerGrid`, `PinnedStory`, `HorizontalScroll`, `ScrollProgress`, `Marquee`, `ScaleOnScroll`, `MagneticButton`, `CursorFollower`, `TiltCard`, `SmoothScroll`, `ImageDistortion` (WebGL).

## O que é receita para o Codex, e não componente pronto
Consulte o catálogo com dezenas de técnicas avançadas (transições de páginas, morphing, partículas, liquid distortion, render passes etc.). Cada receita deve ser implementada e testada para o contexto.

## Precauções
- Efeitos complexos exigem testes reais em Safari/iOS e Android; não são garantia automática de performance.
- Em `ImageDistortion`, use um recurso local ou URL com CORS corretamente configurado. WebGL pode falhar em dispositivos antigos.
- Nunca instancie smooth scroll duas vezes; `SmoothScroll` fica no topo do app.
- Evite `pin` aninhado, animação de layout dispendiosa e bloquear elementos interativos.
- Respeite `prefers-reduced-motion`, teclado, foco, semântica HTML e textos legíveis.
- Ao usar Next.js App Router, coloque componentes animados em arquivos `use client` e carregue WebGL no cliente.
