@echo off
rem Double-click to share over Radmin VPN. Rebuilds frontend and runs server.
rem Args: rebuild (default) | start | serve (skip build) | stop | status
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0share-radmin.ps1" %*
pause
