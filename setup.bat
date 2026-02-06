@echo off
REM Fitness Tracker - Setup Script para Windows
REM Este script configura o ambiente de desenvolvimento completo

echo.
echo ============================================
echo 7 Fitness Tracker - Setup do Projeto
echo ============================================

REM Verificar se Node.js está instalado
echo.
echo Verificando dependências...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js nao encontrado. Por favor, instale Node.js 18+
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo + Node.js encontrado: %NODE_VERSION%

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X npm nao encontrado
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo + npm encontrado: %NPM_VERSION%

where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ! PostgreSQL nao encontrado. Voce pode instal-lo separadamente
) else (
    echo + PostgreSQL encontrado
)

REM Instalar dependências do backend
echo.
echo Instalando dependencias do backend...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Erro ao instalar dependencias do backend
    exit /b 1
)
echo + Backend pronto

REM Criar arquivo .env do backend
if not exist .env (
    echo ! Criando arquivo .env do backend
    copy .env.example .env
    echo Por favor, edite backend\.env com suas credenciais do PostgreSQL
)

cd ..

REM Instalar dependências do frontend
echo.
echo Instalando dependencias do frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Erro ao instalar dependencias do frontend
    exit /b 1
)
echo + Frontend pronto

REM Criar arquivo .env do frontend
if not exist .env (
    echo ! Criando arquivo .env do frontend
    copy .env.example .env
)

cd ..

echo.
echo ============================================
echo + Setup completo!
echo ============================================
echo.
echo Proximos passos:
echo 1. Configure o banco de dados PostgreSQL em backend\.env
echo 2. Inicie o backend: cd backend ^&^& npm run dev
echo 3. Em outro terminal, inicie o frontend: cd frontend ^&^& npm run dev
echo 4. Acesse http://localhost:3000
echo.
