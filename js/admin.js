let users = [];

async function loadUsers() {
  try {
    const response = await fetch("../php/get_users.php", {
      method: "GET",

      credentials: "same-origin",

      cache: "no-store",
    });

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("smarthome_user");

      window.location.replace("login.html");

      return;
    }

    if (response.status === 403) {
      window.location.replace("dashboard.html");

      return;
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tải danh sách người dùng.");
    }

    users = data.users.map(function (user) {
      return {
        id: Number(user.id),

        name: user.name,

        email: user.email,

        role: user.role,

        status: user.status,

        createdAt: formatDateTime(user.createdAt, "Chưa có dữ liệu"),

        lastLogin: formatDateTime(user.lastLogin, "Chưa đăng nhập"),
      };
    });

    renderUsers();
  } catch (error) {
    console.error("Load Users Error:", error);

    users = [];

    renderUsers();

    adminNotify("error", "Không thể tải người dùng", error.message);
  }
}

/* =========================================

   FORMAT MYSQL DATETIME

\\========================================= */

function formatDateTime(value, emptyText = "-") {
  if (!value) {
    return emptyText;
  }

  const match = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );

  if (!match) {
    return value;
  }

  const year = match[1];

  const month = match[2];

  const day = match[3];

  const hour = match[4];

  const minute = match[5];

  if (hour && minute) {
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }

  return `${day}/${month}/${year}`;
}

/* =========================================

   VARIABLES

\\========================================= */

let pendingConfirmAction = null;

let resetPasswordUserId = null;

/* =========================================

   DOM READY

\\========================================= */

document.addEventListener("DOMContentLoaded", async function () {
  const admin = await requireAdmin();

  if (!admin) {
    return;
  }

  setupAdminEvents();

  await loadUsers();
});

/* =========================================

   EVENTS

\\========================================= */

function setupAdminEvents() {
  const search = document.getElementById("userSearch");

  const statusFilter = document.getElementById("statusFilter");

  const addButton = document.getElementById("addUserButton");

  const userForm = document.getElementById("userForm");

  search?.addEventListener("input", renderUsers);

  statusFilter?.addEventListener("change", renderUsers);

  addButton?.addEventListener("click", openAddUserModal);

  userForm?.addEventListener("submit", saveUser);

  /* CLOSE USER MODAL */

  document

    .getElementById("closeUserModal")

    ?.addEventListener("click", closeUserModal);

  document

    .getElementById("cancelUserButton")

    ?.addEventListener("click", closeUserModal);

  /* PASSWORD SHOW */

  document

    .getElementById("toggleNewPassword")

    ?.addEventListener("click", toggleNewPassword);

  /* CONFIRM */

  document

    .getElementById("cancelConfirmButton")

    ?.addEventListener("click", closeConfirmModal);

  document

    .getElementById("confirmActionButton")

    ?.addEventListener("click", executeConfirmAction);

  /* RESET PASSWORD */

  document

    .getElementById("closeResetPassword")

    ?.addEventListener("click", closeResetPasswordModal);

  document

    .getElementById("cancelResetPassword")

    ?.addEventListener("click", closeResetPasswordModal);

  document

    .getElementById("saveResetPassword")

    ?.addEventListener("click", saveNewPassword);

  /* CLICK OVERLAY */

  document

    .getElementById("userModal")

    ?.addEventListener("click", function (event) {
      if (event.target === this) {
        closeUserModal();
      }
    });

  document

    .getElementById("confirmModal")

    ?.addEventListener("click", function (event) {
      if (event.target === this) {
        closeConfirmModal();
      }
    });

  document

    .getElementById("resetPasswordModal")

    ?.addEventListener("click", function (event) {
      if (event.target === this) {
        closeResetPasswordModal();
      }
    });

  /* ESC */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeUserModal();

      closeConfirmModal();

      closeResetPasswordModal();
    }
  });
}

/* =========================================

   RENDER USERS

\\========================================= */

