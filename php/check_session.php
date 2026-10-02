<?php

/* =========================================
   SMART HOME - CHECK SESSION
========================================= */

session_start();

header("Content-Type: application/json; charset=UTF-8");


/* =========================================
   KIEM TRA DANG NHAP
========================================= */

if (
    !isset($_SESSION["ma_nguoi_dung"]) ||
    !isset($_SESSION["email"]) ||
    !isset($_SESSION["vai_tro"])
) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "logged_in" => false,
        "message" => "Ban chua dang nhap."
    ]);

    exit;
}


/* =========================================
   THONG TIN NGUOI DUNG
========================================= */

$user = [

    "id" =>
        (int) $_SESSION["ma_nguoi_dung"],

    "name" =>
        $_SESSION["ho_ten"] ?? "",

    "email" =>
        $_SESSION["email"],

    "role" =>
        $_SESSION["vai_tro"]

];


/* =========================================
   TRA KET QUA
========================================= */

echo json_encode([

    "success" => true,

    "logged_in" => true,

    "user" => $user

]);

?>