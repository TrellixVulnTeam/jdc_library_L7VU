@echo off
setlocal
if not defined EDITOR set EDITOR=notepad
set PATH=%~dp0bootstrap-3_8_0_chromium_8_bin\git\cmd;%~dp0;%PATH%
"%~dp0bootstrap-3_8_0_chromium_8_bin\git\cmd\git.exe" %*
