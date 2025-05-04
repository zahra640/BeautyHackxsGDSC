<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$log_file = 'auth_log.txt';
$log_message = date('Y-m-d H:i:s') . " - Request from: " . $_SERVER['REMOTE_ADDR'] . "\n";
file_put_contents($log_file, $log_message, FILE_APPEND);

$servername = "127.0.0.1"; 
$username = "root"; 
$password = ""; 
$dbname = "hackathon";

file_put_contents($log_file, date('Y-m-d H:i:s') . " - Attempting to connect to database: $dbname\n", FILE_APPEND);

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    file_put_contents($log_file, date('Y-m-d H:i:s') . " - Connection failed: " . $conn->connect_error . "\n", FILE_APPEND);
    die(json_encode([
        "success" => false,
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

file_put_contents($log_file, date('Y-m-d H:i:s') . " - Connected successfully\n", FILE_APPEND);

$raw_data = file_get_contents('php://input');
file_put_contents($log_file, date('Y-m-d H:i:s') . " - Raw request data: " . $raw_data . "\n", FILE_APPEND);

$data = json_decode($raw_data, true);
$action = isset($data['action']) ? $data['action'] : '';

file_put_contents($log_file, date('Y-m-d H:i:s') . " - Action: " . $action . "\n", FILE_APPEND);

if ($action === 'login') {
    $username = isset($data['username']) ? $conn->real_escape_string($data['username']) : '';
    $password = isset($data['password']) ? $data['password'] : '';
    
    file_put_contents($log_file, date('Y-m-d H:i:s') . " - Login attempt for username: " . $username . "\n", FILE_APPEND);
    
    if (empty($username) || empty($password)) {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - Empty username or password\n", FILE_APPEND);
        echo json_encode([
            "success" => false,
            "message" => "Username and password are required"
        ]);
        exit();
    }
    
    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    
    if ($result === false) {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - SQL Error: " . $conn->error . "\n", FILE_APPEND);
        echo json_encode([
            "success" => false,
            "message" => "Database error: " . $conn->error
        ]);
        exit();
    }
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - User found, checking password\n", FILE_APPEND);
        
        if (password_verify($password, $user['password'])) {
            file_put_contents($log_file, date('Y-m-d H:i:s') . " - Password verified, login successful\n", FILE_APPEND);
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "user" => [
                    "username" => $user['username']
                ]
            ]);
        } else {
            file_put_contents($log_file, date('Y-m-d H:i:s') . " - Invalid password\n", FILE_APPEND);
            echo json_encode([
                "success" => false,
                "message" => "Invalid password"
            ]);
        }
    } else {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - User not found\n", FILE_APPEND);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
    }
} else if ($action === 'register') {
    $username = isset($data['username']) ? $conn->real_escape_string($data['username']) : '';
    $password = isset($data['password']) ? $data['password'] : '';
    
    file_put_contents($log_file, date('Y-m-d H:i:s') . " - Registration attempt for username: " . $username . "\n", FILE_APPEND);
    
    if (empty($username) || empty($password)) {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - Empty username or password\n", FILE_APPEND);
        echo json_encode([
            "success" => false,
            "message" => "Username and password are required"
        ]);
        exit();
    }
    
    $check_sql = "SELECT * FROM users WHERE username = '$username'";
    $check_result = $conn->query($check_sql);
    
    if ($check_result === false) {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - SQL Error: " . $conn->error . "\n", FILE_APPEND);
        echo json_encode([
            "success" => false,
            "message" => "Database error: " . $conn->error
        ]);
        exit();
    }
    
    if ($check_result->num_rows > 0) {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - Username already exists\n", FILE_APPEND);
        echo json_encode([
            "success" => false,
            "message" => "Username already exists"
        ]);
        exit();
    }
    
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $insert_sql = "INSERT INTO users (username, password) VALUES ('$username', '$hashed_password')";
    
    if ($conn->query($insert_sql) === TRUE) {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - Registration successful\n", FILE_APPEND);
        echo json_encode([
            "success" => true,
            "message" => "Registration successful"
        ]);
    } else {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - Registration error: " . $conn->error . "\n", FILE_APPEND);
        echo json_encode([
            "success" => false,
            "message" => "Error: " . $conn->error
        ]);
    }
} else {
    file_put_contents($log_file, date('Y-m-d H:i:s') . " - Invalid action\n", FILE_APPEND);
    echo json_encode([
        "success" => false,
        "message" => "Invalid action"
    ]);
}

$conn->close();
?> 