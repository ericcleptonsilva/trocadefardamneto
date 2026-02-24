<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once 'config.php';

use Fpdf\Fpdf;

try {
    $stmt = $pdo->query("SELECT * FROM exchange_history ORDER BY timestamp DESC");
    $history = $stmt->fetchAll();

    $pdf = new Fpdf('L', 'mm', 'A4');
    $pdf->AddPage();
    $pdf->SetFont('Helvetica', 'B', 16);
    $pdf->Cell(277, 10, utf8_decode("Histórico de Troca de Fardamento"), 0, 1, 'C');
    $pdf->Ln(10);

    $pdf->SetFont('Helvetica', 'B', 10);
    $pdf->Cell(30, 10, utf8_decode("Matrícula"), 1);
    $pdf->Cell(50, 10, utf8_decode("Entrou (Cód/Tam)"), 1);
    $pdf->Cell(50, 10, utf8_decode("Saiu (Cód/Tam)"), 1);
    $pdf->Cell(40, 10, utf8_decode("Data/Hora"), 1);
    $pdf->Ln();

    $pdf->SetFont('Helvetica', '', 9);
    foreach ($history as $row) {
        $pdf->Cell(30, 10, utf8_decode($row['student_id']), 1);
        $pdf->Cell(50, 10, utf8_decode($row['in_uniform_code'] . " / " . $row['in_uniform_size']), 1);
        $pdf->Cell(50, 10, utf8_decode($row['out_uniform_code'] . " / " . $row['out_uniform_size']), 1);
        $pdf->Cell(40, 10, utf8_decode($row['timestamp']), 1);
        $pdf->Ln();
    }

    $pdf->Output('D', 'historico.pdf');
} catch (Exception $e) {
    die("Erro ao gerar PDF: " . $e->getMessage());
}
