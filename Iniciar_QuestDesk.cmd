@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 24 LTS em https://nodejs.org e abra este arquivo novamente.
  pause
  exit /b 1
)
if not exist "node_modules\electron\dist\electron.exe" (
  echo Instalando dependencias do QuestDesk. Esta etapa precisa de internet.
  call npm ci
  if errorlevel 1 (
    echo Falha na instalacao. Consulte a mensagem acima e tente novamente.
    pause
    exit /b 1
  )
)
call npm run desktop
if errorlevel 1 (
  echo Nao foi possivel abrir o app. Para testar a interface, execute npm run dev.
  pause
  exit /b 1
)
