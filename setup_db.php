<?php

$servername = "127.0.0.1"; 
$username = "root"; 
$password = ""; 
$dbname = "hackathon";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully to the database.<br>";

$checkTable = $conn->query("SHOW TABLES LIKE 'users'");
if ($checkTable->num_rows > 0) {
    echo "The 'users' table already exists. Skipping table creation.<br>";
} else {
    $sql = "CREATE TABLE users (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )";

    if ($conn->query($sql) === TRUE) {
        echo "Table 'users' created successfully.<br>";
    } else {
        echo "Error creating table: " . $conn->error . "<br>";
        exit;
    }
}

$checkUser = $conn->query("SELECT * FROM users WHERE username = 'admin'");
if ($checkUser->num_rows > 0) {
    echo "Test user 'admin' already exists.<br>";
} else {
    $hashedPassword = password_hash("password123", PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (username, password) VALUES ('admin', '$hashedPassword')";

    if ($conn->query($sql) === TRUE) {
        echo "Test user created successfully.<br>";
        echo "Username: admin<br>";
        echo "Password: password123<br>";
    } else {
        echo "Error creating test user: " . $conn->error . "<br>";
    }
}

echo "<br>You can now log in to the application using these credentials.<br>";
echo "Make sure to delete this file after running it for security reasons.";

$conn->close();
?> 