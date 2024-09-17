<?php
// Enable error reporting for debugging purposes
ini_set('display_errors', 1); // Display errors to help with debugging
ini_set('display_startup_errors', 1); // Display startup errors
error_reporting(E_ALL); // Report all types of errors

// Include the database connection file
require_once 'db.php'; // This file contains the database connection code

// Check if the form was submitted via POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and retrieve the input values from the POST request
    $usernameOrEmail = htmlspecialchars($_POST['uname']); // Sanitize input to prevent XSS attacks; retrieve username or email
    $password = htmlspecialchars($_POST['psw']); // Sanitize input to prevent XSS attacks; retrieve password

    // Prepare an SQL statement to fetch user data from the database
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ? OR email = ?");
    // Bind the input parameters to the SQL statement
    $stmt->bind_param("ss", $usernameOrEmail, $usernameOrEmail);
    // Execute the SQL statement
    $stmt->execute();
    // Store the result of the query
    $stmt->store_result();

    // Check if a user was found
    if ($stmt->num_rows > 0) {
        // Bind the result columns to PHP variables
        $stmt->bind_result($id, $hashed_password);
        // Fetch the result into the PHP variables
        $stmt->fetch();

        // Verify the provided password against the hashed password in the database
        if (password_verify($password, $hashed_password)) {
            // Start a new session or resume the existing session
            session_start();
            // Store the user ID in the session
            $_SESSION['user_id'] = $id;
            // Redirect the user to the dashboard page
            header("Location: dashboard.html");
            exit(); // Terminate the script after redirection
        } else {
            // If password verification fails, show an error message and redirect to the login page
            echo '<script>
                alert("Invalid username, email, or password.");
                window.location.href="login.html";
            </script>';
        }
    } else {
        // If no user was found, show an error message and redirect to the login page
        echo '<script>
        alert("This account has not been found.");
        window.location.href="login.html";
    </script>';
    }

    // Close the statement and the database connection
    $stmt->close();
    $conn->close();
}
?>
