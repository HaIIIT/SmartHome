<?php

$ten_may_chu = "localhost";
$ten_dang_nhap = "root";
$mat_khau = "";
$ten_database = "smarthome";

$conn = new mysqli(
    $ten_may_chu,
    $ten_dang_nhap,
    $mat_khau,
    $ten_database
);

if ($conn->connect_error) {
    die("Ket noi database that bai: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>