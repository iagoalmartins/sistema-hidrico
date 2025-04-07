const socket = io(); // Conecta ao servidor Socket.IO

let jsonData = []; // Array que será preenchido com dados
const maxDataPoints = 30; // Máximo de pontos no gráfico
const currentValueElement = document.getElementById("current-value");
const dataTable = document.getElementById("data-table").querySelector("tbody");

const ctx = document.getElementById("data-chart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Distância (cm)",
        data: [],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: "Distância (cm)",
        },
        min: 0,
        max: 100,
      },
    },
  },
});

// Atualiza a interface com os dados recebidos
function updateUI(newData) {
  const now = new Date().toLocaleTimeString();

  // Atualiza o valor atual
  currentValueElement.textContent = `${newData.distancia} cm`;

  // Atualiza o gráfico
  if (chart.data.labels.length >= maxDataPoints) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(newData.distancia);
  chart.update();

  // Atualiza a tabela
  const row = document.createElement("tr");
  const timestampCell = document.createElement("td");
  const valueCell = document.createElement("td");

  timestampCell.textContent = now;
  valueCell.textContent = `${newData.distancia} cm`;

  row.appendChild(timestampCell);
  row.appendChild(valueCell);

  dataTable.insertBefore(row, dataTable.firstChild);

  // Limita a tabela aos últimos 10 valores
  while (dataTable.rows.length > 10) {
    dataTable.deleteRow(-1);
  }
}

// Recebe os dados do servidor via Socket.IO
socket.on("sensorData", (data) => {
  updateUI(data);
});

