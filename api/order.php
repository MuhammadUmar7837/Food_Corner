<?php
// order.php
// Handles order submission from the frontend

// 1. Set CORS Headers and Content Type
// Allows requests from any origin during development.
// For production, replace '*' with your specific frontend domain (e.g., 'https://www.yourdomain.com').
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Added Authorization header for completeness
header("Content-Type: application/json");

// Handle preflight OPTIONS request (sent by browsers before actual POST for CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Include Database Connection
require_once 'db.php'; // Make sure db.php is in the same directory or adjust path

// 3. Get Raw POST Data and Decode JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true); // true for associative array

$response = ['success' => false, 'message' => 'An unexpected error occurred.'];

// 4. Validate Input Data
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    $response['message'] = 'Invalid JSON received.';
    echo json_encode($response);
    exit();
}

$requiredFields = ['itemId', 'name', 'phone', 'email', 'address'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        $response['message'] = ucfirst($field) . ' is required.';
        echo json_encode($response);
        exit();
    }
}

// Basic sanitization and validation
$itemId = htmlspecialchars(trim($data['itemId']));
$name = htmlspecialchars(trim($data['name']));
$phone = htmlspecialchars(trim($data['phone']));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$address = htmlspecialchars(trim($data['address']));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    $response['message'] = 'Invalid email format.';
    echo json_encode($response);
    exit();
}

// You might want more robust phone validation (regex specific to country)
if (!preg_match('/^\+?\d{10,15}$/', $phone)) {
    http_response_code(400);
    $response['message'] = 'Invalid phone number format. Please include country code if applicable.';
    echo json_encode($response);
    exit();
}


// 5. Look up Menu Item Details from Database
try {
    $stmt = $pdo->prepare("SELECT name, price FROM menu_items WHERE item_id = :itemId");
    $stmt->execute([':itemId' => $itemId]);
    $menuItem = $stmt->fetch();

    if (!$menuItem) {
        http_response_code(404); // Not Found
        $response['message'] = 'Menu item not found.';
        echo json_encode($response);
        exit();
    }

    $itemName = $menuItem['name'];
    $itemPrice = $menuItem['price'];

    // 6. Insert Order into Database
    $stmt = $pdo->prepare("INSERT INTO orders (item_id, item_name, item_price, customer_name, customer_phone, customer_email, delivery_address) VALUES (:itemId, :itemName, :itemPrice, :name, :phone, :email, :address)");

    $stmt->execute([
        ':itemId' => $itemId,
        ':itemName' => $itemName,
        ':itemPrice' => $itemPrice,
        ':name' => $name,
        ':phone' => $phone,
        ':email' => $email,
        ':address' => $address
    ]);

    // 7. Send Success Response
    if ($stmt->rowCount()) {
        http_response_code(201); // Created
        $response['success'] = true;
        $response['message'] = 'Order for ' . $itemName . ' placed successfully! Your order ID is ' . $pdo->lastInsertId() . '. We will contact you shortly.';
    } else {
        http_response_code(500); // Internal Server Error
        $response['message'] = 'Failed to insert order into database.';
    }

} catch (\PDOException $e) {
    http_response_code(500); // Internal Server Error
    $response['message'] = 'Database operation failed: ' . $e->getMessage();
    // In a real application, you'd log $e->getMessage() for debugging.
}

// 8. Output JSON Response
echo json_encode($response);