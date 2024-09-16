<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include database connection
require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = htmlspecialchars($_POST['uname']);
    $password = htmlspecialchars($_POST['psw']);

    // Fetch user from the database
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Bind the results
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        // Verify password
        if (password_verify($password, $hashed_password)) {
            session_start();
            $_SESSION['user_id'] = $id;
            header("Location: dashboard.html");
            exit();
        } else {
            echo '<script>
                alert("Invalid username or password.")
                window.location.href="login.html";
            </script>';
        }
    } else {
        echo '<script>
        alert("This account havent founded.")
        window.location.href="login.html";
    </script>';
    }

    $stmt->close();
    $conn->close();
}
?>
