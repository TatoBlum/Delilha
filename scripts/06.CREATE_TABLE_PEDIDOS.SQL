CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    estadoId INT NOT NULL DEFAULT '1',
    formaDePagoId INT NOT NULL,
    usuarioId INT NOT NULL,
    fechaDeCreacion TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',
	fechaDeModificacion TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_usuarioId FOREIGN KEY (usuarioId)
    REFERENCES usuarios (id),
    CONSTRAINT FK_estadoPedido FOREIGN KEY (estadoId)
    REFERENCES estados (id),
    CONSTRAINT FK_formaDePago FOREIGN KEY (formaDePagoId)
    REFERENCES formasDePago (id)
);

