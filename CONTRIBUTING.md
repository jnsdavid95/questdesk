# Relatos, sugestões e contribuições

O mantenedor é [Jonas David Kosniyzeko](https://github.com/jnsdavid95). QuestDesk possui código proprietário; enviar uma sugestão não altera sua licença.

## Relatar um problema

Abra uma issue com a versão do QuestDesk, sistema operacional, passos para reproduzir, comportamento esperado e comportamento observado. Capturas de tela e mensagens de erro ajudam. Remova nomes de tarefas, compromissos, chaves de API e outros dados pessoais antes de compartilhar.

## Propor uma mudança

Descreva o problema e a solução em uma issue antes de enviar código. Contribuições de código ficam sujeitas ao acordo prévio com o mantenedor sobre escopo e direitos de uso; não há transferência automática de direitos descrita neste documento.

## Verificação local

```bash
npm ci
npm test
npm run assets:check
npm run build
```

Mudanças na persistência precisam preservar os saves anteriores. Novas peças LPC precisam de ID estável, licença, créditos, compatibilidade e conferência visual. Não inclua dependências instaladas, builds, saves ou credenciais nos commits.
