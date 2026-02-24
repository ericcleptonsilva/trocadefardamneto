<?php
$db_path = __DIR__ . '/../instance/uniforms.db';
if (!file_exists(dirname($db_path))) {
    mkdir(dirname($db_path), 0777, true);
}

try {
    $pdo = new PDO('sqlite:' . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Uniforms table
    $pdo->exec("CREATE TABLE IF NOT EXISTS uniform (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        size TEXT NOT NULL,
        UNIQUE(code, size)
    )");

    // Exchange History table
    $pdo->exec("CREATE TABLE IF NOT EXISTS exchange_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        in_uniform_code TEXT NOT NULL,
        in_uniform_size TEXT NOT NULL,
        out_uniform_code TEXT NOT NULL,
        out_uniform_size TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    echo "Banco de dados inicializado com sucesso.\n";
} catch (PDOException $e) {
    die("Erro ao inicializar banco de dados: " . $e->getMessage());
}
