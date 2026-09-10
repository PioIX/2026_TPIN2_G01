const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${PORT}/`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

let contador = 0;

io.on("connection", (socket) => {
  const req = socket.request;

  socket.on("joinRoom", (data) => {
    if (req.session.room != undefined && req.session.room.length > 0) {
      socket.leave(req.session.room);
    }
    req.session.room = data.room;
    socket.join(req.session.room);

    io.to(req.session.room).emit("chat-messages", {
      user: req.session.user,
      room: req.session.room,
    });
  });

  socket.on("pingAll", (data) => {
    console.log("PING ALL:", data);
    io.emit("pingAll", { event: "Ping to all", message: data });
  });

  socket.on("sendMessage", (data) => {
    io.to(req.session.room).emit("newMessage", {
      room: req.session.room,
      message: data.message,
    });
  });

  socket.on("eventoPersonalizado", () => {
    contador++;
    socket.emit("respuestaPersonalizada", { contador });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
});

//Agarrar usuarios de la base de datos
app.get('/usuariosW', async function (req, res) {
    try {
      let respuesta = await realizarQuery('SELECT * FROM Usuarios WHERE mail="${req.query.mail}" AND contrasena="${req.query.contrasena}"');
      res.send(respuesta);
    }
    catch (error) {
      res.status(500).send({ error: error.message });
    }
})

//Registro para agregar un usuario a la base de datos, o sea que el usuario ponga un nombre en el campo, un mail, una contraseña y cuando toca el boton registro se guarde ese usuario y se sume a la base de datos
app.post('/usuariosW', async function (req, res) {
  try {
    let usuarioExistente = await realizarQuery('SELECT * FROM Usuarios WHERE mail="${req.body.mail}"');
    console.log(usuarioExistente)
    if (usuarioExistente.length > 0) {
      res.send("El usuario ya existe");
    } else {
      await realizarQuery('INSERT INTO Usuarios (nombre_usuario,mail,contrasena) VALUES ("${req.body.nombre_usuario}","${req.body.mail}","${req.body.contrasena}")');
      res.send({message:"usuario agregado"})
    }

    } catch (error) {
      res.status(500).send({ error: error.message })
    }
})

//Iniciar sesion (login)
app.post('/login', async function (req, res) {
  try {
    let usuario = await realizarQuery(`SELECT * FROM Usuarios WHERE mail="${req.body.mail}" AND contrasena="${req.body.contrasena}"`);
    if (usuario.length > 0) {
      res.send({
        message: "Login exitoso"
      });
    } else {
      res.send({
        message: "Mail o contraseña incorrectos"
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});