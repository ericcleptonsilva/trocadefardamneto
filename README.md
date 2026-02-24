# Registro de Troca de Fardamento

Sistema para registro de trocas de fardamento escolar.

## Tecnologias
- Backend: Flask, SQLAlchemy, FPDF2
- Frontend: React (Vite), Axios, Lucide-React

## Como Executar

### Backend
1. Instale as dependências: `pip install -r requirements.txt`
2. Execute o servidor: `python app.py`

### Frontend
1. Entre na pasta: `cd frontend`
2. Instale as dependências: `npm install`
3. Execute o servidor de desenvolvimento: `npm run dev`

O frontend estará disponível em `http://localhost:5173` e fará proxy das requisições para o backend em `http://localhost:5000`.

## Importação de Dados
Você pode importar um catálogo de fardamentos via arquivo CSV com as colunas `code` e `size`.
