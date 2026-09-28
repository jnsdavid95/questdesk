# Calendário — escopo da versão 0.3

## Biblioteca e arquitetura

FullCalendar Standard 6.1.21, com adaptador React e plugins daygrid, timegrid, list, interaction e google-calendar. Os plugins escolhidos são MIT. Nenhum módulo Premium/Scheduler foi incluído. Os pacotes usam a mesma versão no lockfile.

`calendar-model.ts` define agendamento e configurações validadas. `calendar-io.ts` converte tarefas, lê e exporta iCalendar. `CalendarPanel.tsx` liga as fontes ao FullCalendar. A agenda local usa o mesmo serviço de persistência e a mesma fila de ações do Kanban.

ical.js é usado para datas, recorrências e exportação no formato iCalendar. Sua licença MPL-2.0 e o código fonte original são distribuídos em `third-party`.

## O que funciona

| Origem | Leitura | Escrita |
|---|---|---|
| Missões QuestDesk | Datas, horários, mês/semana/lista | Formulário e arraste; salvo localmente |
| Google Calendar público | Plugin oficial, mediante ID e API key | Não implementada |
| Google/Outlook/Apple por arquivo .ics | Cópia local importada | Exportação das missões em arquivo para importação manual no destino |
| Contas privadas por OAuth | Não implementada | Não implementada |

Importar não cria missões e não concede recompensas. Reimportação do mesmo conteúdo é bloqueada; para atualizar uma cópia existente, remova-a e importe o arquivo novo. Remover uma cópia não altera o serviço de origem.

## Datas e arquivos

- Missões: data local, horário opcional e duração de 15 a 1440 minutos. Datas inválidas são rejeitadas.
- Arquivos: até cinco cópias, cada uma com até 1 MB.
- VEVENT simples, RRULE/RDATE/EXDATE e exceções de recorrência são tratados pelo ical.js; séries são expandidas para a faixa visível.
- Limites de proteção: 20 mil iterações de recorrência e 2 mil eventos por fonte/faixa. Séries muito antigas/densas podem exigir uma exportação menor; o erro é apresentado.
- Eventos com TZID precisam incluir VTIMEZONE. Fusos sem definição são rejeitados, em vez de assumir um horário possivelmente errado. UTC é aceito sem VTIMEZONE. Horários flutuantes seguem o fuso do dispositivo.
- Dia inteiro mantém data civil e término exclusivo. Missões com horário são exportadas como instantes UTC.
- VTODO, anexos, participantes, links de reunião, notificações e edições de eventos externos não são importados para as funções do app.
- A exportação é um retrato atual, não uma assinatura de calendário nem um mecanismo de resolução de conflitos.

## Configuração da agenda pública Google

O Google exige um projeto com Calendar API habilitada, uma chave adequada e um ID de agenda com acesso público. Use somente uma agenda que já tenha sido destinada a acesso público. A API key não substitui autorização de uma conta privada. O painel não aceita senha nem client secret.

A configuração é guardada no dispositivo. O plugin faz GET somente para `https://www.googleapis.com/calendar/v3/calendars/.../events`. A CSP permite esse host para conexão, sem liberar navegação ou acesso arbitrário do renderer ao sistema operacional. O botão Atualizar repete a consulta. Erros de conexão, chave ou permissão aparecem no painel; não há cache offline dos eventos Google.

A compatibilidade do projeto/chave com a origem do Electron precisa ser testada no Windows. As restrições da API key devem ser configuradas conforme a distribuição; não há credencial universal embutida neste pacote.

## Próxima etapa: contas privadas

Para Google privado: registrar aplicativo desktop no Google Cloud, configurar consentimento e OAuth com PKCE no navegador do sistema, callback local e armazenamento protegido de tokens. Para Microsoft: registrar aplicativo no Entra e integrar Microsoft Graph. Apple/iCloud exigirá fluxo próprio ou assinatura/CalDAV, conforme o escopo aprovado.

Começar com leitura e seleção explícita de agendas. A escrita bidirecional exigirá mapa de IDs, tratamento de exclusões, política de conflitos e acesso mínimo necessário. Nenhum desses fluxos está simulado como login funcional na interface atual.

## Evidências

Treze testes de domínio aprovados (incluindo os seis existentes). Smoke test Chromium: agendar, arrastar de verdade entre dias, mudar mês/semana/lista, importar/exportar ICS, persistir após recarga, remover cópia e desconectar. Google testado com respostas simuladas de sucesso e erro; conta real não conectada. Na versão 0.4.0 o instalador foi gerado; a execução nativa Windows continua pendente.

Referências consultadas em 24/09/2026:
- https://fullcalendar.io/license
- https://legacy.fullcalendar.io/v6/react
- https://legacy.fullcalendar.io/v6/google-calendar
- https://developers.google.com/identity/protocols/oauth2/native-app
