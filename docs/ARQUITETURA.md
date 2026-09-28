# Arquitetura da versão 0.4.0

## Componentes

| Área | Arquivos principais | Responsabilidade |
|---|---|---|
| Interface | `src/App.tsx`, `src/styles.css` | Navegação, Kanban, inventário e temas |
| Domínio | `src/domain.ts` | Estado, ações, validação e economia |
| Personagens | `src/character-model.ts`, `CharacterPanel.tsx`, `CharacterSprite.tsx` | Compatibilidade, desbloqueios e composição Canvas |
| Calendário | `src/calendar-model.ts`, `calendar-io.ts`, `CalendarPanel.tsx` | Agendamento, arquivos e fontes externas |
| Armazenamento | `src/storage.ts` | Seleção entre IPC desktop e localStorage |
| Electron | `electron/main.ts`, `electron/preload.ts` | Janela, ponte restrita e persistência em disco |
| Testes | `tests/*.test.ts` | Regras de domínio, calendário e personagem |

## Fluxo de uma ação

A interface envia uma ação pelo adaptador de armazenamento. No desktop, o processo principal valida a origem IPC, passa a ação ao redutor e grava o resultado. A UI recebe o estado atualizado e uma mensagem. O renderer não recebe acesso genérico ao sistema de arquivos.

O Electron usa `contextIsolation: true`, `nodeIntegration: false` e `sandbox: true`. Navegação da janela e abertura de novas janelas são bloqueadas. A CSP permite a fonte Google Calendar explicitamente para consultas. As garantias efetivas de sandbox também dependem do runtime de distribuição e do sistema operacional.

## Persistência

O estado usa schema Zod e formato de save v1. A gravação desktop é serializada em uma fila; o conteúdo passa por arquivo temporário e renomeação. Um arquivo ilegível não é sobrescrito silenciosamente. No navegador, a mesma lógica utiliza `localStorage` para desenvolvimento.

Campos de calendário e personagem têm valores padrão para leitura de saves anteriores. IDs de itens são estáveis. Remover ou renomear IDs exige uma migração explícita.

## Arte e animação

O compositor Canvas reúne sprites LPC locais em camadas ordenadas. Frames têm 64×64, com quatro direções e nove colunas por spritesheet. As paletas são aplicadas em memória; os PNGs originais distribuídos ficam intactos. Não há dependência do site gerador durante o uso.

## Limites

Sem servidor, login, sincronização, criptografia do save ou antitrapaça. Calendário Google público usa rede; arquivos ICS são cópias locais. Janela desktop mínima: 1000×700. A validação em navegador não substitui testes da ponte IPC, drivers gráficos e instalação nativa.
