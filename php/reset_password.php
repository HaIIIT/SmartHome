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
   DATA
========================================= */

$id = (int) ($input["id"] ?? 0);

$password = $input["password"] ?? "";


/* =========================================
   VALIDATE
========================================= */

if ($id <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Nguoi dung khong hop le."
    ]);

    $conn->close();

    exit;
}


if (strlen($password) < 6) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Mat khau phai co toi thieu 6 ky tu."
    ]);

    $conn->close();

    exit;
}


/* =========================================
   CHECK USER
========================================= */

$check = $conn->prepare(
    "SELECT ma_nguoi_dung
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

$check->close();


/* =========================================
   HASH PASSWORD
========================================= */

$passwordHash = password_hash(
    $password,
    PASSWORD_DEFAULT
);

if ($passwordHash === false) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the ma hoa mat khau."
    ]);

    $conn->close();

    exit;
}


/* =========================================
   UPDATE PASSWORD
========================================= */

$stmt = $conn->prepare(
    "UPDATE nguoi_dung
     SET mat_khau = ?
     WHERE ma_nguoi_dung = ?"
);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the cap nhat mat khau."
    ]);

    $conn->close();

    exit;
}


$stmt->bind_param(
    "si",
    $passwordHash,
    $id
);


if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Cap nhat mat khau that bai."
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
    "message" => "Dat lai mat khau thanh cong."
]);


$stmt->close();

$conn->close();

?>