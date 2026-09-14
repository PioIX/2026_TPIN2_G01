create table if not exists UsuariosW (
id_usuario int auto_increment unique NOT null,
nombre varchar(255),
mail varchar(255),
contraseña varchar(255),
foto varchar(255),
primary key (id_usuario)
);

create table if not exists Chats(
id_chat int auto_increment unique not null,
nombre varchar(255),
descripcion varchar(255),
primary key(id_chat)
);

create table if not exists Mensajes(
id_mensaje int auto_increment unique not null,
texto varchar(255),
fecha date,
id_usuario int,
id_chat int,
foreign key (id_usuario) references UsuariosW(id_usuario),
foreign key (id_chat) references Chats(id_chat)
);

create table if not exists ChatsUsuarios(
id_usuario int,
id_chat int,
foreign key (id_usuario) references UsuariosW(id_usuario),
foreign key (id_chat) references Chats(id_chat)
);

insert into UsuariosW (nombre,mail,contraseña,foto) values("guille","gborda@gmail.com","agus08",""),
("admin","admin@gmail.com","admin","");

