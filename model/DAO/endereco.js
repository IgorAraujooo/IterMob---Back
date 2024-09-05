/********************************************************
 * Objetivo: Arquivo para realizar o CRUD de endereços
 * Data: 03/09/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const { PrismaClient } = require('@prisma/client');

// Instanciando o objeto prisma com as características do Prisma Client
const prisma = new PrismaClient();

// Função para listar todos os endereços existentes
const selectAllEnderecos = async function() {
    try {
        // Script SQL para listar todos os registros
        let sql = 'SELECT * FROM tbl_endereco ORDER BY id DESC';

        // Executa o script no banco de dados e recebe o retorno dos dados na variável rsEnderecos
        let rsEnderecos = await prisma.$queryRawUnsafe(sql);

        // Tratamento de erro para retornar dados ou retornar false
        return rsEnderecos.length > 0 ? rsEnderecos : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para listar um endereço filtrando pelo ID
const selectByIdEndereco = async function(id) {
    try {
        // Realiza a busca do endereço pelo ID
        let sql = `SELECT * FROM tbl_endereco WHERE id = ${id}`;

        // Executa o script no banco de dados
        let rsEndereco = await prisma.$queryRawUnsafe(sql);
        return rsEndereco.length > 0 ? rsEndereco[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para inserir um novo endereço
const insertEndereco = async function(dadosEndereco) {
    try {
        let sql = `
            INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, dadosEndereco.cep, dadosEndereco.rua, dadosEndereco.numero, dadosEndereco.cidade, dadosEndereco.bairro, dadosEndereco.estado);

        // Validação para verificar se o insert funcionou no banco de dados
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para atualizar um endereço pelo ID
const updateEndereco = async function(id, novosDadosEndereco) {
    try {
        let sql = `
            UPDATE tbl_endereco
            SET cep = ?, rua = ?, numero = ?, cidade = ?, bairro = ?, estado = ?
            WHERE id = ?
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, novosDadosEndereco.cep, novosDadosEndereco.rua, novosDadosEndereco.numero, novosDadosEndereco.cidade, novosDadosEndereco.bairro, novosDadosEndereco.estado, id);

        // Retorna verdadeiro se a atualização foi bem-sucedida
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para deletar um endereço pelo ID
const deleteEndereco = async function(id) {
    try {
        // Realiza a exclusão do endereço pelo ID
        let sql = `DELETE FROM tbl_endereco WHERE id = ${id}`;

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
    selectAllEnderecos,
    selectByIdEndereco,
    insertEndereco,
    updateEndereco,
    deleteEndereco
};
