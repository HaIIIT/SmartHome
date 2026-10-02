document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("backButton");

  backButton?.addEventListener("click", function () {
    /*
      Nếu người dùng đã đi từ một trang trong SmartHome tới 404
      thì quay lại trang trước đó.
      Nếu mở 404 trực tiếp, quay về dashboard.
    */
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "dashboard.html";
    }
  });
});
