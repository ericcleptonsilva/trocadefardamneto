<?php
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['file']['tmp_name'];

if (($handle = fopen($file, "r")) !== FALSE) {
    // Read header row
    $header = fgetcsv($handle);

    // Normalize header to lowercase and trim
    $header = array_map('trim', $header);
    $header = array_map('strtolower', $header);

    $code_index = array_search('code', $header);
    $size_index = array_search('size', $header);

    if ($code_index === false || $size_index === false) {
        // Fallback: assume column 0 is code, 1 is size if headers not found
        // But if headers are present but different names, this might be risky.
        // Let's just stick to index 0 and 1 if we can't find names, or error out.
        // Given the prompt, let's try to be smart.
        $code_index = 0;
        $size_index = 1;
    }

    $imported_count = 0;

    $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM uniforms WHERE code = ?");
    $stmt_insert = $pdo->prepare("INSERT INTO uniforms (code, size) VALUES (?, ?)");

    while (($data = fgetcsv($handle)) !== FALSE) {
        // Skip empty rows
        if (empty($data) || (count($data) == 1 && $data[0] == null)) {
            continue;
        }

        $code = isset($data[$code_index]) ? trim($data[$code_index]) : null;
        $size = isset($data[$size_index]) ? trim($data[$size_index]) : null;

        if ($code && $size) {
            // Check if exists
            $stmt_check->execute([$code]);
            if ($stmt_check->fetchColumn() == 0) {
                try {
                    $stmt_insert->execute([$code, $size]);
                    $imported_count++;
                } catch (Exception $e) {
                    // Ignore specific insert errors, continue
                }
            }
        }
    }
    fclose($handle);

    http_response_code(201);
    echo json_encode(["message" => "Imported $imported_count uniforms"]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Could not read file']);
}
?>
