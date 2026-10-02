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
setTimeout(() => {
  showNotification({
    type: "success",
    title: "Kết nối thành công",
    message: "Hệ thống Smart Home đã sẵn sàng.",
  });
}, 1000);
setTimeout(() => {
  showEmergencyAlert({
    id: "test-mq135-001",
    sensor: "MQ-135 · Chất lượng không khí",
    title: "Phát hiện chất lượng không khí nguy hiểm!",
    message:
      "Nồng độ khí đang vượt ngưỡng an toàn. Vui lòng kiểm tra khu vực ngay.",
    value: "780 ppm",
    location: "Phòng khách",
    time: new Date().toLocaleString("vi-VN"),
  });
}, 3000);
