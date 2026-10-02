/* =========================================
   SETTINGS PAGE - FRONTEND DEMO
========================================= */

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");

const temperatureMin = document.getElementById("temperatureMin");
const temperatureMax = document.getElementById("temperatureMax");
const humidityMin = document.getElementById("humidityMin");
const humidityMax = document.getElementById("humidityMax");
const airWarning = document.getElementById("airWarning");
const airDanger = document.getElementById("airDanger");

const webNotification = document.getElementById("webNotification");
const blynkNotification = document.getElementById("blynkNotification");
const importantOnly = document.getElementById("importantOnly");

const saveAccountButton = document.getElementById("saveAccountButton");
const changePasswordButton = document.getElementById("changePasswordButton");
const saveThresholdButton = document.getElementById("saveThresholdButton");
const saveNotificationButton = document.getElementById(
  "saveNotificationButton",
);

const settingsToast = document.getElementById("settingsToast");
const settingsToastMessage = document.getElementById("settingsToastMessage");

let toastTimer;

/* =========================================
   TOAST
========================================= */

function showSettingsToast(message, type = "success") {
  if (!settingsToast || !settingsToastMessage) return;

  settingsToastMessage.textContent = message;

  settingsToast.classList.remove("error");

  if (type === "error") {
    settingsToast.classList.add("error");

    const icon = settingsToast.querySelector("i");
    if (icon) {
      icon.className = "fa-solid fa-circle-exclamation";
    }
  } else {
    const icon = settingsToast.querySelector("i");
    if (icon) {
      icon.className = "fa-solid fa-circle-check";
    }
  }

  settingsToast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    settingsToast.classList.remove("show");
  }, 2800);
}

/* =========================================
   ACCOUNT
========================================= */

if (saveAccountButton) {
  saveAccountButton.addEventListener("click", function () {
    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();

    if (!nameValue || !emailValue) {
      showSettingsToast("Vui lòng nhập đầy đủ tên và email.", "error");
      return;
    }

    /*
      DEMO FRONTEND.
      Sau này thay bằng fetch() gửi dữ liệu
      đến PHP/API để cập nhật tài khoản.
    */

    showSettingsToast("Đã lưu thông tin tài khoản.");
  });
}

if (changePasswordButton) {
  changePasswordButton.addEventListener("click", function () {
    if (!currentPassword.value.trim() || !newPassword.value.trim()) {
      showSettingsToast(
        "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.",
        "error",
      );
      return;
    }

    if (newPassword.value.length < 6) {
      showSettingsToast("Mật khẩu mới cần ít nhất 6 ký tự.", "error");
      return;
    }

    /*
      DEMO FRONTEND.
      Không kiểm tra mật khẩu thật ở JavaScript.
      Sau này PHP/backend phải xác thực mật khẩu cũ.
    */

    currentPassword.value = "";
    newPassword.value = "";

    showSettingsToast("Yêu cầu đổi mật khẩu đã được ghi nhận.");
  });
}

/* =========================================
   THRESHOLD VALIDATION
========================================= */

function getNumber(element) {
  return Number(element.value);
}

function validateThresholds() {
  const tempMin = getNumber(temperatureMin);
  const tempMax = getNumber(temperatureMax);

  const humMin = getNumber(humidityMin);
  const humMax = getNumber(humidityMax);

  const airWarn = getNumber(airWarning);
  const airDangerValue = getNumber(airDanger);

  if (tempMin >= tempMax) {
    showSettingsToast("Ngưỡng nhiệt độ thấp phải nhỏ hơn ngưỡng cao.", "error");
    return false;
  }

  if (humMin < 0 || humMax > 100 || humMin >= humMax) {
    showSettingsToast(
      "Ngưỡng độ ẩm phải nằm trong 0–100% và thấp < cao.",
      "error",
    );
    return false;
  }

  if (airWarn <= 0 || airDangerValue <= airWarn) {
    showSettingsToast(
      "Ngưỡng MQ-135 nguy hiểm phải lớn hơn ngưỡng cảnh báo.",
      "error",
    );
    return false;
  }

  return true;
}

