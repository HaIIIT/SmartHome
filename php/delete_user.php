<?php

session_start();
header("Content-Type: application/json; charset=UTF-8");

/* =========================================
   METHOD
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Phuong thuc khong duoc ho tro."
    ]);

    exit;
}


/* =========================================
   CHECK LOGIN
========================================= */

if (
    !isset($_SESSION["ma_nguoi_dung"]) ||
    !isset($_SESSION["vai_tro"])
) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Ban chua dang nhap."
    ]);

    exit;
}


/* =========================================
   CHECK ADMIN
========================================= */

if ($_SESSION["vai_tro"] !== "admin") {
    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Ban khong co quyen thuc hien thao tac nay."
    ]);

    exit;
}


/* =========================================
   DATABASE
========================================= */

require_once __DIR__ . "/db.php";


/* =========================================
   GET JSON
========================================= */

$input = json_decode(
    file_get_contents("php://input"),
    true
);

if (!is_array($input)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Du lieu khong hop le."
    ]);

    $conn->close();
    exit;
}


/* =========================================
   USER ID
========================================= */

$id = (int) ($input["id"] ?? 0);

if ($id <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Nguoi dung khong hop le."
    ]);

    $conn->close();
    exit;
}


/* =========================================
   KHONG CHO ADMIN TU XOA
========================================= */

$currentAdminId =
    (int) $_SESSION["ma_nguoi_dung"];

if ($id === $currentAdminId) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" =>
            "Ban khong the tu xoa tai khoan Admin dang dang nhap."
    ]);

    $conn->close();
    exit;
}


/* =========================================
   CHECK USER
========================================= */

$check = $conn->prepare(
    "SELECT ma_nguoi_dung, email
     FROM nguoi_dung
     WHERE ma_nguoi_dung = ?
     LIMIT 1"
);

$check->bind_param("i", $id);

$check->execute();

$result = $check->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Khong tim thay nguoi dung."
    ]);

    $check->close();
    $conn->close();

    exit;
}

$user = $result->fetch_assoc();

$check->close();


/* =========================================
   DELETE
========================================= */

$stmt = $conn->prepare(
    "DELETE FROM nguoi_dung
     WHERE ma_nguoi_dung = ?"
);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the xoa nguoi dung."
    ]);

    $conn->close();
    exit;
}

$stmt->bind_param("i", $id);


if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Xoa nguoi dung that bai."
    ]);

    $stmt->close();
    $conn->close();

    exit;
}


/* =========================================
   SUCCESS
========================================= */

echo json_encode([
    "success" => true,
    "message" => "Xoa nguoi dung thanh cong.",
    "email" => $user["email"]
]);


$stmt->close();
$conn->close();

?>