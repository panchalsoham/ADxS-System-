<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Load PHPMailer

// Database connection
$conn = new mysqli("localhost", "root", "", "adx_database.sql");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Sanitize email
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['message' => 'Invalid email']);
    exit;
}

// Check if user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['message' => 'Email not found']);
    exit;
}

// Generate token
$token = bin2hex(random_bytes(32));
$expiry = date("Y-m-d H:i:s", strtotime("+1 hour"));

// Store token
$stmt = $conn->prepare("UPDATE users SET reset_token=?, token_expiry=? WHERE email=?");
$stmt->bind_param("sss", $token, $expiry, $email);
$stmt->execute();

// Send email
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'panchalsoham123@gmail.com';
    $mail->Password = 'panchal123@'; // Use Gmail App Password
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $conn = new mysqli("localhost", "adx", "panchal123@", "adx_database.sql");

    $mail->Username = 'panchalsoham123@gmail.com';
    $mail->Password = 'panchal123@';
    $mail->setFrom('panchalsoham123@gmail.com', 'ADxS');
    $mail->addAddress($email);
    $mail->Body = "<a href='http://yourdomain.com/reset-password.php?token=$token'>Reset</a>";
    

    $mail->send();
    echo json_encode(['message' => 'Reset email sent!']);
} catch (Exception $e) {
    echo json_encode(['message' => 'Email sending failed: ' . $mail->ErrorInfo]);
}
