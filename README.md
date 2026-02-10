# Controle de Fardamento (Uniform Exchange)

Este projeto é um sistema de gerenciamento de troca de fardamentos, composto por um frontend em React e um backend em PHP, projetado para rodar com XAMPP e MySQL.

## Estrutura do Projeto

- `backend/`: Código PHP da API.
- `frontend/`: Código React do frontend.
- `backend/database.sql`: Script SQL para criar o banco de dados.

## Pré-requisitos

1.  **XAMPP**: Para rodar o servidor Apache e MySQL.
2.  **Node.js**: Para instalar e construir o frontend React.

## Configuração do Backend (XAMPP)

1.  Copie a pasta do projeto para dentro do diretório `htdocs` do XAMPP (ex: `C:\xampp\htdocs\uniform-exchange`).
2.  Inicie o Apache e o MySQL no painel de controle do XAMPP.
3.  Acesse `http://localhost/phpmyadmin`.
4.  Crie um novo banco de dados chamado `uniforms_exchange`.
5.  Importe o arquivo `backend/database.sql` para criar as tabelas.
6.  Verifique o arquivo `backend/db.php` se as credenciais do banco estão corretas (padrão: usuário `root`, senha vazia).

## Configuração do Frontend

1.  Abra um terminal na pasta `frontend`.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  O frontend estará acessível em `http://localhost:5173`.

> **Nota:** O frontend está configurado para buscar a API em `http://localhost:8000` (porta padrão do servidor embutido do PHP). Se estiver usando XAMPP na porta 80, você pode precisar ajustar o `frontend/vite.config.js` para apontar para `http://localhost/uniform-exchange/backend` ou configurar o proxy adequadamente.

## Formato do CSV para Importação

Para importar fardamentos, o arquivo CSV deve ter o seguinte formato (com cabeçalho):

```csv
code,size
CAMISA-M,M
CAMISA-G,G
CALCA-40,40
```

As colunas obrigatórias são `code` (código do fardamento) e `size` (tamanho).

## Funcionalidades

- **Registrar Troca**: Formulário para registrar a troca de um fardamento por um aluno.
- **Histórico**: Visualização das trocas realizadas.
- **Importar Fardamentos**: Importação em massa via CSV.
- **Exportar PDF**: Gera um relatório em PDF do histórico de trocas.
