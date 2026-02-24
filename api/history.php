<?php
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM exchange_history ORDER BY timestamp DESC");
    $history = $stmt->fetchAll();
    sendResponse($history);
} catch (PDOException $e) {
    sendResponse(["error" => "Erro ao buscar histórico: " . $e->getMessage()], 500);
}
