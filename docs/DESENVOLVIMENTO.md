# Desenvolvimento e distribuição

## Ambiente

Node.js 24 e npm. As versões exatas estão em `package-lock.json`; use `npm ci`.

```bash
npm ci
npm test
npm run assets:check
npm run build
```

`npm run dev` abre o servidor local Vite. `npm run desktop` compila e executa o Electron. Em ambiente Linux sem sessão gráfica, a compilação pode funcionar sem que a janela possa ser testada.

## Empacotar

| Comando | Resultado |
|---|---|
| `npm run package:linux` | AppImage x86_64 com runtime 1.0.3 |
| `npm run package:win` | Instalador NSIS padrão via electron-builder; executar preferencialmente em Windows |
| `npm run package:win:cross` | App Windows x64 e NSIS direto em Linux, com `makensis` instalado |

Os resultados ficam em `release/`. O script NSIS direto está em `scripts/questdesk-installer.nsi`; a versão nele deve acompanhar `package.json`. O instalador direto usa uma pasta fixa por usuário. O assistente gerado pelo electron-builder tem configuração própria e permite escolher pasta.

## Antes de uma Release

1. Atualizar versão, changelog e notas de release.
2. Executar testes, verificação LPC e build.
3. Gerar e testar os pacotes nos sistemas de destino.
4. Conferir créditos e avisos de terceiros.
5. Anexar os instaladores e checksums à Release; manter binários fora do Git.

Os instaladores já produzidos na fase de protótipo não foram reconstruídos apenas por esta revisão documental. Novos builds incluem os avisos em recursos locais. Não anunciar validação nativa até executá-la.

## Estrutura do Git

Versionar `src`, `electron`, `public`, `tests`, `scripts`, ícones, documentação, metadados e lockfile. `node_modules`, `dist`, `desktop`, `release`, extrações do AppImage, saves e credenciais ficam ignorados. As imagens em `docs` são capturas de teste, sem dados pessoais reais de tarefas.
