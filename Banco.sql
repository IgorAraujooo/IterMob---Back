CREATE DATABASE itermob;

USE itermob;

CREATE TABLE tbl_usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cpf VARCHAR(11) NOT NULL,
    nome VARCHAR(200) NOT NULL,
    sobrenome VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    foto_perfil VARCHAR(200)
);

CREATE TABLE tbl_endereco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    cep VARCHAR(10) NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(10),
    cidade VARCHAR(100) NOT NULL,
    bairro VARCHAR(100),
    estado VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id) ON DELETE CASCADE
);


INSERT INTO tbl_usuarios (cpf, nome, sobrenome, email, telefone, foto_perfil)
VALUES ('12345678901', 'João', 'Silva','joao.silva@example.com', '(11) 98765-4321', 'https://example.com/foto_joao.jpg');

INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado, id_usuario)
VALUES ('12345-678', 'Rua Exemplo', '123', 'Cidade Exemplo', 'Bairro Exemplo', 'Estado Exemplo', 1);

