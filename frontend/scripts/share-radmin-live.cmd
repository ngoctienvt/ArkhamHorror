@echo off
rem Double-click to share over Radmin VPN in LIVE dev mode.
rem Edits in frontend update instantly without building!
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0share-radmin.ps1" dev %*
pause
