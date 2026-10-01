/* =========================================
   ELEMENTS
========================================= */

const openDoorButton = document.getElementById("openDoorButton");

const doorModal = document.getElementById("doorModal");

const closeDoorModal = document.getElementById("closeDoorModal");

const cancelOpenDoor = document.getElementById("cancelOpenDoor");

const confirmOpenDoor = document.getElementById("confirmOpenDoor");

const doorState = document.getElementById("doorState");

const doorStateIcon = document.getElementById("doorStateIcon");

const doorVisualIcon = document.getElementById("doorVisualIcon");

const lightSwitch = document.getElementById("lightSwitch");

const lightStatus = document.getElementById("lightStatus");

const alarmSwitch = document.getElementById("alarmSwitch");

const alarmStatus = document.getElementById("alarmStatus");

const deviceToast = document.getElementById("deviceToast");

const toastMessage = document.getElementById("toastMessage");
const doorLoadingOverlay = document.getElementById("doorLoadingOverlay");

const loadingLockIcon = document.getElementById("loadingLockIcon");

const doorLoadingTitle = document.getElementById("doorLoadingTitle");

const doorLoadingDescription = document.getElementById(
  "doorLoadingDescription",
);
/* =========================================
   DOOR MODAL
========================================= */

function showDoorModal() {
  if (!doorModal) {
    return;
  }

  doorModal.classList.add("show");

  doorModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}

function hideDoorModal() {
  if (!doorModal) {
    return;
  }

  doorModal.classList.remove("show");

  doorModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");
}

/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(message) {
  if (!deviceToast || !toastMessage) {
    return;
  }

  toastMessage.textContent = message;

  deviceToast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    deviceToast.classList.remove("show");
  }, 3000);
}

/* =========================================
   OPEN DOOR
========================================= */

function openDoor() {
  if (!doorLoadingOverlay) {
    return;
  }

  /* Reset trạng thái */

  doorLoadingOverlay.classList.remove("success");

  if (loadingLockIcon) {
    loadingLockIcon.className = "fa-solid fa-lock";
  }

  if (doorLoadingTitle) {
    doorLoadingTitle.textContent = "Đang mở cửa...";
  }

  if (doorLoadingDescription) {
    doorLoadingDescription.textContent = "Vui lòng chờ trong giây lát";
  }

  /* Hiện màn hình loading */

  doorLoadingOverlay.classList.add("show");

  doorLoadingOverlay.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  if (openDoorButton) {
    openDoorButton.disabled = true;
  }

  /*
    DEMO:
    mô phỏng gửi lệnh mở cửa trong 3 giây
  */

  setTimeout(function () {
    showDoorSuccess();
  }, 3000);
}
function showDoorSuccess() {
  if (!doorLoadingOverlay) {
    return;
  }

  /* Dừng vòng xoay */

  doorLoadingOverlay.classList.add("success");

  /* Đổi ổ khóa */

  if (loadingLockIcon) {
    loadingLockIcon.className = "fa-solid fa-lock-open";
  }

  /* Đổi nội dung */

  if (doorLoadingTitle) {
    doorLoadingTitle.textContent = "Mở cửa thành công";
  }

  if (doorLoadingDescription) {
    doorLoadingDescription.textContent = "Cửa chính đã được mở từ xa";
  }

  /* Cập nhật card cửa */

  if (doorState) {
    doorState.textContent = "Đang mở";
  }

  if (doorStateIcon) {
    doorStateIcon.className = "fa-solid fa-lock-open";
  }

  if (doorVisualIcon) {
    doorVisualIcon.classList.add("open");
  }

  if (openDoorButton) {
    openDoorButton.innerHTML = `
      <i class="fa-solid fa-door-open"></i>
      <span>Cửa đang mở</span>
    `;
  }

  /*
    Cho người dùng nhìn trạng thái
    thành công khoảng 1.2 giây
  */

  setTimeout(function () {
    hideDoorLoading();
  }, 1200);
}
function finishOpenDoor() {
  /*
    GIAI ĐOẠN 2:
    Cửa đã mở thành công
  */

  if (doorState) {
    doorState.textContent = "Đang mở";
  }

  if (doorStateIcon) {
    doorStateIcon.className = "fa-solid fa-lock-open";
  }

  if (doorVisualIcon) {
    doorVisualIcon.classList.remove("opening");

    doorVisualIcon.classList.add("open");
  }

  if (openDoorButton) {
    openDoorButton.classList.remove("loading");

    openDoorButton.innerHTML = `
      <i class="fa-solid fa-door-open"></i>
      <span>Cửa đang mở</span>
    `;
  }

  showToast("Cửa chính đã được mở từ xa.");

  /*
    DEMO:
    Sau khi cửa mở 5 giây
    thì chuyển về trạng thái khóa.
  */

  setTimeout(function () {
    closeDoor();
  }, 5000);
}

