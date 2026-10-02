/* =========================================
   SMART HOME - LOGIN
   PHP + MYSQL
========================================= */

/* =========================================
   ELEMENTS
========================================= */

const loginForm = document.getElementById("loginForm");

const username = document.getElementById("username");
const password = document.getElementById("password");

const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");

const showPassword = document.getElementById("showPassword");
const eyeIcon = document.getElementById("eyeIcon");

const loginStatus = document.getElementById("loginStatus");

/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

showPassword?.addEventListener("click", function () {
  if (password.type === "password") {
    password.type = "text";

    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");

    showPassword.setAttribute("aria-label", "Ẩn mật khẩu");
  } else {
    password.type = "password";

    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");

    showPassword.setAttribute("aria-label", "Hiện mật khẩu");
  }
});

/* =========================================
   REMOVE EMAIL ERROR
========================================= */

username?.addEventListener("input", function () {
  usernameError.textContent = "";

  username.closest(".input-box")?.classList.remove("error");
});

/* =========================================
   REMOVE PASSWORD ERROR
========================================= */

password?.addEventListener("input", function () {
  passwordError.textContent = "";

  password.closest(".input-box")?.classList.remove("error");
});

/* =========================================
   SUBMIT LOGIN
========================================= */

loginForm?.addEventListener("submit", async function (event) {
  event.preventDefault();

  /* =====================================
       RESET
    ===================================== */

  resetErrors();

  const email = username.value.trim().toLowerCase();

  const passwordValue = password.value;

  let valid = true;

  /* =====================================
       KIEM TRA EMAIL
    ===================================== */

  if (email === "") {
    usernameError.textContent = "Vui lòng nhập email.";

    username.closest(".input-box")?.classList.add("error");

    valid = false;
  } else if (!isValidEmail(email)) {
    usernameError.textContent = "Email không hợp lệ.";

    username.closest(".input-box")?.classList.add("error");

    valid = false;
  }

  /* =====================================
       KIEM TRA PASSWORD
    ===================================== */

  if (passwordValue.trim() === "") {
    passwordError.textContent = "Vui lòng nhập mật khẩu.";

    password.closest(".input-box")?.classList.add("error");

    valid = false;
  }

  /* =====================================
       VALIDATION THAT BAI
    ===================================== */

  if (!valid) {
    showLoginStatus("error", "Vui lòng kiểm tra lại thông tin đăng nhập.");

    return;
  }

  /* =====================================
       BAT DAU DANG NHAP
    ===================================== */

  setLoginLoading(true);

  try {
    /* ===================================
         GUI DU LIEU DEN PHP
      =================================== */

    const response = await fetch("../php/login.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "same-origin",

      body: JSON.stringify({
        email: email,
        password: passwordValue,
      }),
    });

    /* ===================================
         DOC JSON TU PHP
      =================================== */

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Phản hồi từ máy chủ không hợp lệ.");
    }

    /* ===================================
         DANG NHAP THAT BAI
      =================================== */

    if (!response.ok || !data.success) {
      showLoginStatus("error", data.message || "Đăng nhập không thành công.");

      username.closest(".input-box")?.classList.add("error");

      password.closest(".input-box")?.classList.add("error");

      return;
    }

    /* ===================================
         KIEM TRA DU LIEU USER
      =================================== */

    if (!data.user || !data.user.role || !data.redirect) {
      throw new Error("Dữ liệu tài khoản không hợp lệ.");
    }

    /* ===================================
         LUU THONG TIN USER CHO FRONTEND
      =================================== */

    localStorage.setItem("smarthome_user", JSON.stringify(data.user));

    /* ===================================
         DANG NHAP THANH CONG
      =================================== */

    showLoginStatus("success", "Đăng nhập thành công.");

    /* ===================================
         DIEU HUONG
      =================================== */

    setTimeout(function () {
      window.location.href = data.redirect;
    }, 700);
  } catch (error) {
    console.error("Login error:", error);

    showLoginStatus(
      "error",
      "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
    );
  } finally {
    setLoginLoading(false);
  }
});

/* =========================================
   VALIDATE EMAIL
========================================= */

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

/* =========================================
   RESET ERROR
========================================= */

function resetErrors() {
  usernameError.textContent = "";
  passwordError.textContent = "";

  username.closest(".input-box")?.classList.remove("error");

  password.closest(".input-box")?.classList.remove("error");

  loginStatus.className = "login-status";

  loginStatus.textContent = "";
}

/* =========================================
   LOGIN STATUS
========================================= */

function showLoginStatus(type, message) {
  loginStatus.className = "login-status";

  loginStatus.textContent = message;

  loginStatus.classList.add(type);
}

/* =========================================
   LOADING
========================================= */

function setLoginLoading(loading) {
  const submitButton = loginForm.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  submitButton.disabled = loading;

  if (loading) {
    submitButton.dataset.originalHtml = submitButton.innerHTML;

    submitButton.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Đang đăng nhập...</span>
    `;
  } else {
    if (submitButton.dataset.originalHtml) {
      submitButton.innerHTML = submitButton.dataset.originalHtml;
    }
  }
}
