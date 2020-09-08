CREATE table usuarios(
	id int PRIMARY KEY AUTO_INCREMENT,
	nombre varchar(150) not null ,
	apellido varchar(150) not null,
	email varchar(150) not null,
	telefono int not null,
	direccion varchar(150) not null,
	password varchar(150) not null,
	permisosId INT not null DEFAULT '1', 
	fechaDeCreacion TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',
	fechaDeModificacion TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT FK_permisosId FOREIGN KEY (permisosId)
    REFERENCES permisos(id)
);