/* =========================================
   CLOSE DOOR
========================================= */

function closeDoor() {
  if (doorState) {
    doorState.textContent = "Đã khóa";
  }

  if (doorStateIcon) {
    doorStateIcon.className = "fa-solid fa-lock";
  }

  if (doorVisualIcon) {
    doorVisualIcon.classList.remove("opening");

    doorVisualIcon.classList.remove("open");
  }

  if (openDoorButton) {
    openDoorButton.disabled = false;

    openDoorButton.classList.remove("loading");

    openDoorButton.innerHTML = `
      <i class="fa-solid fa-lock-open"></i>
      <span>Mở cửa từ xa</span>
    `;
  }
}

/* =========================================
   LIGHT
========================================= */

function updateLight() {
  if (!lightSwitch || !lightStatus) {
    return;
  }

  if (lightSwitch.checked) {
    lightStatus.textContent = "Đang bật";

    showToast("Đèn phòng khách đã được bật.");
  } else {
    lightStatus.textContent = "Đã tắt";

    showToast("Đèn phòng khách đã được tắt.");
  }
}

/* =========================================
   ALARM
========================================= */

function updateAlarm() {
  if (!alarmSwitch || !alarmStatus) {
    return;
  }

  if (alarmSwitch.checked) {
    alarmStatus.textContent = "Đang phát còi";

    showToast("Còi cảnh báo đã được bật.");
  } else {
    alarmStatus.textContent = "Sẵn sàng";

    showToast("Còi cảnh báo đã được tắt.");
  }
}

/* =========================================
   EVENTS
========================================= */

if (openDoorButton) {
  openDoorButton.addEventListener("click", showDoorModal);
}

if (closeDoorModal) {
  closeDoorModal.addEventListener("click", hideDoorModal);
}

if (cancelOpenDoor) {
  cancelOpenDoor.addEventListener("click", hideDoorModal);
}

if (confirmOpenDoor) {
  confirmOpenDoor.addEventListener("click", function () {
    hideDoorModal();

    openDoor();
  });
}

/* Click vùng tối để đóng */

if (doorModal) {
  doorModal.addEventListener("click", function (event) {
    if (event.target === doorModal) {
      hideDoorModal();
    }
  });
}

/* ESC */

document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    doorModal &&
    doorModal.classList.contains("show")
  ) {
    hideDoorModal();
  }
});

/* Light */

if (lightSwitch) {
  lightSwitch.addEventListener("change", updateLight);
}

/* Alarm */

if (alarmSwitch) {
  alarmSwitch.addEventListener("change", updateAlarm);
}
function hideDoorLoading() {
  if (!doorLoadingOverlay) {
    return;
  }

  doorLoadingOverlay.classList.remove("show");

  doorLoadingOverlay.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");

  /*
    Sau khi overlay biến mất mới
    reset class success.
  */

  setTimeout(function () {
    doorLoadingOverlay.classList.remove("success");
  }, 400);

  showToast("Cửa chính đã được mở từ xa.");

  /*
    DEMO:
    giữ trạng thái mở 5 giây
  */

  setTimeout(function () {
    closeDoor();
  }, 5000);
}
