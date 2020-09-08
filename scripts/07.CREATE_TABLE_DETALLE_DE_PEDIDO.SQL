CREATE TABLE detalleDePedido (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    pedidoId INT NOT NULL,
    productoId INT NOT NULL,
    fechaDePedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_pedidoId FOREIGN KEY (pedidoId)
    REFERENCES pedidos (id),
    CONSTRAINT FK_productoId FOREIGN KEY (productoId)
    REFERENCES productos (id)
);