function renderUsers() {
  const tableBody = document.getElementById("userTableBody");

  const emptyState = document.getElementById("emptyState");

  if (!tableBody || !emptyState) {
    return;
  }

  const search = (document.getElementById("userSearch")?.value || "")

    .trim()

    .toLowerCase();

  const status = document.getElementById("statusFilter")?.value || "all";

  /* FILTER */

  const filteredUsers = users.filter(function (user) {
    const matchSearch =
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);

    const matchStatus = status === "all" || user.status === status;

    return matchSearch && matchStatus;
  });

  /* HTML */

  tableBody.innerHTML = filteredUsers

    .map(function (user) {
      const isActive = user.status === "hoat_dong";

      return `

            <tr>

              <td>

                <div class="admin-user-info">

                  <span class="admin-user-avatar">

                    <i class="fa-solid fa-user"></i>

                  </span>

                  <strong>

                    ${escapeHTML(user.name)}

                  </strong>

                </div>

              </td>

              <td>

                ${escapeHTML(user.email)}

              </td>

              <td>

                <span class="admin-role-badge">

                  <i class="fa-solid ${
                    user.role === "admin" ? "fa-user-shield" : "fa-user"
                  }"></i>

                  ${user.role === "admin" ? "Quản trị viên" : "Người dùng"}

                </span>

              </td>

              <td>

                <span

                  class="

                    admin-status-badge

                    ${isActive ? "active" : "locked"}

                  "

                >

                  <i

                    class="

                      fa-solid

                      ${isActive ? "fa-circle-check" : "fa-lock"}

                    "

                  ></i>

                  ${isActive ? "Hoạt động" : "Đã khóa"}

                </span>

              </td>

              <td>

                ${escapeHTML(user.createdAt)}

              </td>

              <td>

                ${escapeHTML(user.lastLogin)}

              </td>

              <td>

                <div class="admin-row-actions">

                  <!-- EDIT -->

                  <button

                    class="admin-action-button"

                    type="button"

                    title="Chỉnh sửa"

                    onclick="editUser(${user.id})"

                  >

                    <i class="fa-solid fa-pen"></i>

                  </button>

                  <!-- LOCK -->

                  <button

                    class="admin-action-button"

                    type="button"

                    title="${isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}"

                    onclick="toggleUserStatus(${user.id})"

                  >

                    <i

                      class="

                        fa-solid

                        ${isActive ? "fa-lock" : "fa-lock-open"}

                      "

                    ></i>

                  </button>

                  <!-- PASSWORD -->

                  <button

                    class="admin-action-button"

                    type="button"

                    title="Đặt lại mật khẩu"

                    onclick="openResetPasswordModal(${user.id})"

                  >

                    <i class="fa-solid fa-key"></i>

                  </button>

                  <!-- DELETE -->

                  <button

                    class="

                      admin-action-button

                      delete

                    "

                    type="button"

                    title="Xóa người dùng"

                    onclick="deleteUser(${user.id})"

                  >

                    <i class="fa-solid fa-trash"></i>

                  </button>

                </div>

              </td>

            </tr>

          `;
    })

    .join("");

  emptyState.style.display = filteredUsers.length ? "none" : "flex";

  updateStatistics();
}

/* =========================================

   STATISTICS

\\========================================= */

function updateStatistics() {
  const total = users.length;

  const active = users.filter(function (user) {
    return user.status === "hoat_dong";
  }).length;

  const locked = users.filter(function (user) {
    return user.status === "khoa";
  }).length;

  setText("totalUsers", total);

  setText("activeUsers", active);

  setText("lockedUsers", locked);
}

/* =========================================

   ADD USER

\\========================================= */

function openAddUserModal() {
  const form = document.getElementById("userForm");

  form.reset();

  document.getElementById("editUserId").value = "";

  document.getElementById("userRole").value = "nguoi_dung";

  setText("userModalTitle", "Thêm người dùng");

  setText("saveUserText", "Thêm người dùng");

  const passwordField = document.getElementById("passwordField");

  const password = document.getElementById("newPassword");

  const note = document.getElementById("passwordNote");

  passwordField.style.display = "flex";

  note.style.display = "flex";

  password.required = true;

  password.value = "";

  document.getElementById("userModal").classList.add("show");
}

