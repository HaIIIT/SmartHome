/* =========================================
   ELEMENTS
========================================= */

const sensorTemperature = document.getElementById("sensorTemperature");

const sensorHumidity = document.getElementById("sensorHumidity");

const sensorAir = document.getElementById("sensorAir");

const sensorMotion = document.getElementById("sensorMotion");

const temperatureBar = document.getElementById("temperatureBar");

const humidityBar = document.getElementById("humidityBar");

const airBar = document.getElementById("airBar");

const motionBar = document.getElementById("motionBar");

const motionStatus = document.getElementById("motionStatus");

/* =========================================
   TIME
========================================= */

function getCurrentTime() {
  const now = new Date();

  return now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* =========================================
   UPDATE TIME
========================================= */

function updateSensorTime() {
  const time = getCurrentTime();

  const ids = ["temperatureTime", "humidityTime", "airTime", "motionTime"];

  ids.forEach(function (id) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = time;
    }
  });
}

/* =========================================
   UPDATE SENSOR
========================================= */

function updateSensors(data) {
  if (sensorTemperature) {
    sensorTemperature.textContent = data.temperature;
  }

  if (sensorHumidity) {
    sensorHumidity.textContent = data.humidity;
  }

  if (sensorAir) {
    sensorAir.textContent = data.airQuality;
  }

  if (sensorMotion) {
    sensorMotion.textContent = data.motion ? "Có" : "Không";
  }

  /* Progress */

  if (temperatureBar) {
    temperatureBar.style.width = Math.min(data.temperature * 2, 100) + "%";
  }

  if (humidityBar) {
    humidityBar.style.width = Math.min(data.humidity, 100) + "%";
  }

  if (airBar) {
    airBar.style.width = data.airQuality === "Tốt" ? "35%" : "75%";
  }

  if (motionBar) {
    motionBar.style.width = data.motion ? "100%" : "10%";
  }

  /* Motion status */

  if (motionStatus) {
    if (data.motion) {
      motionStatus.textContent = "Phát hiện";

      motionStatus.classList.remove("normal");
    } else {
      motionStatus.textContent = "An toàn";

      motionStatus.classList.add("normal");
    }
  }

  updateSensorTime();
}

/* =========================================
   DEMO DATA
========================================= */

const demoData = {
  temperature: 28,

  humidity: 72,

  airQuality: "Tốt",

  motion: false,
};

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  updateSensors(demoData);

  renderDoorHistory(doorHistoryData);
});
/* =========================================
   DOOR ACCESS HISTORY
========================================= */

const doorHistoryBody = document.getElementById("doorHistoryBody");

const doorHistoryData = [
  {
    name: "Người dùng",
    detail: "Điều khiển từ xa",
    method: "remote",
    time: "15:20 - 01/10/2026",
    success: true,
  },

  {
    name: "Người dùng",
    detail: "RFID-001",
    method: "rfid",
    time: "14:32 - 01/10/2026",
    success: true,
  },

  {
    name: "Không xác định",
    detail: "Thẻ RFID không hợp lệ",
    method: "rfid",
    time: "09:41 - 01/10/2026",
    success: false,
  },

  {
    name: "Người dùng",
    detail: "Điều khiển từ xa",
    method: "remote",
    time: "08:15 - 01/10/2026",
    success: true,
  },
];

/* =========================================
   RENDER DOOR HISTORY
========================================= */

function renderDoorHistory(data) {
  if (!doorHistoryBody) {
    return;
  }

  doorHistoryBody.innerHTML = "";

  data.forEach(function (access) {
    const row = document.createElement("tr");

    const isRemote = access.method === "remote";

    const methodIcon = isRemote ? "fa-mobile-screen-button" : "fa-id-card";

    const methodName = isRemote ? "Mở từ xa" : "RFID";

    row.innerHTML = `

      <td>

        <div class="access-user">

          <div class="access-avatar">

            <i class="fa-solid ${
              access.success ? "fa-user" : "fa-user-xmark"
            }"></i>

          </div>

          <div class="access-user-info">

            <strong>
              ${access.name}
            </strong>

            <span>
              ${access.detail}
            </span>

          </div>

        </div>

      </td>


      <td>

        <span class="access-method">

          <i class="fa-solid ${methodIcon}"></i>

          ${methodName}

        </span>

      </td>


      <td>
        ${access.time}
      </td>


      <td>

        <span class="
          access-result
          ${access.success ? "success" : "denied"}
        ">

          <i class="fa-solid ${access.success ? "fa-check" : "fa-xmark"}"></i>

          ${access.success ? "Cho phép" : "Từ chối"}

        </span>

      </td>

    `;

    doorHistoryBody.appendChild(row);
  });
}
