/********************************************************
 * Objetivo: Arquivo para realizar o CRUD de usuários
 * Data: 03/09/2024
 * Autor: Igor Araujo
 * Versão: 2.0
 ********************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const selectAllUsersWithAddress = async function() {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome, u.sobrenome, u.telefone, u.email, u.foto_perfil,
                e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios u
            LEFT JOIN tbl_usuario_endereco ue ON u.id = ue.id_usuario
            LEFT JOIN tbl_endereco e ON ue.id_endereco = e.id
        `;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
};


const selectUserWithAddress = async function(id) {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome, u.sobrenome, u.telefone, u.email, u.foto_perfil,
                e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios u
            LEFT JOIN tbl_usuario_endereco ue ON u.id = ue.id_usuario
            LEFT JOIN tbl_endereco e ON ue.id_endereco = e.id
            WHERE u.id = ${id}
        `;
        let result = await prisma.$queryRawUnsafe(sql);
        return result.length > 0 ? result[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const selectByIdUser = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_usuarios WHERE id = ${id}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result.length > 0 ? result[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const insertUser = async function(dadosUsuario) {
    try {
        let sql = `
            INSERT INTO tbl_usuarios (cpf, nome, sobrenome, telefone, email, senha, foto_perfil)
            VALUES ('${dadosUsuario.cpf}', '${dadosUsuario.nome}', '${dadosUsuario.sobrenome}', '${dadosUsuario.telefone}', '${dadosUsuario.email}', '${dadosUsuario.senha}', '${dadosUsuario.foto_perfil}')
        `;
        let result = await prisma.$executeRawUnsafe(sql);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const updateUser = async function(id, novosDadosUsuario) {
    try {
        let sql = `
            UPDATE tbl_usuarios
            SET cpf = '${novosDadosUsuario.cpf}', nome = '${novosDadosUsuario.nome}', sobrenome = '${novosDadosUsuario.sobrenome}', telefone = '${novosDadosUsuario.telefone}', email = '${novosDadosUsuario.email}', senha = '${novosDadosUsuario.senha}', foto_perfil = '${novosDadosUsuario.foto_perfil}'
            WHERE id = ${id}
        `;
        let result = await prisma.$executeRawUnsafe(sql);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const deleteUser = async function(id) {
    try {
        let sql = `DELETE FROM tbl_usuarios WHERE id = ${id}`;
        let result = await prisma.$executeRawUnsafe(sql);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    selectAllUsersWithAddress,
    selectUserWithAddress,
    selectByIdUser,
    insertUser,
    updateUser,
    deleteUser
};