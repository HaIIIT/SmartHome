<?php

/* =========================================
   SMART HOME - ADD USER
========================================= */

session_start();

header("Content-Type: application/json; charset=UTF-8");


/* =========================================
   CHI CHO PHEP POST
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
   KIEM TRA SESSION
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
        "message" => "Ban khong co quyen thuc hien thao tac nay."
    ]);

    exit;
}


/* =========================================
   DATABASE + MAIL
========================================= */

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/mail_config.php";


/* =========================================
   DOC JSON
========================================= */

$input = json_decode(
    file_get_contents("php://input"),
    true
);

if (!is_array($input)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Du lieu gui len khong hop le."
    ]);

    $conn->close();
    exit;
}


/* =========================================
   LAY DU LIEU
========================================= */

$ho_ten = trim($input["name"] ?? "");

$email = strtolower(
    trim($input["email"] ?? "")
);

$mat_khau = $input["password"] ?? "";

$vai_tro = trim(
    $input["role"] ?? "nguoi_dung"
);


/* =========================================
   VALIDATE
========================================= */

if (
    $ho_ten === "" ||
    $email === "" ||
    $mat_khau === ""
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


if (strlen($mat_khau) < 6) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Mat khau phai co toi thieu 6 ky tu."
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
   KIEM TRA EMAIL TON TAI
========================================= */

$check = $conn->prepare("
    SELECT ma_nguoi_dung
    FROM nguoi_dung
    WHERE email = ?
    LIMIT 1
");

if (!$check) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the kiem tra email."
    ]);

    $conn->close();
    exit;
}

$check->bind_param("s", $email);
$check->execute();

$checkResult = $check->get_result();

if ($checkResult->num_rows > 0) {

    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Email nay da ton tai."
    ]);

    $check->close();
    $conn->close();
    exit;
}

$check->close();


/* =========================================
   HASH PASSWORD
========================================= */

$mat_khau_hash = password_hash(
    $mat_khau,
    PASSWORD_DEFAULT
);

if ($mat_khau_hash === false) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the ma hoa mat khau."
    ]);

    $conn->close();
    exit;
}


/* =========================================
   THONG TIN MAC DINH
========================================= */

$trang_thai = "hoat_dong";


/* =========================================
   THEM VAO DATABASE
========================================= */

$stmt = $conn->prepare("
    INSERT INTO nguoi_dung
    (
        mat_khau,
        ho_ten,
        email,
        vai_tro,
        trang_thai
    )
    VALUES (?, ?, ?, ?, ?)
");

if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Khong the tao tai khoan."
    ]);

    $conn->close();
    exit;
}

$stmt->bind_param(
    "sssss",
    $mat_khau_hash,
    $ho_ten,
    $email,
    $vai_tro,
    $trang_thai
);

if (!$stmt->execute()) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Them nguoi dung that bai."
    ]);

    $stmt->close();
    $conn->close();
    exit;
}


/* =========================================
   ID VUA TAO
========================================= */

$ma_nguoi_dung = $conn->insert_id;


/* =========================================
   GUI EMAIL
========================================= */

$email_sent = false;
$email_error = null;