/* =========================================

   EDIT USER

\\========================================= */

function editUser(id) {
  const user = users.find(function (item) {
    return item.id === id;
  });

  if (!user) {
    return;
  }

  document.getElementById("editUserId").value = user.id;

  document.getElementById("fullName").value = user.name;

  document.getElementById("email").value = user.email;

  document.getElementById("userRole").value = user.role;

  setText("userModalTitle", "Chỉnh sửa người dùng");

  setText("saveUserText", "Lưu thay đổi");

  /*

    Khi sửa thông tin:

    không đổi mật khẩu ở đây.

    Đổi mật khẩu dùng nút chìa khóa.

  */

  document.getElementById("passwordField").style.display = "none";

  document.getElementById("passwordNote").style.display = "none";

  document.getElementById("newPassword").required = false;

  document.getElementById("userModal").classList.add("show");
}

/* =========================================

   SAVE USER

\\========================================= */

async function saveUser(event) {
  event.preventDefault();

  const id = Number(document.getElementById("editUserId").value);

  const name = document.getElementById("fullName").value.trim();

  const email = document.getElementById("email").value.trim().toLowerCase();

  const password = document.getElementById("newPassword").value;

  const role = document.getElementById("userRole").value;

  /* =========================================

     VALIDATE

  ========================================= */

  if (!name || !email) {
    adminNotify(
      "warning",

      "Thiếu thông tin",

      "Vui lòng nhập đầy đủ họ tên và email.",
    );

    return;
  }

  /* =========================================

     EDIT

     Tam thoi giu frontend.

     Buoc sau se noi update_user.php

  ========================================= */

  if (id) {
    try {
      const response = await fetch("../php/update_user.php", {
        method: "POST",

        credentials: "same-origin",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: id,

          name: name,

          email: email,

          role: role,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("smarthome_user");

        window.location.replace("login.html");

        return;
      }

      if (response.status === 403) {
        window.location.replace("dashboard.html");

        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Không thể cập nhật người dùng.");
      }

      closeUserModal();

      await loadUsers();

      adminNotify(
        "success",

        "Cập nhật thành công",

        "Thông tin người dùng đã được cập nhật.",
      );
    } catch (error) {
      console.error("Update User Error:", error);

      adminNotify("error", "Cập nhật thất bại", error.message);
    }

    return;
  }

  /* =========================================

     ADD USER

  ========================================= */

  if (password.length < 6) {
    adminNotify(
      "warning",

      "Mật khẩu chưa hợp lệ",

      "Mật khẩu phải có tối thiểu 6 ký tự.",
    );

    return;
  }

  /* =========================================

     BUTTON LOADING

  ========================================= */

  const saveButton = document.querySelector('#userForm button[type="submit"]');

  const saveText = document.getElementById("saveUserText");

  if (saveButton) {
    saveButton.disabled = true;
  }

  if (saveText) {
    saveText.textContent = "Đang tạo tài khoản...";
  }

  try {
    /* =====================================

       CALL PHP API

    ===================================== */

    const response = await fetch("../php/add_user.php", {
      method: "POST",

      credentials: "same-origin",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: name,

        email: email,

        password: password,

        role: role,
      }),
    });

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Phản hồi từ máy chủ không hợp lệ.");
    }

    /* =====================================

       SESSION EXPIRED

    ===================================== */

    if (response.status === 401) {
      localStorage.removeItem("smarthome_user");

      window.location.replace("login.html");

      return;
    }

    /* =====================================

       NOT ADMIN

    ===================================== */

    if (response.status === 403) {
      window.location.replace("dashboard.html");

      return;
    }

    /* =====================================

       API ERROR

    ===================================== */

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tạo tài khoản.");
    }

    /* =====================================

       SUCCESS

    ===================================== */

    closeUserModal();

    adminNotify(
      "success",

      "Thêm người dùng thành công",

      `${email} đã được thêm vào hệ thống.`,
    );

    /*

      Không users.push() nữa.

      Load lại trực tiếp từ MySQL

      để đảm bảo giao diện luôn khớp DB.

    */

    await loadUsers();
  } catch (error) {
    console.error("Add User Error:", error);

    adminNotify("error", "Không thể thêm người dùng", error.message);
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
    }

    if (saveText) {
      saveText.textContent = "Thêm người dùng";
    }
  }
}

