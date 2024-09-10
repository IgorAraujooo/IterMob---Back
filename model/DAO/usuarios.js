const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const selectAllUsers = async function() {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome, u.sobrenome, u.email, u.telefone, u.foto_perfil,
                e.id AS id_endereco, e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios AS u
            LEFT JOIN tbl_endereco AS e ON u.id = e.id_usuario
            ORDER BY u.id DESC
        `;
        
        let rsUsuarios = await prisma.$queryRawUnsafe(sql);
        return rsUsuarios.length > 0 ? rsUsuarios : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const selectUserWithAddress = async function(id) {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome, u.sobrenome, u.email, u.telefone, u.foto_perfil,
                e.id AS id_endereco, e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios AS u
            LEFT JOIN tbl_endereco AS e ON u.id = e.id_usuario
            WHERE u.id = ${id}
        `;
        let rsUsuarioEndereco = await prisma.$queryRawUnsafe(sql);
        return rsUsuarioEndereco.length > 0 ? rsUsuarioEndereco[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const insertUser = async function(dadosUsuario, dadosEndereco) {
    try {
        let sqlUsuario = `
            INSERT INTO tbl_usuarios (cpf, nome, sobrenome, email, telefone, foto_perfil) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        let resultUsuario = await prisma.$executeRawUnsafe(sqlUsuario, dadosUsuario.cpf, dadosUsuario.nome, dadosUsuario.sobrenome, dadosUsuario.email, dadosUsuario.telefone, dadosUsuario.foto_perfil);

        if (resultUsuario) {
            let idUsuario = await prisma.$queryRawUnsafe('SELECT LAST_INSERT_ID() AS id');
            
            if (dadosEndereco) {
                let sqlEndereco = `
                    INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado, id_usuario) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, dadosEndereco.cep, dadosEndereco.rua, dadosEndereco.numero, dadosEndereco.cidade, dadosEndereco.bairro, dadosEndereco.estado, idUsuario[0].id);
                
                return resultEndereco ? {
                    id: idUsuario[0].id,
                    cep: dadosEndereco.cep,
                    rua: dadosEndereco.rua,
                    numero: dadosEndereco.numero,
                    cidade: dadosEndereco.cidade,
                    bairro: dadosEndereco.bairro,
                    estado: dadosEndereco.estado
                } : false;
            }

            return {
                id: idUsuario[0].id
            };
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateUser = async function(id, novosDadosUsuario) {
    try {
        let sqlUsuario = `
            UPDATE tbl_usuarios
            SET cpf = ?, nome = ?, sobrenome = ?, email = ?, telefone = ?, foto_perfil = ?
            WHERE id = ?
        `;

        let resultUsuario = await prisma.$executeRawUnsafe(sqlUsuario, novosDadosUsuario.cpf, novosDadosUsuario.nome, novosDadosUsuario.sobrenome, novosDadosUsuario.email, novosDadosUsuario.telefone, novosDadosUsuario.foto_perfil, id);

        return resultUsuario ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateEndereco = async function(idEndereco, novosDadosEndereco) {
    try {
        let sqlEndereco = `
            UPDATE tbl_endereco
            SET cep = ?, rua = ?, numero = ?, cidade = ?, bairro = ?, estado = ?
            WHERE id = ?
        `;
        let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, novosDadosEndereco.cep, novosDadosEndereco.rua, novosDadosEndereco.numero, novosDadosEndereco.cidade, novosDadosEndereco.bairro, novosDadosEndereco.estado, idEndereco);

        return resultEndereco ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const deleteUser = async function(id) {
    try {
        let sqlEndereco = `
            DELETE FROM tbl_endereco
            WHERE id_usuario = ?
        `;
        let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, id);

        let sqlUsuario = `DELETE FROM tbl_usuarios WHERE id = ${id}`;
        let resultUsuario = await prisma.$executeRawUnsafe(sqlUsuario);

        return resultUsuario ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    selectAllUsers,
    selectUserWithAddress,
    insertUser,
    updateUser,
    updateEndereco,
    deleteUser
};
