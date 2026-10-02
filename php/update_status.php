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

$trang_thai = trim(
    $input["status"] ?? ""
);


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


if (
    $trang_thai !== "hoat_dong" &&
    $trang_thai !== "khoa"
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Trang thai khong hop le."
    ]);

    $conn->close();
    exit;
}


/* =========================================
   KHONG CHO ADMIN TU KHOA
========================================= */

$currentAdminId =
    (int) $_SESSION["ma_nguoi_dung"];

if (
    $id === $currentAdminId &&
    $trang_thai === "khoa"
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" =>
            "Ban khong the tu khoa tai khoan Admin dang dang nhap."
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
   UPDATE STATUS
========================================= */

$stmt = $conn->prepare(
    "UPDATE nguoi_dung
     SET trang_thai = ?
     WHERE ma_nguoi_dung = ?"
);


if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the cap nhat trang thai."
    ]);

    $conn->close();

    exit;
}


$stmt->bind_param(
    "si",
    $trang_thai,
    $id
);


if (!$stmt->execute()) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Cap nhat trang thai that bai."
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
    "message" =>
        $trang_thai === "khoa"
            ? "Khoa tai khoan thanh cong."
            : "Mo khoa tai khoan thanh cong."
]);


$stmt->close();

$conn->close();

?>