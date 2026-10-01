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
});