if (saveThresholdButton) {
  saveThresholdButton.addEventListener("click", function () {
    if (!validateThresholds()) return;

    /*
      DEMO FRONTEND.
      Khi có database, gửi các ngưỡng này
      đến API/PHP và lưu trong bảng settings.
    */

    showSettingsToast("Đã lưu ngưỡng cảnh báo.");
  });
}

/* =========================================
   NOTIFICATIONS
========================================= */

if (saveNotificationButton) {
  saveNotificationButton.addEventListener("click", function () {
    const notificationSettings = {
      web: webNotification.checked,
      blynk: blynkNotification.checked,
      importantOnly: importantOnly.checked,
    };

    console.log("Notification settings:", notificationSettings);

    /*
      DEMO FRONTEND.
      Sau này gửi notificationSettings
      đến backend.
    */

    showSettingsToast("Đã lưu cài đặt thông báo.");
  });
}

/* FAMILY + DOOR SECURITY - FRONTEND DEMO */
const memberList = document.getElementById("memberList");
const rfidList = document.getElementById("rfidList");
const fingerprintList = document.getElementById("fingerprintList");
const memberModal = document.getElementById("memberModal");
const rfidModal = document.getElementById("rfidModal");
const fingerprintModal = document.getElementById("fingerprintModal");

let familyMembers = [{ id: 1, name: "Người dùng", role: "Quản trị viên" }];
let rfidCards = [{ id: 1, owner: "Người dùng", code: "RFID-001" }];
let fingerprints = [{ id: 1, owner: "Người dùng", fingerprintId: "1" }];

function renderFamilyMembers() {
  if (!memberList) return;
  memberList.innerHTML = familyMembers
    .map(
      (m) => `
    <div class="member-item">
      <div class="member-main">
        <div class="member-avatar"><i class="fa-solid fa-user"></i></div>
        <div><strong>${m.name}</strong><span>${m.role}</span></div>
      </div>
      <button class="remove-item-button remove-member" data-id="${m.id}" type="button">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>`,
    )
    .join("");
  document.querySelectorAll(".remove-member").forEach(
    (btn) =>
      (btn.onclick = () => {
        familyMembers = familyMembers.filter(
          (m) => m.id !== Number(btn.dataset.id),
        );
        renderFamilyMembers();
        showSettingsToast("Đã xóa thành viên khỏi danh sách demo.");
      }),
  );
}

function renderRfidCards() {
  if (!rfidList) return;
  rfidList.innerHTML = rfidCards.length
    ? rfidCards
        .map(
          (c) => `
    <div class="credential-item">
      <div class="credential-main">
        <div class="credential-icon"><i class="fa-solid fa-id-card"></i></div>
        <div><strong>${c.owner}</strong><span>${c.code}</span></div>
      </div>
      <button class="remove-item-button remove-rfid" data-id="${c.id}" type="button">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>`,
        )
        .join("")
    : `<div class="empty-credential">Chưa có thẻ RFID nào.</div>`;
  document.querySelectorAll(".remove-rfid").forEach(
    (btn) =>
      (btn.onclick = () => {
        rfidCards = rfidCards.filter((c) => c.id !== Number(btn.dataset.id));
        renderRfidCards();
        showSettingsToast("Đã xóa thẻ RFID.");
      }),
  );
}

function renderFingerprints() {
  if (!fingerprintList) return;
  fingerprintList.innerHTML = fingerprints.length
    ? fingerprints
        .map(
          (f) => `
    <div class="credential-item">
      <div class="credential-main">
        <div class="credential-icon fingerprint"><i class="fa-solid fa-fingerprint"></i></div>
        <div><strong>${f.owner}</strong><span>ID vân tay: ${f.fingerprintId}</span></div>
      </div>
      <button class="remove-item-button remove-fingerprint" data-id="${f.id}" type="button">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>`,
        )
        .join("")
    : `<div class="empty-credential">Chưa đăng ký vân tay nào.</div>`;
  document.querySelectorAll(".remove-fingerprint").forEach(
    (btn) =>
      (btn.onclick = () => {
        fingerprints = fingerprints.filter(
          (f) => f.id !== Number(btn.dataset.id),
        );
        renderFingerprints();
        showSettingsToast("Đã xóa vân tay.");
      }),
  );
}

