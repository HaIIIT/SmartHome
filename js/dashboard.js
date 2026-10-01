/* =========================================
   DASHBOARD ELEMENTS
========================================= */

const temperatureValue = document.getElementById("temperatureValue");

const humidityValue = document.getElementById("humidityValue");

const airQualityValue = document.getElementById("airQualityValue");

const motionValue = document.getElementById("motionValue");

/* =========================================
   UPDATE SENSOR DATA
========================================= */

function updateSensorData(data) {
  if (temperatureValue) {
    temperatureValue.textContent = data.temperature;
  }

  if (humidityValue) {
    humidityValue.textContent = data.humidity;
  }

  if (airQualityValue) {
    airQualityValue.textContent = data.airQuality;
  }

  if (motionValue) {
    motionValue.textContent = data.motion ? "Có" : "Không";
  }
}

/* =========================================
   DEMO DATA
========================================= */

/*
  Đây chỉ là dữ liệu giả để dựng giao diện.

  Sau này dữ liệu sẽ lấy từ server/API.
*/

const demoSensorData = {
  temperature: 28,

  humidity: 72,

  airQuality: "Tốt",

  motion: false,
};

/* =========================================
   START DASHBOARD
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  updateSensorData(demoSensorData);
});
