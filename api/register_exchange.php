<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $student_id = $data['student_id'] ?? null;
    $in_code = $data['in_uniform_code'] ?? null;
    $in_size = $data['in_uniform_size'] ?? null;
    $out_code = $data['out_uniform_code'] ?? null;
    $out_size = $data['out_uniform_size'] ?? null;

    if (!$student_id || !$in_code || !$in_size || !$out_code || !$out_size) {
        sendResponse(["error" => "Dados incompletos."], 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO exchange_history (student_id, in_uniform_code, in_uniform_size, out_uniform_code, out_uniform_size) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$student_id, $in_code, $in_size, $out_code, $out_size]);

        $id = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM exchange_history WHERE id = ?");
        $stmt->execute([$id]);
        $exchange = $stmt->fetch();

        sendResponse(["message" => "Troca registrada com sucesso!", "exchange" => $exchange], 201);
    } catch (PDOException $e) {
        sendResponse(["error" => "Erro ao registrar troca: " . $e->getMessage()], 500);
    }
}
