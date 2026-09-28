# Validação — estado da 0.4.0

18 testes de domínio aprovados, build concluído e 57 PNGs LPC verificados. Smoke tests de interface executados em Chromium nas etapas anteriores. AppImage inspecionado e NSIS com 77 arquivos aprovado no teste de integridade. Instalação, execução e desinstalação nativas em Windows/Bazzite continuam pendentes. As seções abaixo são registros históricos e devem ser lidas com suas respectivas versões.

---

# Validação da entrega 0.1

Data: 24/09/2026.

## Executado com sucesso

- Instalação das dependências e geração de package-lock.json.
- TypeScript em modo estrito: `npm run typecheck`.
- Compilação da interface Vite e dos dois módulos Electron: `npm run build`.
- `npm test`: seis testes aprovados; nenhuma falha.
- Smoke test da interface em Chromium headless com Playwright, viewport 1440×1000.
- Criação de tarefa desafiadora, edição do título, conclusão e reabertura/reconclusão.
- Persistência após recarregar; verificação de 120 EXP e 50 Gold, sem recompensa duplicada.
- Segunda conclusão para obter saldo de 60 Gold; compra de cristal e saldo final zero.
- Navegação do inventário; troca e persistência do tema Arcano.
- Arraste real de um card da coluna Em progresso para A fazer.
- Nenhum erro JavaScript capturado no smoke test.
- Inspeção visual de `preview.png`: quadro inicial sem cortes na resolução revisada.

O teste da interface usou o adaptador de navegador (`localStorage`). Não valida o IPC ou o arquivo de dados do Electron. O roteiro de teste da UI foi executado como verificação da entrega; os testes de domínio estão incluídos no repositório.

## Pendente

- Execução nativa da janela Electron no Windows e testes da ponte IPC.
- Instalação/desinstalação via NSIS e atualização entre versões.
- Persistência desktop após reinício e cenário de arquivo corrompido.
- Testes de acessibilidade com leitor de tela e navegação completa por teclado.
- Matriz de escalas Windows, múltiplos monitores e resoluções.
- Contraste de combinações criadas pelo usuário.
- Teste prolongado com milhares de tarefas.

## Notas

O download do binário Electron foi omitido neste ambiente de preparação; `npm ci` no computador de destino faz a instalação normal. O ZIP contém fonte, lockfile, documentação, screenshot e builds JS/HTML/CSS, sem `node_modules` e sem executável Windows.

O build exibe avisos de comentários de otimização da dependência Zod. Não interrompem a compilação. Bibliotecas transitivas do empacotador também apresentam avisos de depreciação; a revisão de dependências é uma etapa anterior à distribuição pública.

## Revisão visual 0.2

Compilação TypeScript/Vite/Electron aprovada. Smoke test Chromium: três presets, salvamento e recarga do nível de ondulação, inventário, criação e conclusão de missão. Sem erros JavaScript capturados. Inspeção das telas em 1440 px e 1000 px de largura; sem rolagem horizontal na resolução mínima desktop. A arte e a fonte são locais e funcionam offline. Os limites de validação nativa Windows acima continuam válidos.

## Revisão 0.2.1 — retirada das ondas

Contornos regulares restaurados, preservando pixel art e paletas. Build aprovado; smoke test dos três temas, persistência do raio dos cantos, inventário, criação e conclusão aprovado. Screenshot principal revisado. Layout em 1000 px sem rolagem horizontal. Validação nativa Windows ainda pendente.

## Calendário 0.3

13 testes de domínio aprovados. Smoke test de agendamento, arraste real, mês/semana/lista, importação/exportação .ics, persistência e largura de 1000 px aprovado. Google foi verificado com mocks de sucesso/erro e desconexão; não houve uso de uma conta real. Limites nativos Windows permanecem.

## Personagem LPC 0.4

18 testes de domínio aprovados. Smoke test Chromium: três bases, aparência, bloqueio de equipamento, drop em conclusão, equipamento, recarga, giro/caminhada, créditos e largura de 1000 px. O teste substituiu Math.random apenas no navegador de QA para exercitar um drop; não existe esse override no produto. Dependências JavaScript instaladas; download do executável Electron Linux retornou HTTP 502, portanto execução desktop não validada.

Verificação de assets aprovada: 57 PNGs conferidos por SHA-256 e dimensões; 20 cosméticos com referências válidas; créditos e três textos de licença presentes. Build TypeScript/Vite/Electron aprovado.

## Distribuição Bazzite

AppImage x86_64 gerado pelo electron-builder 26.15.3 com Electron 44.4.5 e runtime moderno 1.0.3 (sem dependência de FUSE2); inclui ícone e entrada de menu. Compilação do projeto aprovada. A interface já teve smoke test no Chromium em etapa anterior. A execução da janela e o IPC dentro do AppImage no Bazzite precisam de teste no computador de destino.

## Instalador Windows x64

Interface e processo Electron compilados. Executável Windows x64 gerado e instalador NSIS criado pelo script `scripts/questdesk-installer.nsi`; a montagem padrão do electron-builder tentou executar o instalador com Wine, bloqueado pelo isolamento do ambiente, por isso a compilação NSIS direta foi usada. O instalador usa o diretório local do usuário, atalhos no menu Iniciar e registro de desinstalação. Testes de instalação, execução e desinstalação no Windows real continuam pendentes. Sem assinatura digital.

Validação do pacote NSIS: formato PE/NSIS identificado, 77 arquivos (incluindo `QuestDesk.exe` x64 e `resources/app.asar`), teste de extração do arquivo concluído sem erros.
