/********************************************************
 * Objetivo: Arquivo para realizar o CRUD de usuários
 * Data: 03/09/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const { PrismaClient } = require('@prisma/client');

// Instanciando o objeto prisma com as características do Prisma Client
const prisma = new PrismaClient();

// Função para listar todos os usuários existentes
const selectAllUsers = async function() {
    try {
        // Script SQL para listar todos os registros
        let sql = 'SELECT * FROM tbl_usuarios ORDER BY id DESC';
        
        // Executa o script no banco de dados e recebe o retorno dos dados na variável rsUsuarios
        let rsUsuarios = await prisma.$queryRawUnsafe(sql);

        // Tratamento de erro para retornar dados ou retornar false
        return rsUsuarios.length > 0 ? rsUsuarios : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para listar usuário filtrando pelo ID
const selectByIdUser = async function(id) {
    try {
        // Realiza a busca do usuário pelo ID
        let sql = `SELECT * FROM tbl_usuarios WHERE id = ${id}`;
        
        // Executa o script no banco de dados
        let rsUsuario = await prisma.$queryRawUnsafe(sql);
        return rsUsuario.length > 0 ? rsUsuario[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para inserir um novo usuário
const insertUser = async function(dadosUsuario) {
    try {
        let sql = `
            INSERT INTO tbl_usuarios (cpf, nome_completo, email, telefone, foto_perfil) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, dadosUsuario.cpf, dadosUsuario.nome_completo, dadosUsuario.email, dadosUsuario.telefone, dadosUsuario.foto_perfil);

        // Validação para verificar se o insert funcionou no banco de dados
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para atualizar um usuário pelo ID
const updateUser = async function(id, novosDadosUsuario) {
    try {
        let sql = `
            UPDATE tbl_usuarios
            SET cpf = ?, nome_completo = ?, email = ?, telefone = ?, foto_perfil = ?
            WHERE id = ?
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, novosDadosUsuario.cpf, novosDadosUsuario.nome_completo, novosDadosUsuario.email, novosDadosUsuario.telefone, novosDadosUsuario.foto_perfil, id);

        // Retorna verdadeiro se a atualização foi bem-sucedida
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para deletar um usuário pelo ID
const deleteUser = async function(id) {
    try {
        // Realiza a exclusão do usuário pelo ID
        let sql = `DELETE FROM tbl_usuarios WHERE id = ${id}`;
        
        // Executa o script no banco de dados
        let result = await prisma.$queryRawUnsafe(sql);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Exportando as funções para uso externo
module.exports = {
    selectAllUsers,
    selectByIdUser,
    insertUser,
    updateUser,
    deleteUser
};
