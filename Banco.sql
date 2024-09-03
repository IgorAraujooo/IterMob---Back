CREATE DATABASE itermob;

USE itermob;

CREATE TABLE tbl_usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cpf VARCHAR(11) NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    foto_perfil VARCHAR(200)
);

CREATE TABLE tbl_endereco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(10) NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(10),
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_usuario_endereco (
    id_usuario INT,
    id_endereco INT,
    PRIMARY KEY (id_usuario, id_endereco),
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id),
    FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id)
);

CREATE TABLE tbl_cartoes (
    id_cartao INT PRIMARY KEY AUTO_INCREMENT,
    nome_titular VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    tipo_cartao VARCHAR(50),
    data_validade DATE,
    codigo_seguranca VARCHAR(5)
);

CREATE TABLE tbl_fac (
    id_fac INT PRIMARY KEY AUTO_INCREMENT,
    tipo_atendimento VARCHAR(100),
    data DATE NOT NULL,
    hora TIME NOT NULL,
    linha VARCHAR(100),
    sentido VARCHAR(100),
    prefixo VARCHAR(100),
    item VARCHAR(100),
    foto_item VARCHAR(100)
);

INSERT INTO tbl_usuarios (id, cpf, nome_completo, email, telefone, foto_perfil)
VALUES (1, '12345678901', 'João da Silva', 'joao.silva@example.com', '(11) 98765-4321', 'https://example.com/foto_joao.jpg');
