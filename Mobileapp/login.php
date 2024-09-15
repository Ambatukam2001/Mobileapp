<?php 
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize form inputs
    $username = htmlspecialchars($_POST['uname']);
    $password = htmlspecialchars($_POST['psw']);

    // Directly redirect to dashboard.html without validation
    header("Location: dashboard.html");
    exit(); // Make sure to exit after the header call
} else {
    // Handle cases where the form was not submitted
    echo "Please submit the form.";
}
?>

