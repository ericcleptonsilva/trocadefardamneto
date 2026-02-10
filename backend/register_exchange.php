<?php
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$student_id = $input['student_id'] ?? null;
$uniform_code = $input['uniform_code'] ?? null;
$uniform_size = $input['uniform_size'] ?? null;
$reason = $input['reason'] ?? null;

if (!$student_id || !$uniform_code || !$uniform_size) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing data']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO exchange_history (student_id, uniform_code, uniform_size, reason) VALUES (?, ?, ?, ?)");
    $stmt->execute([$student_id, $uniform_code, $uniform_size, $reason]);

    // Fetch the new record
    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM exchange_history WHERE id = ?");
    $stmt->execute([$id]);
    $new_exchange = $stmt->fetch();

    http_response_code(201);
    echo json_encode([
        "message" => "Exchange registered successfully",
        "exchange" => $new_exchange
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
