<?php

/* =========================================
   SMART HOME - GET USERS
   Chi Admin moi duoc phep truy cap
========================================= */

session_start();

header("Content-Type: application/json; charset=UTF-8");


/* =========================================
   CHI CHO PHEP GET
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "GET") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Phuong thuc khong duoc ho tro."
    ]);

    exit;
}


/* =========================================
   KIEM TRA DANG NHAP
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
   KIEM TRA QUYEN ADMIN
========================================= */

if ($_SESSION["vai_tro"] !== "admin") {

    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Ban khong co quyen truy cap."
    ]);

    exit;
}


/* =========================================
   KET NOI DATABASE
========================================= */

require_once __DIR__ . "/db.php";


/* =========================================
   LAY DANH SACH NGUOI DUNG
========================================= */

$sql = "
    SELECT
        ma_nguoi_dung,
        ho_ten,
        email,
        vai_tro,
        trang_thai,
        ngay_tao,
        lan_dang_nhap_cuoi
    FROM nguoi_dung
    ORDER BY ma_nguoi_dung DESC
";


$result = $conn->query($sql);


if (!$result) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the lay danh sach nguoi dung."
    ]);

    $conn->close();

    exit;
}


/* =========================================
   TAO DANH SACH
========================================= */

$users = [];


while ($row = $result->fetch_assoc()) {

    $users[] = [

        "id" =>
            (int) $row["ma_nguoi_dung"],

        "name" =>
            $row["ho_ten"],

        "email" =>
            $row["email"],

        "role" =>
            $row["vai_tro"],

        "status" =>
            $row["trang_thai"],

        "createdAt" =>
            $row["ngay_tao"],

        "lastLogin" =>
            $row["lan_dang_nhap_cuoi"]

    ];
}


/* =========================================
   TRA KET QUA
========================================= */

echo json_encode([
    "success" => true,
    "users" => $users,
    "total" => count($users)
]);


$conn->close();

?>