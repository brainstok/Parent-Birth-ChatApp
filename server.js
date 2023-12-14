require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const app = express();
const swagger = require("swagger-generator-express");

app.use(
  // prettier-ignore
  cors({
    origin: ["http://localhost:2200", /\parentbirth-ui.vercel\.app$/, /\parentbirth\.com$/ , /\wearerobyn.vercel\.app$/ ],
  })
);

const server = http.createServer(app);
const io = socketio(server);

module.exports.app = app;
app.set("io", io);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes Imports
const users = require("./routes/api/users");
const messages = require("./routes/api/messages");
const calls = require("./routes/api/calls");
const settings = require("./routes/api/settings");
const patients = require("./routes/api/patients");
const webhooks = require("./routes/api/webhooks");
const crm = require("./routes/api/crm");
const doulas = require("./routes/api/doulas");
const resources = require("./routes/api/resources");

// Route Delegations
app.use("/api/messages", messages);
app.use("/api/calls", calls);
app.use("/api/users", users);
app.use("/api/settings", settings);
app.use("/api/patients", patients);
app.use("/api/crm", crm);
app.use("/api/webhooks", webhooks);
app.use("/api/doulas", doulas);
app.use("/api/resources", resources);

const PORT = process.env.PORT || 4200;

const options = {
  title: "ParentBirth",
  version: "1.0.0",
  host: `localhost:${PORT}`,
  basePath: "/",
  schemes: ["http", "https"],
  securityDefinitions: {
    Bearer: {
      description:
        "Example value:- Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQwMGJhNTJjYjJjM",
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [{ Bearer: [] }],
  defaultSecurity: "Bearer",
};

swagger.serveSwagger(app, "/api-docs", options, {
  routePath: "./routes/api/",
});

// ControllersSetting
const { handleOutBoundMessage } = require("./controllers/messages");

const {
  scheduleIsAwayAutomation,
} = require("./scripts/scheduleIsAwayAutomation");

scheduleIsAwayAutomation("0 20 * * *", true);
scheduleIsAwayAutomation("0 8 * * *", false);

app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

io.on("connection", (socket) => {
  // Listen if client has joined the conversation
  socket.on("joinConversation", (phoneNumber) => {
    console.log("Joining: ", phoneNumber);
    socket.join(phoneNumber);
  });

  // Listen if client has left the conversation and leave ALL conversations
  socket.on("leaveConversation", () => {
    Array.from(socket.rooms).forEach((roomId) => {
      console.log("Leaving: ", roomId);
      socket.leave(roomId);
    });
  });
});

server.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
