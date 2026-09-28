Unicode true
!include "MUI2.nsh"
!include "LogicLib.nsh"

!define APP_NAME "QuestDesk"
!define APP_VERSION "0.4.0"
!define APP_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\QuestDesk"

Name "${APP_NAME} ${APP_VERSION}"
OutFile "../release/QuestDesk-Setup-0.4.0-windows-x64.exe"
InstallDir "$LOCALAPPDATA\Programs\QuestDesk"
RequestExecutionLevel user
SetCompressor /SOLID lzma
Icon "../build/questdesk-nsis.ico"
UninstallIcon "../build/questdesk-nsis.ico"
BrandingText "QuestDesk"
VIProductVersion "0.4.0.0"
VIAddVersionKey "ProductName" "QuestDesk"
VIAddVersionKey "FileDescription" "Instalador do QuestDesk"
VIAddVersionKey "FileVersion" "0.4.0.0"
VIAddVersionKey "ProductVersion" "0.4.0.0"

!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\QuestDesk.exe"
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "PortugueseBR"

Section "Instalar" SEC_MAIN
  SetShellVarContext current
  SetOutPath "$INSTDIR"
  File /r "../release/win-unpacked/*"
  WriteUninstaller "$INSTDIR\Desinstalar QuestDesk.exe"

  CreateDirectory "$SMPROGRAMS\QuestDesk"
  CreateShortCut "$SMPROGRAMS\QuestDesk\QuestDesk.lnk" "$INSTDIR\QuestDesk.exe" "" "$INSTDIR\QuestDesk.exe" 0
  CreateShortCut "$SMPROGRAMS\QuestDesk\Desinstalar QuestDesk.lnk" "$INSTDIR\Desinstalar QuestDesk.exe"

  WriteRegStr HKCU "${APP_KEY}" "DisplayName" "QuestDesk"
  WriteRegStr HKCU "${APP_KEY}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKCU "${APP_KEY}" "Publisher" "QuestDesk"
  WriteRegStr HKCU "${APP_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${APP_KEY}" "DisplayIcon" "$INSTDIR\QuestDesk.exe"
  WriteRegStr HKCU "${APP_KEY}" "UninstallString" '"$INSTDIR\Desinstalar QuestDesk.exe"'
  WriteRegDWORD HKCU "${APP_KEY}" "NoModify" 1
  WriteRegDWORD HKCU "${APP_KEY}" "NoRepair" 1
SectionEnd

Section "Uninstall"
  SetShellVarContext current
  Delete "$SMPROGRAMS\QuestDesk\QuestDesk.lnk"
  Delete "$SMPROGRAMS\QuestDesk\Desinstalar QuestDesk.lnk"
  RMDir "$SMPROGRAMS\QuestDesk"
  DeleteRegKey HKCU "${APP_KEY}"
  RMDir /r "$INSTDIR"
SectionEnd
