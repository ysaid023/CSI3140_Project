<?php
header('Content-Type: application/json');

$host = 'localhost';
$db = 'hospital_triage';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "pgsql:host=$host;dbname=$db";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare('INSERT INTO patients (first_name, last_name, severity, time_added) VALUES (?, ?, ?, ?)');
    $stmt->execute([$data['firstName'], $data['lastName'], $data['severity'], $data['timeAdded']]);
    echo json_encode(['status' => 'success']);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT * FROM patients ORDER BY severity DESC, time_added ASC');
    $patients = $stmt->fetchAll();
    echo json_encode($patients);
}
?>