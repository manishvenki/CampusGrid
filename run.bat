@echo off
setlocal
title CampusGrid — Master Runner

echo ==============================================================
echo           CAMPUSGRID — SYSTEM LAUNCHER (PHASE 1)
echo ==============================================================
echo.
echo Starting CampusGrid Backend (Port 5000)...
echo Starting CampusGrid Frontend (Port 5173)...
echo.

node "%~dp0run.js"

pause
