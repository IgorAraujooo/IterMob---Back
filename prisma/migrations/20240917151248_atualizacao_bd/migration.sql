-- CreateTable
CREATE TABLE `tbl_endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `cep` VARCHAR(10) NOT NULL,
    `rua` VARCHAR(100) NOT NULL,
    `numero` VARCHAR(10) NULL,
    `cidade` VARCHAR(100) NOT NULL,
    `bairro` VARCHAR(100) NULL,
    `estado` VARCHAR(100) NOT NULL,

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cpf` VARCHAR(11) NOT NULL,
    `nome` VARCHAR(200) NOT NULL,
    `sobrenome` VARCHAR(200) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `telefone` VARCHAR(20) NOT NULL,
    `foto_perfil` VARCHAR(200) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_endereco` ADD CONSTRAINT `tbl_endereco_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuarios`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
