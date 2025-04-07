const express = require("express");
const http = require("http");
const { SerialPort, ReadlineParser } = require("serialport");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Porta Serial do Arduino
const port = new SerialPort({
  path: "COM7", // Altere para a porta do Arduino
  baudRate: 9600,
});

// Parser para ler os dados da Serial
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// Envia os dados do Arduino para o cliente em tempo real
parser.on("data", (data) => {
  try {
    const jsonData = JSON.parse(data.trim());
    io.emit("sensorData", jsonData); // Envia os dados para o cliente
    console.log("Dado recebido:", jsonData);
  } catch (error) {
    console.error("Erro ao interpretar JSON:", error);
  }
});

// Configuração do servidor Express
app.use(express.static("public")); // Pasta para arquivos HTML/CSS/JS

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Inicializa o servidor
server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});