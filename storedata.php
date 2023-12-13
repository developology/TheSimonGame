

<?php

error_log('Request Method: ' . $_SERVER['REQUEST_METHOD']);
// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    exit;
}

// Check if required data is provided
if (!isset($_POST['playerName']) || !isset($_POST['score'])) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request data']);
    exit;
}

// Get player name and score from the POST data
$playerName = $_POST['playerName'];
$score = (int) $_POST['score']; // Validate score as integer

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "Riddhi@1601"; // Replace with your actual MySQL password
$dbname = "simon";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Prepare SQL statement
$stmt = $conn->prepare("INSERT INTO player_data (player_name, score) VALUES (?, ?)");

// Bind parameters
$stmt->bind_param("ss", $playerName, $score);

// Execute statement
if ($stmt->execute()) {
    // Data stored successfully
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Data stored successfully']);
} else {
    // Error storing data
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Error storing data: ' . $conn->error
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();

?>