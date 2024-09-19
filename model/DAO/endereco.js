const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const selectAllEnderecos = async function() {
    try {
        let sql = 'SELECT * FROM tbl_endereco ORDER BY id DESC';
        let rsEnderecos = await prisma.$queryRawUnsafe(sql);
        return rsEnderecos.length > 0 ? rsEnderecos : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const selectByIdEndereco = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_endereco WHERE id = ${id}`;
        let rsEndereco = await prisma.$queryRawUnsafe(sql);
        return rsEndereco.length > 0 ? rsEndereco[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const insertEndereco = async function(dadosEndereco, id_usuario) {
    try {

        let sql = `
            INSERT INTO tbl_endereco ( id_usuario, cep, rua, numero, cidade, bairro, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        let result = await prisma.$executeRawUnsafe(sql, id_usuario, dadosEndereco.cep, dadosEndereco.rua, dadosEndereco.numero, dadosEndereco.cidade, dadosEndereco.bairro, dadosEndereco.estado);
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};


const updateEndereco = async function(id, novosDadosEndereco) {
    try {
        let sql = `
            UPDATE tbl_endereco
            SET cep = ?, rua = ?, numero = ?, cidade = ?, bairro = ?, estado = ?
            WHERE id = ?
        `;
        let result = await prisma.$executeRawUnsafe(sql, novosDadosEndereco.cep, novosDadosEndereco.rua, novosDadosEndereco.numero, novosDadosEndereco.cidade, novosDadosEndereco.bairro, novosDadosEndereco.estado, id);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const deleteEndereco = async function(id) {
    try {
        let sql = `DELETE FROM tbl_endereco WHERE id = ${id}`;
        let result = await prisma.$executeRawUnsafe(sql);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    selectAllEnderecos,
    selectByIdEndereco,
    insertEndereco,
    updateEndereco,
    deleteEndereco
};