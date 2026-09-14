const express = require("express");
var bodyParser = require('body-parser'); //Convierte los JSON
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const { realizarQuery } = require('./modulos/mysql');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
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


io.on('connection', function(socket){

  // El cliente se une a la room del chat que tiene abierto
  socket.on('unirseChat', function(idChat){
    socket.join('chat_' + idChat);
  });

  // El cliente sale de la room cuando cierra el chat (opcional pero recomendado)
  socket.on('salirChat', function(idChat){
    socket.leave('chat_' + idChat);
  });

  // Envío de un mensaje nuevo
  socket.on('enviarMensaje', async function(data){
    try {
      // data = { id_usuario, id_chat, texto }

      // Guardo el mensaje en la base para que el historial persista
      const resultado = await realizarQuery(`INSERT INTO Mensajes (texto, fecha, id_usuario, id_chat) VALUES ('${data.texto}', NOW(), ${data.id_usuario}, ${data.id_chat})`);

      // Busco el nombre del usuario para mandarlo junto al mensaje
      const usuario = await realizarQuery(`SELECT nombre FROM UsuariosW WHERE id_usuario=${data.id_usuario}`);

      const mensaje = {
        id_mensaje: resultado.insertId,
        texto: data.texto,
        fecha: new Date(),
        id_usuario: data.id_usuario,
        nombre: usuario[0].nombre,
        id_chat: data.id_chat
      };

      // Emito el mensaje a todos los conectados a ese chat (incluido quien lo mandó)
      io.to('chat_' + data.id_chat).emit('nuevoMensaje', mensaje);

    } catch (error) {
      socket.emit('errorMensaje', error.message);
    }
  });

  socket.on('disconnect', function(){
    // Socket.IO saca automáticamente al socket de todas las rooms al desconectarse
  });

});

app.get('/', function(req, res){
    res.status(200).send({ 
        message: 'Funciona'
    });
});

app.get('/listachats', async function(req, res){
  try {
    chats=await realizarQuery(`SELECT Chats.id_chat,Chats.nombre,Chats.descripcion FROM Chats inner join ChatsUsuarios on ChatsUsuarios.id_chat=Chats.id_chat inner join UsuariosW on UsuariosW.id_usuario=ChatsUsuarios.id_usuario Where UsuariosW.id_usuario=${req.query.usuario}`)
    res.send(chats)

  } catch (error) {
    res.send(error.message)
  }

});

app.post('/crearChat', async function(req, res){
  try {
    const idUsuario = req.body.usuario;
    const mailOtro = req.body.mail;

    // Busco el id del otro usuario a partir del mail
    const otroUsuario = await realizarQuery(`SELECT id_usuario FROM UsuariosW WHERE mail='${mailOtro}'`);
    if(otroUsuario.length === 0){
      return res.send({error: 'No existe un usuario con ese mail'});
    }
    const idOtroUsuario = otroUsuario[0].id_usuario;

    // Creo el chat
    const nuevoChat = await realizarQuery(`INSERT INTO Chats (nombre, descripcion) VALUES ('${req.body.nombre || ''}', '${req.body.descripcion || ''}')`);
    const idChat = nuevoChat.insertId;

    // Vinculo a los dos usuarios con el chat
    await realizarQuery(`INSERT INTO ChatsUsuarios (id_usuario, id_chat) VALUES (${idUsuario}, ${idChat})`);
    await realizarQuery(`INSERT INTO ChatsUsuarios (id_usuario, id_chat) VALUES (${idOtroUsuario}, ${idChat})`);

    res.send({id_chat: idChat});

  } catch (error) {
    res.send(error.message)
  }
});

app.post('/crearChatGrupal', async function(req, res){
  try {
    const idUsuario = req.body.usuario;
    const mails = req.body.mails; // array de mails

    // Creo el chat grupal
    const nuevoChat = await realizarQuery(`INSERT INTO Chats (nombre, descripcion) VALUES ('${req.body.nombre || ''}', '${req.body.descripcion || ''}')`);
    const idChat = nuevoChat.insertId;

    // Agrego al creador
    await realizarQuery(`INSERT INTO ChatsUsuarios (id_usuario, id_chat) VALUES (${idUsuario}, ${idChat})`);

    // Busco y agrego a cada usuario invitado por mail
    for (const mail of mails) {
      const usuario = await realizarQuery(`SELECT id_usuario FROM UsuariosW WHERE mail='${mail}'`);
      if (usuario.length > 0) {
        await realizarQuery(`INSERT INTO ChatsUsuarios (id_usuario, id_chat) VALUES (${usuario[0].id_usuario}, ${idChat})`);
      }
    }

    res.send({id_chat: idChat});

  } catch (error) {
    res.send(error.message)
  }
});

app.get('/historialMensajes', async function(req, res){
  try {
    const mensajes = await realizarQuery(`SELECT Mensajes.id_mensaje, Mensajes.texto, Mensajes.fecha, Mensajes.id_usuario, UsuariosW.nombre FROM Mensajes INNER JOIN UsuariosW ON UsuariosW.id_usuario=Mensajes.id_usuario WHERE Mensajes.id_chat=${req.query.chat} ORDER BY Mensajes.fecha ASC`);
    res.send(mensajes);

  } catch (error) {
    res.send(error.message)
  }
});