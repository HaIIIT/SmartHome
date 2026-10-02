/* =========================================
   SMART HOME - AUTH / SESSION
========================================= */

/* =========================================
   AUTO CHECK AUTH
========================================= */

document.addEventListener("DOMContentLoaded", async function () {
  const authType = document.body.dataset.auth;

  /* =====================================
       TRANG CONG KHAI
    ===================================== */

  if (!authType) {
    return;
  }

  /* =====================================
       TRANG ADMIN
    ===================================== */

  if (authType === "admin") {
    await checkAuth({
      requireAdmin: true,
    });

    return;
  }

  /* =====================================
       TRANG USER
    ===================================== */

  if (authType === "user") {
    await checkAuth({
      requireAdmin: false,
    });
  }
});

/* =========================================
   CHECK SESSION
========================================= */

async function checkAuth(options = {}) {
  const { requireAdmin = false } = options;

  try {
    const response = await fetch("../php/check_session.php", {
      method: "GET",

      credentials: "same-origin",

      cache: "no-store",
    });

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Phan hoi session khong hop le.");
    }

    /* =====================================
       CHUA DANG NHAP
    ===================================== */

    if (!response.ok || !data.success || !data.logged_in) {
      clearLocalUser();

      redirectToLogin();

      return null;
    }

    /* =====================================
       DU LIEU USER KHONG HOP LE
    ===================================== */

    if (!data.user || !data.user.role) {
      clearLocalUser();

      redirectToLogin();

      return null;
    }

    /* =====================================
       KIEM TRA VAI TRO
    ===================================== */

    const role = data.user.role;

    if (role !== "admin" && role !== "nguoi_dung") {
      clearLocalUser();

      redirectToLogin();

      return null;
    }

    /* =====================================
       BAO VE ADMIN
    ===================================== */

    if (requireAdmin && role !== "admin") {
      window.location.replace("dashboard.html");

      return null;
    }

    /* =====================================
       DONG BO USER CHO FRONTEND
    ===================================== */

    saveLocalUser(data.user);

    return data.user;
  } catch (error) {
    console.error("Auth error:", error);

    clearLocalUser();

    redirectToLogin();

    return null;
  }
}

/* =========================================
   REQUIRE ADMIN
========================================= */

async function requireAdmin() {
  return await checkAuth({
    requireAdmin: true,
  });
}

/* =========================================
   REQUIRE LOGIN
========================================= */

async function requireLogin() {
  return await checkAuth({
    requireAdmin: false,
  });
}

/* =========================================
   SAVE LOCAL USER
========================================= */

function saveLocalUser(user) {
  localStorage.setItem("smarthome_user", JSON.stringify(user));
}

/* =========================================
   CLEAR LOCAL USER
========================================= */

function clearLocalUser() {
  localStorage.removeItem("smarthome_user");
}

/* =========================================
   GET CURRENT USER
========================================= */

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("smarthome_user"));
  } catch (error) {
    return null;
  }
}

/* =========================================
   REDIRECT LOGIN
========================================= */

function redirectToLogin() {
  /*
    Neu dang o login.html
    thi khong redirect lap vo han.
  */

  if (!window.location.pathname.endsWith("/login.html")) {
    window.location.replace("login.html");
  }
}
