const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para selecionar todos os usuários com seus endereços
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

// Função para selecionar um usuário pelo ID
const selectByIdUser = async function(id) {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome, u.sobrenome, u.email, u.telefone, u.foto_perfil,
                e.id AS id_endereco, e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios AS u
            LEFT JOIN tbl_endereco AS e ON u.id = e.id_usuario
            WHERE u.id = ${id}
        `;
        let rsUsuario = await prisma.$queryRawUnsafe(sql);
        return rsUsuario.length > 0 ? rsUsuario[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para inserir um novo usuário e seu endereço
const insertUser = async function(dadosUsuario, dadosEndereco) {

    console.log("cheguei no dao", dadosUsuario)
    try {
        // let sqlUsuario = `
        //     INSERT INTO tbl_usuarios (cpf, nome, sobrenome, email, telefone, foto_perfil) 
        //     VALUES (?, ?, ?, ?, ?, ?)
        // `;

        // console.log("esse é o sql: ", sqlUsuario)

        let resultUsuario = await prisma.$queryRaw`INSERT INTO tbl_usuarios (cpf, nome, sobrenome, email, telefone, foto_perfil) VALUES (${dadosUsuario.cpf}, ${dadosUsuario.nome}, ${dadosUsuario.sobrenome}, ${dadosUsuario.email}, ${dadosUsuario.telefone}, ${dadosUsuario.foto_perfil});`;

        let idUsuario = resultUsuario[0].id

        console.log(idUsuario,"o resultado foi esse: ", resultUsuario)

        if (resultUsuario) {

            if (dadosEndereco) {
                let sqlEndereco = `
                    INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado, id_usuario) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, dadosEndereco.cep, dadosEndereco.rua, dadosEndereco.numero, dadosEndereco.cidade, dadosEndereco.bairro, dadosEndereco.estado, idUsuario[0].id);

                return resultEndereco ? { id: idUsuario[0].id } : false;
            }

            return { id: idUsuario[0].id };
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para atualizar os dados do usuário
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

// Função para atualizar o endereço
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

// Função para inserir um novo endereço para um usuário existente
const insertUserAddress = async function(idUsuario, dadosEndereco) {
    try {
        let sqlEndereco = `
            INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado, id_usuario) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, dadosEndereco.cep, dadosEndereco.rua, dadosEndereco.numero, dadosEndereco.cidade, dadosEndereco.bairro, dadosEndereco.estado, idUsuario);

        return resultEndereco ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para excluir um usuário e seus endereços
const deleteUser = async function(id) {
    try {
        let sqlEndereco = `
            DELETE FROM tbl_endereco
            WHERE id_usuario = ?
        `;
        await prisma.$executeRawUnsafe(sqlEndereco, id);

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
    selectByIdUser,
    insertUser,
    updateUser,
    updateEndereco,
    insertUserAddress,
    deleteUser
};