/* =========================================

   CLOSE USER MODAL

\\========================================= */

function closeUserModal() {
  document.getElementById("userModal")?.classList.remove("show");
}

/* =========================================

   LOCK / UNLOCK

\\========================================= */

function toggleUserStatus(id) {
  const user = users.find(function (item) {
    return item.id === id;
  });

  if (!user) {
    return;
  }

  const locking = user.status === "hoat_dong";

  const newStatus = locking ? "khoa" : "hoat_dong";

  openConfirmModal(
    locking ? "Khóa tài khoản?" : "Mở khóa tài khoản?",

    locking
      ? `${user.email} sẽ không thể đăng nhập vào SmartHome.`
      : `${user.email} sẽ được phép đăng nhập trở lại.`,

    async function () {
      try {
        const response = await fetch("../php/update_status.php", {
          method: "POST",

          credentials: "same-origin",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: user.id,
            status: newStatus,
          }),
        });

        let data;

        try {
          data = await response.json();
        } catch (error) {
          throw new Error("Phản hồi từ máy chủ không hợp lệ.");
        }

        /* SESSION HẾT HẠN */

        if (response.status === 401) {
          localStorage.removeItem("smarthome_user");

          window.location.replace("login.html");

          return;
        }

        /* KHÔNG PHẢI ADMIN */

        if (response.status === 403) {
          window.location.replace("dashboard.html");

          return;
        }

        /* API ERROR */

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Không thể cập nhật trạng thái.");
        }

        /* LOAD LẠI MYSQL */

        await loadUsers();

        adminNotify(
          "success",

          locking ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",

          locking
            ? `${user.email} đã bị khóa.`
            : `${user.email} đã được mở khóa.`,
        );
      } catch (error) {
        console.error("Update Status Error:", error);

        adminNotify("error", "Cập nhật thất bại", error.message);
      }
    },
  );
}

/* =========================================

   DELETE

\\========================================= */

function deleteUser(id) {
  const user = users.find(function (item) {
    return item.id === id;
  });

  if (!user) {
    return;
  }

  openConfirmModal(
    "Xóa người dùng?",

    `Bạn có chắc muốn xóa tài khoản ${user.email}?`,

    async function () {
      try {
        const response = await fetch("../php/delete_user.php", {
          method: "POST",

          credentials: "same-origin",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: user.id,
          }),
        });

        let data;

        try {
          data = await response.json();
        } catch (error) {
          throw new Error("Phản hồi từ máy chủ không hợp lệ.");
        }

        /* SESSION EXPIRED */

        if (response.status === 401) {
          localStorage.removeItem("smarthome_user");

          window.location.replace("login.html");

          return;
        }

        /* NOT ADMIN */

        if (response.status === 403) {
          window.location.replace("dashboard.html");

          return;
        }

        /* API ERROR */

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Không thể xóa người dùng.");
        }

        /* LOAD LẠI DATABASE */

        await loadUsers();

        /* SUCCESS */

        adminNotify(
          "success",
          "Đã xóa người dùng",
          `${user.email} đã được xóa khỏi hệ thống.`,
        );
      } catch (error) {
        console.error("Delete User Error:", error);

        adminNotify("error", "Xóa người dùng thất bại", error.message);
      }
    },
  );
}

/* =========================================

   CONFIRM MODAL

\\========================================= */

