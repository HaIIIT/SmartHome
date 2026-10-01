const intro = document.getElementById("intro");
const header = document.getElementById("header");
const welcome = document.getElementById("home");
const loginBtn = document.getElementById("loginBtn");

window.addEventListener("load", function () {
  // Logo ở giữa màn hình trong 2 giây
  setTimeout(function () {
    // Logo + màn hình intro mờ dần
    intro.classList.add("hide");

    // Sau khi intro gần biến mất
    setTimeout(function () {
      // Header xuất hiện
      header.classList.add("show");

      // Nội dung chào mừng xuất hiện
      welcome.classList.add("show");

      // Cho phép cuộn
      document.body.style.overflow = "auto";
    }, 500);

    // Xóa intro sau khi animation hoàn tất
    setTimeout(function () {
      intro.style.display = "none";
    }, 800);
  }, 2000);
});

/* Nút đăng nhập */

loginBtn.addEventListener("click", function () {
  window.location.href = "login.html";
});
/*Hiệu ứng cuộn trang*/
window.addEventListener("scroll", function () {
  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
const sections = document.querySelectorAll("#home, #about, #contact");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveMenu() {
  let currentSection = "home";

  sections.forEach(function (section) {
    const sectionTop = section.offsetTop;

    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveMenu);

window.addEventListener("load", updateActiveMenu);
