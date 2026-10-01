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

showPassword.addEventListener("click", function () {
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
   REMOVE ERROR
========================================= */

username.addEventListener("input", function () {
  usernameError.textContent = "";

  username.closest(".input-box").classList.remove("error");
});

password.addEventListener("input", function () {
  passwordError.textContent = "";

  password.closest(".input-box").classList.remove("error");
});

/* =========================================
   SUBMIT
========================================= */

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let valid = true;

  /* Reset */

  usernameError.textContent = "";

  passwordError.textContent = "";

  loginStatus.className = "login-status";

  loginStatus.textContent = "";

  /* Username */

  if (username.value.trim() === "") {
    usernameError.textContent = "Vui lòng nhập tên đăng nhập.";

    username.closest(".input-box").classList.add("error");

    valid = false;
  }

  /* Password */

  if (password.value.trim() === "") {
    passwordError.textContent = "Vui lòng nhập mật khẩu.";

    password.closest(".input-box").classList.add("error");

    valid = false;
  }

  /* Không hợp lệ */

  if (!valid) {
    loginStatus.textContent = "Vui lòng kiểm tra lại thông tin đăng nhập.";

    loginStatus.classList.add("error");

    return;
  }

  /*
      Chưa kiểm tra tài khoản tại đây.

      Sau này:
      JavaScript
          ↓
      PHP Login API
          ↓
      Database
          ↓
      Kiểm tra password
          ↓
      Tạo session
          ↓
      Dashboard
    */

  loginStatus.textContent = "Đăng nhập thành công.";

  loginStatus.classList.add("success");

  setTimeout(function () {
    window.location.href = "dashboard.html";
  }, 800);
});
