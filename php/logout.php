<?php

/* =========================================
   SMART HOME - LOGOUT
========================================= */

session_start();

header("Content-Type: application/json; charset=UTF-8");


/* =========================================
   XOA TOAN BO DU LIEU SESSION
========================================= */

$_SESSION = [];


/* =========================================
   XOA SESSION COOKIE
========================================= */

if (ini_get("session.use_cookies")) {

    $params = session_get_cookie_params();

    setcookie(
        session_name(),
        "",
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}


/* =========================================
   HUY SESSION
========================================= */

session_destroy();


/* =========================================
   TRA KET QUA
========================================= */

echo json_encode([
    "success" => true,
    "message" => "Dang xuat thanh cong."
]);

?>