# Instalação, atualização e dados

## Windows x64

Abra `QuestDesk-Setup-0.4.0-windows-x64.exe` e siga o assistente em português. O instalador desta entrega usa `%LOCALAPPDATA%\Programs\QuestDesk`, cria uma pasta no menu Iniciar e registra a desinstalação nas configurações de aplicativos. Não requer Node.js.

O pacote ainda não é assinado digitalmente. Instalação, execução e desinstalação precisam de teste em Windows real. Para atualizar, feche o QuestDesk e faça backup do progresso antes de executar um novo instalador. A atualização entre versões ainda não foi validada.

## Bazzite / Linux x86_64

Baixe `QuestDesk-0.4.0-linux-x86_64.AppImage`. No gerenciador de arquivos, permita sua execução nas propriedades. Também é possível usar:

```bash
chmod +x QuestDesk-0.4.0-linux-x86_64.AppImage
./QuestDesk-0.4.0-linux-x86_64.AppImage
```

O runtime utilizado dispensa FUSE2. Para integrar ao menu, use Gear Lever, disponível no Bazaar do Bazzite. Mantenha o arquivo na pasta gerenciada pelo Gear Lever ou em um local permanente. Não exige Node.js nem instalação de um RPM sobre a base do sistema.

Para atualizar manualmente, feche o aplicativo e substitua o AppImage por uma versão nova. Não há atualização automática configurada. A abertura no Bazzite do usuário ainda precisa de validação.

Referência: https://docs.bazzite.gg/Installing_and_Managing_Software/AppImage/

## Progresso e backup

O Electron grava `questdesk-v1.json` no diretório de usuário retornado por `app.getPath('userData')`. Normalmente:

- Windows: `%APPDATA%\questdesk\questdesk-v1.json`.
- Linux: `~/.config/questdesk/questdesk-v1.json`, ou o equivalente de `$XDG_CONFIG_HOME`.

Feche o aplicativo antes de copiar o arquivo. Guarde o backup em outra pasta. Não há sincronização ou backup automático entre computadores. A desinstalação do pacote remove os arquivos de instalação; o progresso fica no diretório de dados separado.

No navegador de desenvolvimento, o progresso fica em `localStorage`, na chave `questdesk.v1`. Ele não é compartilhado automaticamente com a versão desktop.

## Diagnóstico

Se o app não abrir, informe o sistema, a versão e a mensagem apresentada. No Linux, abrir pelo terminal ajuda a capturar o erro. Não apague o save para tentar corrigir uma falha. Dados ilegíveis geram erro e devem ser preservados para recuperação.
