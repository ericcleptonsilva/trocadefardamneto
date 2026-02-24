<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        sendResponse(["error" => "Nenhum arquivo enviado."], 400);
    }

    $file = $_FILES['file']['tmp_name'];
    $handle = fopen($file, 'r');

    // Skip header
    fgetcsv($handle);

    $count = 0;
    while (($row = fgetcsv($handle)) !== FALSE) {
        $code = $row[0] ?? null;
        $size = $row[1] ?? null;

        if ($code && $size) {
            try {
                $stmt = $pdo->prepare("INSERT OR IGNORE INTO uniform (code, size) VALUES (?, ?)");
                $stmt->execute([$code, $size]);
                if ($stmt->rowCount() > 0) {
                    $count++;
                }
            } catch (PDOException $e) {
                // Ignore errors for individual rows
            }
        }
    }
    fclose($handle);

    sendResponse(["message" => "Sucesso! $count fardamentos importados para o catálogo."], 201);
}
