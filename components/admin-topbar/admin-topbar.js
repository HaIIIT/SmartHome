/* =========================================
   LOAD ADMIN TOPBAR
========================================= */

document.addEventListener("DOMContentLoaded", loadAdminTopbar);

async function loadAdminTopbar() {
  const container = document.getElementById("adminTopbarContainer");

  if (!container) {
    return;
  }

  try {
    const response = await fetch(
      "../components/admin-topbar/admin-topbar.html",
    );

    if (!response.ok) {
      throw new Error("Không thể tải Admin Topbar.");
    }

    container.innerHTML = await response.text();

    setupAdminTopbar();
  } catch (error) {
    console.error("Admin Topbar:", error);
  }
}

/* =========================================
   SETUP
========================================= */

function setupAdminTopbar() {
  const menuButton = document.getElementById("adminMenuBtn");

  const accountButton = document.getElementById("adminAccountBtn");

  const dropdown = document.getElementById("adminAccountDropdown");

  const logoutButton = document.getElementById("adminTopbarLogout");

  /* =========================================
     LOAD ADMIN INFO
  ========================================= */

  const currentUser = getAdminTopbarUser();

  const adminName = currentUser?.name || "Quản trị viên";

  const adminEmail = currentUser?.email || "admin@smarthome.com";

  setAdminText("adminTopbarName", adminName);

  setAdminText("adminDropdownName", adminName);

  setAdminText("adminTopbarEmail", adminEmail);

  setAdminText("adminDropdownEmail", adminEmail);

  /* =========================================
     MOBILE SIDEBAR
  ========================================= */

  menuButton?.addEventListener("click", function () {
    if (typeof window.openAdminSidebar === "function") {
      window.openAdminSidebar();
    }
  });

  /* =========================================
     ACCOUNT DROPDOWN
  ========================================= */

  accountButton?.addEventListener("click", function (event) {
    event.stopPropagation();

    accountButton.classList.toggle("active");

    dropdown?.classList.toggle("show");
  });

  /* =========================================
     CLICK OUTSIDE
  ========================================= */

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".admin-account")) {
      closeAdminAccountDropdown();
    }
  });

  /* =========================================
     ESC
  ========================================= */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAdminAccountDropdown();
    }
  });

  /* =========================================
     LOGOUT
  ========================================= */

  logoutButton?.addEventListener("click", logoutAdmin);
}

/* =========================================
   GET ADMIN
========================================= */

function getAdminTopbarUser() {
  try {
    return JSON.parse(localStorage.getItem("smarthome_user"));
  } catch (error) {
    return null;
  }
}

/* =========================================
   SET TEXT
========================================= */

function setAdminText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

/* =========================================
   CLOSE DROPDOWN
========================================= */

function closeAdminAccountDropdown() {
  const accountButton = document.getElementById("adminAccountBtn");

  const dropdown = document.getElementById("adminAccountDropdown");

  accountButton?.classList.remove("active");

  dropdown?.classList.remove("show");
}

/* =========================================
   LOGOUT
========================================= */

function logoutAdmin() {
  localStorage.removeItem("smarthome_user");

  window.location.href = "login.html";
}