try {

    $mail = createMailer();

    /* URL DANG NHAP TU .ENV */

    $app_url = rtrim(
        $env["APP_URL"] ?? "",
        "/"
    );

    $login_url = $app_url . "/html/login.html";


    /* NGUOI NHAN */

    $mail->addAddress(
        $email,
        $ho_ten
    );


    /* NOI DUNG EMAIL */

    $mail->isHTML(true);

    $mail->Subject =
        "Thông tin tài khoản Smart Home Technology";

    $ten_vai_tro =
        $vai_tro === "admin"
            ? "Quản trị viên"
            : "Người dùng";


    /* =========================================
       NOI DUNG EMAIL HTML
    ========================================= */

    $mail->Body = '
    <div style="
        font-family: Arial, Helvetica, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        color: #263746;
        line-height: 1.6;
    ">

        <div style="
            background: #168cf0;
            padding: 24px;
            text-align: center;
            color: #ffffff;
            border-radius: 12px 12px 0 0;
        ">
            <h2 style="
                margin: 0;
                font-size: 24px;
            ">
                Smart Home Technology
            </h2>

            <p style="
                margin: 6px 0 0;
                font-size: 14px;
                opacity: 0.9;
            ">
                Hệ thống quản lý nhà thông minh
            </p>
        </div>


        <div style="
            border: 1px solid #e1e8ee;
            border-top: none;
            padding: 28px;
            border-radius: 0 0 12px 12px;
            background: #ffffff;
        ">

            <p style="margin-top: 0;">
                Xin chào
                <strong>' .
                htmlspecialchars(
                    $ho_ten,
                    ENT_QUOTES,
                    "UTF-8"
                ) .
                '</strong>,
            </p>


            <p>
                Tài khoản Smart Home của bạn đã được tạo thành công.
                Dưới đây là thông tin đăng nhập của bạn:
            </p>


            <div style="
                background: #f5f9fc;
                padding: 18px;
                border-radius: 10px;
                margin: 22px 0;
            ">

                <p style="margin: 6px 0;">
                    <strong>Email đăng nhập:</strong>
                    ' .
                    htmlspecialchars(
                        $email,
                        ENT_QUOTES,
                        "UTF-8"
                    ) .
                    '
                </p>


                <p style="margin: 6px 0;">
                    <strong>Mật khẩu:</strong>
                    ' .
                    htmlspecialchars(
                        $mat_khau,
                        ENT_QUOTES,
                        "UTF-8"
                    ) .
                    '
                </p>


                <p style="margin: 6px 0;">
                    <strong>Quyền tài khoản:</strong>
                    ' .
                    htmlspecialchars(
                        $ten_vai_tro,
                        ENT_QUOTES,
                        "UTF-8"
                    ) .
                    '
                </p>

            </div>


            <p>
                Vui lòng bảo mật thông tin tài khoản và không
                chia sẻ mật khẩu cho người khác.
            </p>


            <div style="
                text-align: center;
                margin: 30px 0;
            ">

                <a
                    href="' .
                    htmlspecialchars(
                        $login_url,
                        ENT_QUOTES,
                        "UTF-8"
                    ) .
                    '"
                    style="
                        display: inline-block;
                        padding: 13px 30px;
                        background: #168cf0;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-size: 15px;
                        font-weight: 600;
                    "
                >
                    Đăng nhập ngay
                </a>

            </div>


            <p style="
                color: #647788;
                font-size: 13px;
            ">
                Nếu nút đăng nhập không hoạt động, bạn có thể
                truy cập đường dẫn sau:
            </p>


            <p style="
                word-break: break-all;
                font-size: 13px;
            ">
                <a
                    href="' .
                    htmlspecialchars(
                        $login_url,
                        ENT_QUOTES,
                        "UTF-8"
                    ) .
                    '"
                    style="
                        color: #168cf0;
                        text-decoration: none;
                    "
                >
                    ' .
                    htmlspecialchars(
                        $login_url,
                        ENT_QUOTES,
                        "UTF-8"
                    ) .
                    '
                </a>
            </p>


            <hr style="
                border: none;
                border-top: 1px solid #e8eef3;
                margin: 28px 0 20px;
            ">


            <p style="
                margin: 0;
                color: #78909c;
                font-size: 12px;
                text-align: center;
            ">
                Email này được gửi tự động từ hệ thống
                <strong>Smart Home Technology</strong>.<br>
                Vui lòng không phản hồi email này.
            </p>

        </div>

    </div>
    ';


    /* =========================================
       EMAIL PLAIN TEXT
    ========================================= */

    $mail->AltBody =
        "Xin chào " . $ho_ten . "\n\n" .
        "Tài khoản Smart Home của bạn đã được tạo thành công.\n\n" .
        "THÔNG TIN ĐĂNG NHẬP\n" .
        "Email đăng nhập: " . $email . "\n" .
        "Mật khẩu: " . $mat_khau . "\n" .
        "Quyền tài khoản: " . $ten_vai_tro . "\n\n" .
        "Đăng nhập tại:\n" .
        $login_url . "\n\n" .
        "Vui lòng bảo mật thông tin tài khoản và không chia sẻ " .
        "mật khẩu cho người khác.\n\n" .
        "Email này được gửi tự động từ hệ thống " .
        "Smart Home Technology. Vui lòng không phản hồi email này.";


    /* GUI EMAIL */

    $mail->send();

    $email_sent = true;

} catch (Throwable $e) {

    /*
       Tai khoan van duoc tao neu email gui that bai.
    */

    $email_error = $e->getMessage();

    error_log(
        "SmartHome Mail Error: " .
        $email_error
    );
}


/* =========================================
   TRA KET QUA
========================================= */

echo json_encode([
    "success" => true,

    "message" =>
        $email_sent
            ? "Them nguoi dung va gui email thanh cong."
            : "Them nguoi dung thanh cong nhung khong gui duoc email.",

    "email_sent" =>
        $email_sent,

    "user" => [
        "id" =>
            (int) $ma_nguoi_dung,

        "name" =>
            $ho_ten,

        "email" =>
            $email,

        "role" =>
            $vai_tro,

        "status" =>
            $trang_thai
    ]
]);


$stmt->close();
$conn->close();

?>