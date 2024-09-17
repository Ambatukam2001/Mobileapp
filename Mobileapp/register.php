<?php
// Enable error reporting for debugging
ini_set('display_errors', 1); // Display errors to help with debugging
ini_set('display_startup_errors', 1); // Display startup errors to help diagnose issues
error_reporting(E_ALL); // Report all types of errors for thorough debugging

// Include database connection
require_once 'db.php'; // Include the file that contains the database connection setup

// Check if the form was submitted using the POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize the input values from the POST request
    $username = htmlspecialchars($_POST['uname']); // Sanitize the username to prevent XSS attacks
    $email = htmlspecialchars($_POST['email']); // Sanitize the email to prevent XSS attacks
    $password = htmlspecialchars($_POST['psw']); // Sanitize the password to prevent XSS attacks

    // Prepare an SQL statement to check if the username or email already exists in the database
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    // Bind the input parameters to the SQL query
    $stmt->bind_param("ss", $username, $email);
    // Execute the SQL query
    $stmt->execute();
    // Store the result set for further processing
    $stmt->store_result();

    // Check if any records were found with the provided username or email
    if ($stmt->num_rows > 0) {
        // Display an alert message and redirect the user back to the registration page
        echo '<script>
            alert("Username or email already taken."); // Inform the user that the username or email is already in use
            window.location.href="register.html"; // Redirect the user to the registration page
        </script>';
        exit(); // Stop further script execution
    }

    // Hash the password securely using bcrypt
    $hashed_password = password_hash($password, PASSWORD_BCRYPT); // Create a hashed version of the password for secure storage

    // Prepare an SQL statement to insert the new user into the database
    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    // Bind the sanitized input values and hashed password to the SQL query
    $stmt->bind_param("sss", $username, $email, $hashed_password);

    // Execute the SQL query to insert the new user
    if ($stmt->execute()) {
        // Display a success message and redirect the user to the login page
        echo '<script>
            alert("Registration successful!"); // Inform the user of successful registration
            window.location.href="login.html"; // Redirect the user to the login page
        </script>';
        exit(); // Stop further script execution
    } else {
        // If there was an error executing the query, display the error message
        echo "Error: " . $stmt->error; // Output the error message from the SQL statement
    }

    // Close the prepared statement and database connection
    $stmt->close(); // Free up resources associated with the prepared statement
    $conn->close(); // Close the database connection
}
?>
