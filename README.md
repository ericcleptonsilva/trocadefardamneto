# Registro de Troca de Fardamento

Sistema para registro de trocas de fardamento escolar.

## Funcionalidades
- Registro de troca (Entrada/Saída de fardamento).
- Gerenciamento de catálogo (Importação via CSV).
- Histórico completo de transações.
- Exportação de histórico para PDF.

## Tecnologias
- **Backend:** PHP (API), SQLite
- **Frontend:** React (Vite), Axios, Lucide-React
- **Relatórios:** FPDF

## Como Executar

### Backend (PHP)
1. Certifique-se de ter o PHP e o Composer instalados.
2. Entre na pasta `api/`:
   ```bash
   cd api
   composer install
   ```
3. Inicialize o banco de dados (SQLite):
   ```bash
   php init_db.php
   ```
4. Inicie o servidor PHP (ou use XAMPP/Apache apontando para a pasta `api/`):
   ```bash
   php -S 127.0.0.1:8000
   ```

### Frontend (React)
1. Entre na pasta `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. O sistema estará disponível em `http://localhost:5173`.

> **Nota:** O frontend está configurado para fazer proxy para `http://127.0.0.1:8000`. Se você estiver usando XAMPP na porta padrão (80), altere a configuração de `proxy` em `frontend/vite.config.js`.

## Importação de Dados
O sistema permite importar um catálogo de fardamentos (Código e Tamanho) via arquivo CSV. O arquivo deve conter os cabeçalhos `code` e `size`.
