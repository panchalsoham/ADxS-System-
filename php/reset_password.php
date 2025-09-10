<?php
$conn = new mysqli("localhost", "root", "", "your_database_name");
if ($conn->connect_error) die("Connection failed");

$token = $_GET['token'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("UPDATE users SET password=?, reset_token=NULL, token_expiry=NULL WHERE reset_token=? AND token_expiry > NOW()");
    $stmt->bind_param("ss", $password, $token);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo "Password reset successful. <a href='login.html'>Login</a>";
    } else {
        echo "Invalid or expired token.";
    }
    exit;
}

// Show form if token is valid
$stmt = $conn->prepare("SELECT * FROM users WHERE reset_token=? AND token_expiry > NOW()");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "Invalid or expired token.";
    exit;
}
?>

<!DOCTYPE html>
<html>
<head><title>Reset Password</title></head>
<body>
    <h2>Set New Password</h2>
    <form method="POST">
        <input type="password" name="password" required placeholder="New password" />
        <button type="submit">Reset Password</button>
    </form>
</body>
</html>
