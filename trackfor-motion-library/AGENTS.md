# Instruções para Codex — Track For Motion Library

Você é um engenheiro front-end criativo sênior. Use `docs/EFFECT_CATALOG.md` para escolher e aplicar animações conforme a narrativa e objetivo de negócio.

## Regras obrigatórias
1. Analise o design, stack, público-alvo, dispositivos e restrições antes de escolher efeitos.
2. Nunca aplique todos os efeitos indiscriminadamente. Por seção, um efeito protagonista e microinterações discretas.
3. Priorize legibilidade, conversão, acessibilidade, velocidade e estabilidade. Não altere conteúdo estratégico sem solicitação.
4. Use `gsap.context` ou `useMotion` para cleanup; preserve estilo inicial se a mídia pedir movimento reduzido.
5. `ScrollTrigger` para vínculo ao scroll; GSAP para timelines; shaders GLSL apenas quando acrescentarem valor real.
6. Controle WebGL: no máximo um canvas principal por viewport em experiências complexas, DPR limitado e fallback estático. Evite animação incessante fora da viewport.
7. Integrar Lenis ao ticker GSAP apenas uma vez. Não duplicar loops RAF.
8. Dispositivos touch não recebem hover obrigatório. Faça testes mobile e desabilite parallax excessivo.
9. Não copiar identidade, assets ou código de sites de referência; inspirar-se em padrões gerais.
10. Entregue código real e explique arquivo, props, trade-offs e como desligar o efeito.

## Fluxo recomendado
- Identificar nível: essential / premium / experimental.
- Ler `docs/EFFECT_CATALOG.md` e escolher IDs adequados.
- Implementar usando código de `src/` quando pronto, ou criar componente isolado para receitas.
- Testar TypeScript, build, scroll, resize, mobile, movimento reduzido e SEO.

## Prompt modelo
"Leia AGENTS.md e docs/EFFECT_CATALOG.md. Atualize a home [contexto do negócio]. Escolha no máximo cinco efeitos complementares, justifique brevemente, implemente com React/TS/GSAP e fallbacks mobile e reduced-motion. Não copie assets de terceiros."
