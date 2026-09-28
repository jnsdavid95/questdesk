# Créditos e avisos de terceiros

O código próprio do QuestDesk é proprietário de Jonas David Kosniyzeko. Os componentes abaixo mantêm seus titulares e termos originais.

## Universal LPC

Sprites obtidos do [Universal LPC Spritesheet Character Generator](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator), revisão `4963a69795255fb15a934c47f478a8bdcf3668f5`.

- 57 PNGs originais; catálogo inicial de 20 equipamentos.
- Autores, fontes e licença selecionada por asset: [credits.json](public/lpc/credits.json).
- Integridade e caminho de origem: [manifest.json](public/lpc/manifest.json).
- Licenças selecionadas: [CC0 1.0](public/lpc/CC0-1.0.txt), [CC BY 3.0](public/lpc/CC-BY-3.0.txt) e [CC BY-SA 3.0](public/lpc/CC-BY-SA-3.0.txt).
- Não foi incorporado o código GPL do gerador. O compositor foi implementado no QuestDesk.
- As paletas são aplicadas em memória. Arte derivada sujeita a ShareAlike mantém os respectivos termos; nenhuma restrição proprietária do QuestDesk é aplicada a esses elementos ou a seus créditos.

## Fonte

Pixelify Sans: [SIL Open Font License 1.1](src/assets/PIXELIFY-LICENSE.txt). Arquivo local em `src/assets/pixelify-latin-600.woff2`.

## Dependências de produção

Versões instaladas no lockfile desta entrega. Textos preservados do pacote npm:

| Componente | Versão | Licença declarada | Texto |
|---|---|---|---|
| @fullcalendar/core | 6.1.21 | MIT | [Texto](third-party/npm/@fullcalendar/core/LICENSE.md) |
| @fullcalendar/daygrid | 6.1.21 | MIT | [Texto](third-party/npm/@fullcalendar/daygrid/LICENSE.md) |
| @fullcalendar/google-calendar | 6.1.21 | MIT | [Texto](third-party/npm/@fullcalendar/google-calendar/LICENSE.md) |
| @fullcalendar/interaction | 6.1.21 | MIT | [Texto](third-party/npm/@fullcalendar/interaction/LICENSE.md) |
| @fullcalendar/list | 6.1.21 | MIT | [Texto](third-party/npm/@fullcalendar/list/LICENSE.md) |
| @fullcalendar/react | 6.1.21 | MIT | [Texto](third-party/npm/@fullcalendar/react/LICENSE.txt) |
| @fullcalendar/timegrid | 6.1.21 | MIT | [Texto](third-party/npm/@fullcalendar/timegrid/LICENSE.md) |
| ical.js | 2.2.1 | MPL-2.0 | [Texto](third-party/npm/ical.js/LICENSE) |
| lucide-react | 0.468.0 | ISC | [Texto](third-party/npm/lucide-react/LICENSE) |
| react-dom | 19.3.0 | MIT | [Texto](third-party/npm/react-dom/LICENSE) |
| react | 19.3.0 | MIT | [Texto](third-party/npm/react/LICENSE) |
| zod | 4.6.5 | MIT | [Texto](third-party/npm/zod/LICENSE) |
| preact | 10.12.1 | MIT | [Texto](third-party/npm/preact/LICENSE) |
| scheduler | 0.28.0 | MIT | [Texto](third-party/npm/scheduler/LICENSE) |

ical.js tem o código-fonte original sem modificações e licença MPL-2.0 preservados em `third-party/ical.js`. FullCalendar utiliza somente componentes Standard.

## Runtime e ferramentas

Electron e Chromium são distribuídos com seus próprios avisos nos binários empacotados (`LICENSE.electron.txt` / `LICENSE`, conforme a plataforma, e `LICENSES.chromium.html`). NSIS conserva os avisos da ferramenta. As dependências de desenvolvimento e empacotamento estão no lockfile e conservam as licenças dos seus pacotes.

## Capturas de tela

As capturas em `docs/` mostram a interface QuestDesk e elementos LPC. A autoria da interface não transfere a autoria dos sprites exibidos. Os termos e atribuições das obras representadas permanecem aplicáveis.
