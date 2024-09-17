<?php
// Define the server name, username, password, and database name for the MySQL connection
$servername = "localhost"; // The hostname where the MySQL server is located (usually 'localhost' for local servers)
$username = "root";       // The username used to connect to the MySQL server
$password = "";           // The password for the MySQL user (empty here for default root user)
$dbname = "mobileapp";    // The name of the database to connect to

// Create a new MySQLi object to establish a connection to the MySQL server
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    // If there is a connection error, output the error message and terminate the script
    die("Connection failed: " . $conn->connect_error);
}

// The script will continue executing if the connection is successful
?>

