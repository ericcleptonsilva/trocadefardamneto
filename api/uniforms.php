<?php
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM uniform");
    $uniforms = $stmt->fetchAll();
    sendResponse($uniforms);
} catch (PDOException $e) {
    sendResponse(["error" => "Erro ao buscar catálogo: " . $e->getMessage()], 500);
}
