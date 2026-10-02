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
   SESSION + ADMIN
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
   INPUT
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


$id = (int) ($input["id"] ?? 0);

$ho_ten = trim(
    $input["name"] ?? ""
);

$email = strtolower(
    trim($input["email"] ?? "")
);

$vai_tro = trim(
    $input["role"] ?? ""
);


/* =========================================
   VALIDATE
========================================= */

if (
    $id <= 0 ||
    $ho_ten === "" ||
    $email === "" ||
    $vai_tro === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Vui long nhap day du thong tin."
    ]);

    $conn->close();
    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Email khong hop le."
    ]);

    $conn->close();
    exit;
}


if (
    $vai_tro !== "admin" &&
    $vai_tro !== "nguoi_dung"
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Vai tro khong hop le."
    ]);

    $conn->close();
    exit;
}


/* =========================================
   KIEM TRA USER TON TAI
========================================= */

$checkUser = $conn->prepare("
    SELECT ma_nguoi_dung
    FROM nguoi_dung
    WHERE ma_nguoi_dung = ?
    LIMIT 1
");

$checkUser->bind_param(
    "i",
    $id
);

$checkUser->execute();

$userResult =
    $checkUser->get_result();


if ($userResult->num_rows === 0) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Khong tim thay nguoi dung."
    ]);

    $checkUser->close();
    $conn->close();

    exit;
}

$checkUser->close();


/* =========================================
   KIEM TRA EMAIL TRUNG
========================================= */

$checkEmail = $conn->prepare("
    SELECT ma_nguoi_dung
    FROM nguoi_dung
    WHERE email = ?
      AND ma_nguoi_dung != ?
    LIMIT 1
");

$checkEmail->bind_param(
    "si",
    $email,
    $id
);

$checkEmail->execute();

$emailResult =
    $checkEmail->get_result();


if ($emailResult->num_rows > 0) {
    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Email nay da duoc su dung."
    ]);

    $checkEmail->close();
    $conn->close();

    exit;
}

$checkEmail->close();


/* =========================================
   KHONG CHO ADMIN TU HA QUYEN CHINH MINH
========================================= */

$currentAdminId =
    (int) $_SESSION["ma_nguoi_dung"];


if (
    $id === $currentAdminId &&
    $vai_tro !== "admin"
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ban khong the tu ha quyen tai khoan Admin dang dang nhap."
    ]);

    $conn->close();
    exit;
}


/* =========================================
   UPDATE
========================================= */

$stmt = $conn->prepare("
    UPDATE nguoi_dung
    SET
        ho_ten = ?,
        email = ?,
        vai_tro = ?
    WHERE ma_nguoi_dung = ?
");


if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the cap nhat nguoi dung."
    ]);

    $conn->close();
    exit;
}


$stmt->bind_param(
    "sssi",
    $ho_ten,
    $email,
    $vai_tro,
    $id
);


if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Cap nhat nguoi dung that bai."
    ]);

    $stmt->close();
    $conn->close();

    exit;
}


/* =========================================
   NEU SUA CHINH ADMIN DANG DANG NHAP
========================================= */

if ($id === $currentAdminId) {
    $_SESSION["ho_ten"] =
        $ho_ten;

    $_SESSION["email"] =
        $email;
}


/* =========================================
   RESPONSE
========================================= */

echo json_encode([
    "success" => true,

    "message" =>
        "Cap nhat nguoi dung thanh cong."
]);


$stmt->close();
$conn->close();

?>