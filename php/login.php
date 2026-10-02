<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";


/* =========================================
   CHI CHO PHEP POST
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Phuong thuc khong hop le."
    ]);

    exit;
}


/* =========================================
   NHAN DU LIEU JSON TU LOGIN.JS
========================================= */

$input = json_decode(
    file_get_contents("php://input"),
    true
);


$email = trim(
    $input["email"] ?? ""
);

$mat_khau =
    $input["password"] ?? "";


/* =========================================
   KIEM TRA DU LIEU
========================================= */

if ($email === "" || $mat_khau === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Vui long nhap day du email va mat khau."
    ]);

    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Email khong hop le."
    ]);

    exit;
}


/* =========================================
   TIM NGUOI DUNG
========================================= */

$sql = "
    SELECT
        ma_nguoi_dung,
        ho_ten,
        email,
        mat_khau,
        vai_tro,
        trang_thai
    FROM nguoi_dung
    WHERE email = ?
    LIMIT 1
";


$stmt = $conn->prepare($sql);


if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the xu ly yeu cau."
    ]);

    exit;
}


$stmt->bind_param(
    "s",
    $email
);


$stmt->execute();


$result =
    $stmt->get_result();


/* =========================================
   KHONG TIM THAY EMAIL
========================================= */

if ($result->num_rows !== 1) {

    $stmt->close();
    $conn->close();

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Email hoac mat khau khong chinh xac."
    ]);

    exit;
}


$user =
    $result->fetch_assoc();


$stmt->close();


/* =========================================
   KIEM TRA MAT KHAU
========================================= */

if (
    !password_verify(
        $mat_khau,
        $user["mat_khau"]
    )
) {

    $conn->close();

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Email hoac mat khau khong chinh xac."
    ]);

    exit;
}


/* =========================================
   KIEM TRA TAI KHOAN BI KHOA
========================================= */

if ($user["trang_thai"] === "khoa") {

    $conn->close();

    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Tai khoan da bi khoa. Vui long lien he quan tri vien."
    ]);

    exit;
}


/* =========================================
   KIEM TRA VAI TRO
========================================= */

if (
    $user["vai_tro"] !== "admin"
    &&
    $user["vai_tro"] !== "nguoi_dung"
) {

    $conn->close();

    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Tai khoan khong co quyen truy cap."
    ]);

    exit;
}


/* =========================================
   TAO SESSION
========================================= */

session_regenerate_id(true);


$_SESSION["ma_nguoi_dung"] =
    (int) $user["ma_nguoi_dung"];


$_SESSION["ho_ten"] =
    $user["ho_ten"];


$_SESSION["email"] =
    $user["email"];


$_SESSION["vai_tro"] =
    $user["vai_tro"];


/* =========================================
   CAP NHAT LAN DANG NHAP CUOI
========================================= */

$sql_update = "
    UPDATE nguoi_dung
    SET lan_dang_nhap_cuoi = NOW()
    WHERE ma_nguoi_dung = ?
";


$stmt_update =
    $conn->prepare($sql_update);


if ($stmt_update) {

    $stmt_update->bind_param(
        "i",
        $user["ma_nguoi_dung"]
    );


    $stmt_update->execute();

    $stmt_update->close();
}


/* =========================================
   CHON TRANG CHUYEN DEN
========================================= */

if ($user["vai_tro"] === "admin") {

    $redirect =
        "admin.html";

} else {

    $redirect =
        "dashboard.html";
}


/* =========================================
   TRA KET QUA
========================================= */

echo json_encode([

    "success" => true,

    "message" =>
        "Dang nhap thanh cong.",

    "redirect" =>
        $redirect,

    "user" => [

        "id" =>
            (int) $user["ma_nguoi_dung"],

        "name" =>
            $user["ho_ten"],

        "email" =>
            $user["email"],

        "role" =>
            $user["vai_tro"]

    ]

]);


$conn->close();

?>