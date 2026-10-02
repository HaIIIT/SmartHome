<?php

require_once "db.php";

/* =========================================
   THONG TIN ADMIN MAC DINH
========================================= */

$ho_ten = "Quản trị viên";
$email = "admin@smarthome.com";
$mat_khau = "admin123";
$vai_tro = "admin";
$trang_thai = "hoat_dong";


/* =========================================
   KIEM TRA ADMIN DA TON TAI CHUA
========================================= */

$sql = "
    SELECT ma_nguoi_dung
    FROM nguoi_dung
    WHERE email = ?
    LIMIT 1
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "s",
    $email
);

$stmt->execute();

$result = $stmt->get_result();


if ($result->num_rows > 0) {

    echo "
        <h2>Tai khoan Admin da ton tai.</h2>

        <p>
            Email:
            <strong>$email</strong>
        </p>
    ";

    $stmt->close();
    $conn->close();

    exit;
}


$stmt->close();


/* =========================================
   MA HOA MAT KHAU
========================================= */

$mat_khau_hash = password_hash(
    $mat_khau,
    PASSWORD_DEFAULT
);


/* =========================================
   THEM ADMIN VAO DATABASE
========================================= */

$sql = "
    INSERT INTO nguoi_dung
    (
        ho_ten,
        email,
        mat_khau,
        vai_tro,
        trang_thai
    )
    VALUES (?, ?, ?, ?, ?)
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssss",
    $ho_ten,
    $email,
    $mat_khau_hash,
    $vai_tro,
    $trang_thai
);


if ($stmt->execute()) {

    echo "
        <h2>Tao tai khoan Admin thanh cong!</h2>

        <p>
            Email:
            <strong>admin@smarthome.com</strong>
        </p>

        <p>
            Mat khau:
            <strong>admin123</strong>
        </p>

        <p>
            Vai tro:
            <strong>admin</strong>
        </p>

        <p>
            Trang thai:
            <strong>hoat_dong</strong>
        </p>
    ";

} else {

    echo "
        <h2>Khong the tao Admin.</h2>

        <p>
            Loi:
            " . htmlspecialchars($stmt->error) . "
        </p>
    ";

}


$stmt->close();

$conn->close();

?>