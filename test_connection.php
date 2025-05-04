<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Database Connection Test</h1>";

$servername = "127.0.0.1"; 
$username = "root"; 
$password = ""; 
$dbname = "hackathon";

echo "<p>Attempting to connect to database: <strong>{$dbname}</strong> on server: <strong>{$servername}</strong></p>";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("<p style='color: red;'>Connection failed: " . $conn->connect_error . "</p>");
}

echo "<p style='color: green;'>Connected successfully to the database.</p>";

echo "<h2>Tables in '{$dbname}' database:</h2>";
$tables = $conn->query("SHOW TABLES");

if ($tables->num_rows > 0) {
    echo "<ul>";
    while($table = $tables->fetch_array()) {
        echo "<li>{$table[0]}</li>";
        
        if($table[0] == 'users') {
            echo "<h3>Structure of 'users' table:</h3>";
            $columns = $conn->query("DESCRIBE users");
            
            echo "<table border='1' cellpadding='5'>";
            echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
            
            while($column = $columns->fetch_assoc()) {
                echo "<tr>";
                echo "<td>{$column['Field']}</td>";
                echo "<td>{$column['Type']}</td>";
                echo "<td>{$column['Null']}</td>";
                echo "<td>{$column['Key']}</td>";
                echo "<td>{$column['Default']}</td>";
                echo "<td>{$column['Extra']}</td>";
                echo "</tr>";
            }
            
            echo "</table>";
            
            $count = $conn->query("SELECT COUNT(*) AS count FROM users");
            $count_result = $count->fetch_assoc();
            echo "<p>Number of users in table: {$count_result['count']}</p>";
            
            $users = $conn->query("SELECT id, username FROM users LIMIT 1");
            if($users->num_rows > 0) {
                $user = $users->fetch_assoc();
                echo "<p>Sample user: ID: {$user['id']}, Username: {$user['username']}</p>";
            }
        }
    }
    echo "</ul>";
} else {
    echo "<p>No tables found in the database.</p>";
}

echo "<h2>PHP Information:</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p>Current Script Path: " . __FILE__ . "</p>";

$conn->close();
?> 