function openConfirmModal(title, message, action) {
  setText("confirmTitle", title);

  setText("confirmMessage", message);

  pendingConfirmAction = action;

  document.getElementById("confirmModal").classList.add("show");
}

function closeConfirmModal() {
  document.getElementById("confirmModal")?.classList.remove("show");

  pendingConfirmAction = null;
}

function executeConfirmAction() {
  const action = pendingConfirmAction;

  closeConfirmModal();

  if (typeof action === "function") {
    action();
  }
}

/* =========================================

   RESET PASSWORD

\\========================================= */

function openResetPasswordModal(id) {
  const user = users.find(function (item) {
    return item.id === id;
  });

  if (!user) {
    return;
  }

  resetPasswordUserId = id;

  setText("resetPasswordEmail", user.email);

  document.getElementById("resetPasswordInput").value = "";

  document.getElementById("resetPasswordModal").classList.add("show");
}

function closeResetPasswordModal() {
  document.getElementById("resetPasswordModal")?.classList.remove("show");

  resetPasswordUserId = null;
}

async function saveNewPassword() {
  const password = document.getElementById("resetPasswordInput").value;

  /* =========================================
     VALIDATE
  ========================================= */

  if (password.length < 6) {
    adminNotify(
      "warning",
      "Mật khẩu chưa hợp lệ",
      "Mật khẩu phải có tối thiểu 6 ký tự.",
    );

    return;
  }

  /* =========================================
     FIND USER
  ========================================= */

  const user = users.find(function (item) {
    return item.id === resetPasswordUserId;
  });

  if (!user) {
    adminNotify(
      "error",
      "Không tìm thấy người dùng",
      "Không thể xác định tài khoản cần đặt lại mật khẩu.",
    );

    return;
  }

  /* =========================================
     BUTTON LOADING
  ========================================= */

  const saveButton = document.getElementById("saveResetPassword");

  if (saveButton) {
    saveButton.disabled = true;
  }

  try {
    /* =========================================
       CALL PHP
    ========================================= */

    const response = await fetch("../php/reset_password.php", {
      method: "POST",

      credentials: "same-origin",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: user.id,
        password: password,
      }),
    });

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Phản hồi từ máy chủ không hợp lệ.");
    }

    /* =========================================
       SESSION EXPIRED
    ========================================= */

    if (response.status === 401) {
      localStorage.removeItem("smarthome_user");

      window.location.replace("login.html");

      return;
    }

    /* =========================================
       NOT ADMIN
    ========================================= */

    if (response.status === 403) {
      window.location.replace("dashboard.html");

      return;
    }

    /* =========================================
       API ERROR
    ========================================= */

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể đặt lại mật khẩu.");
    }

    /* =========================================
       SUCCESS
    ========================================= */

    const email = user.email;

    closeResetPasswordModal();

    adminNotify(
      "success",
      "Đặt lại mật khẩu thành công",
      `Mật khẩu của ${email} đã được cập nhật.`,
    );
  } catch (error) {
    console.error("Reset Password Error:", error);

    adminNotify("error", "Đặt lại mật khẩu thất bại", error.message);
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
    }
  }
}

/* =========================================

   SHOW / HIDE NEW PASSWORD

\\========================================= */

function toggleNewPassword() {
  const password = document.getElementById("newPassword");

  const icon = document.getElementById("newPasswordEye");

  if (password.type === "password") {
    password.type = "text";

    icon.classList.remove("fa-eye");

    icon.classList.add("fa-eye-slash");
  } else {
    password.type = "password";

    icon.classList.remove("fa-eye-slash");

    icon.classList.add("fa-eye");
  }
}

/* =========================================

   NOTIFICATION

\\========================================= */

function adminNotify(type, title, message) {
  if (typeof showNotification === "function") {
    showNotification({
      type: type,

      title: title,

      message: message,
    });
  } else {
    console.log(`[${type}] ${title}: ${message}`);
  }
}

/* =========================================

   SET TEXT

\\========================================= */

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

/* =========================================

   ESCAPE HTML

\\========================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}