function openSettingsModal(modal) {
  if (!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("settings-modal-open");
}
function closeSettingsModal(modal) {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".settings-modal-overlay.show"))
    document.body.classList.remove("settings-modal-open");
}
function setupModal(modal, openId, closeId, cancelId) {
  document
    .getElementById(openId)
    ?.addEventListener("click", () => openSettingsModal(modal));
  document
    .getElementById(closeId)
    ?.addEventListener("click", () => closeSettingsModal(modal));
  document
    .getElementById(cancelId)
    ?.addEventListener("click", () => closeSettingsModal(modal));
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeSettingsModal(modal);
  });
}
setupModal(
  memberModal,
  "addMemberButton",
  "closeMemberModal",
  "cancelMemberButton",
);
setupModal(rfidModal, "addRfidButton", "closeRfidModal", "cancelRfidButton");
setupModal(
  fingerprintModal,
  "addFingerprintButton",
  "closeFingerprintModal",
  "cancelFingerprintButton",
);

document
  .getElementById("confirmMemberButton")
  ?.addEventListener("click", () => {
    const name = document.getElementById("memberName").value.trim();
    const role = document.getElementById("memberRole").value;
    if (!name) {
      showSettingsToast("Vui lòng nhập tên thành viên.", "error");
      return;
    }
    familyMembers.push({ id: Date.now(), name, role });
    document.getElementById("memberName").value = "";
    renderFamilyMembers();
    closeSettingsModal(memberModal);
    showSettingsToast("Đã thêm thành viên gia đình.");
  });

document.getElementById("confirmRfidButton")?.addEventListener("click", () => {
  const owner = document.getElementById("rfidOwner").value.trim();
  const code = document.getElementById("rfidCode").value.trim();
  if (!owner || !code) {
    showSettingsToast("Vui lòng nhập chủ thẻ và mã UID.", "error");
    return;
  }
  rfidCards.push({ id: Date.now(), owner, code });
  document.getElementById("rfidOwner").value = "";
  document.getElementById("rfidCode").value = "";
  renderRfidCards();
  closeSettingsModal(rfidModal);
  showSettingsToast("Đã thêm thẻ RFID.");
});

document
  .getElementById("confirmFingerprintButton")
  ?.addEventListener("click", () => {
    const owner = document.getElementById("fingerprintOwner").value.trim();
    const fingerprintId = document.getElementById("fingerprintId").value.trim();
    if (!owner || !fingerprintId) {
      showSettingsToast("Vui lòng nhập người sử dụng và ID vân tay.", "error");
      return;
    }
    fingerprints.push({ id: Date.now(), owner, fingerprintId });
    document.getElementById("fingerprintOwner").value = "";
    document.getElementById("fingerprintId").value = "";
    renderFingerprints();
    closeSettingsModal(fingerprintModal);
    showSettingsToast("Đã đăng ký vân tay.");
  });

document.getElementById("saveDoorPinButton")?.addEventListener("click", () => {
  const input = document.getElementById("doorPin");
  const pin = input.value.trim();
  if (!/^\d{4,6}$/.test(pin)) {
    showSettingsToast("Mã PIN cửa phải gồm 4–6 chữ số.", "error");
    return;
  }
  input.value = "";
  showSettingsToast("Đã cập nhật mã PIN cửa trong bản demo.");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    document
      .querySelectorAll(".settings-modal-overlay.show")
      .forEach(closeSettingsModal);
});

renderFamilyMembers();
renderRfidCards();
renderFingerprints();
