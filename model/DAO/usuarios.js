const { PrismaClient } = require('@prisma/client');

// Instanciando o objeto prisma com as características do Prisma Client
const prisma = new PrismaClient();

// Função para listar todos os usuários existentes, incluindo seus endereços
const selectAllUsers = async function() {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome_completo, u.email, u.telefone, u.foto_perfil,
                e.id AS id_endereco, e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios AS u
            LEFT JOIN tbl_usuario_endereco AS ue ON u.id = ue.id_usuario
            LEFT JOIN tbl_endereco AS e ON ue.id_endereco = e.id
            ORDER BY u.id DESC
        `;
        
        let rsUsuarios = await prisma.$queryRawUnsafe(sql);
        return rsUsuarios.length > 0 ? rsUsuarios : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para listar usuário específico pelo ID, incluindo seus endereços
const selectUserWithAddress = async function(id) {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome_completo, u.email, u.telefone, u.foto_perfil,
                e.id AS id_endereco, e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios AS u
            LEFT JOIN tbl_usuario_endereco AS ue ON u.id = ue.id_usuario
            LEFT JOIN tbl_endereco AS e ON ue.id_endereco = e.id
            WHERE u.id = ${id}
        `;
        let rsUsuarioEndereco = await prisma.$queryRawUnsafe(sql);
        return rsUsuarioEndereco.length > 0 ? rsUsuarioEndereco[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para inserir um novo usuário, podendo também inserir um endereço associado
const insertUser = async function(dadosUsuario, dadosEndereco) {
    try {
        let sqlUsuario = `
            INSERT INTO tbl_usuarios (cpf, nome_completo, email, telefone, foto_perfil) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // Insere o usuário
        let resultUsuario = await prisma.$executeRawUnsafe(sqlUsuario, dadosUsuario.cpf, dadosUsuario.nome_completo, dadosUsuario.email, dadosUsuario.telefone, dadosUsuario.foto_perfil);

        // Se o usuário foi inserido com sucesso, pegamos o ID e associamos o endereço
        if (resultUsuario) {
            let idUsuario = await prisma.$queryRawUnsafe('SELECT LAST_INSERT_ID() AS id');
            
            if (dadosEndereco) {
                let sqlEndereco = `
                    INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, dadosEndereco.cep, dadosEndereco.rua, dadosEndereco.numero, dadosEndereco.cidade, dadosEndereco.bairro, dadosEndereco.estado);
                
                if (resultEndereco) {
                    let idEndereco = await prisma.$queryRawUnsafe('SELECT LAST_INSERT_ID() AS id');
                    let sqlAssoc = `
                        INSERT INTO tbl_usuario_endereco (id_usuario, id_endereco) 
                        VALUES (?, ?)
                    `;
                    await prisma.$executeRawUnsafe(sqlAssoc, idUsuario[0].id, idEndereco[0].id);
                }
            }

            return idUsuario[0];
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para atualizar um usuário pelo ID, incluindo seus endereços
const updateUser = async function(id, novosDadosUsuario, novosDadosEndereco) {
    try {
        let sqlUsuario = `
            UPDATE tbl_usuarios
            SET cpf = ?, nome_completo = ?, email = ?, telefone = ?, foto_perfil = ?
            WHERE id = ?
        `;

        let resultUsuario = await prisma.$executeRawUnsafe(sqlUsuario, novosDadosUsuario.cpf, novosDadosUsuario.nome_completo, novosDadosUsuario.email, novosDadosUsuario.telefone, novosDadosUsuario.foto_perfil, id);

        // Se o usuário foi atualizado, atualizamos também o endereço, se fornecido
        if (resultUsuario && novosDadosEndereco) {
            let sqlEndereco = `
                UPDATE tbl_endereco
                SET cep = ?, rua = ?, numero = ?, cidade = ?, bairro = ?, estado = ?
                WHERE id = (SELECT id_endereco FROM tbl_usuario_endereco WHERE id_usuario = ?)
            `;
            let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, novosDadosEndereco.cep, novosDadosEndereco.rua, novosDadosEndereco.numero, novosDadosEndereco.cidade, novosDadosEndereco.bairro, novosDadosEndereco.estado, id);

            return resultEndereco ? true : false;
        }
        return resultUsuario ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para deletar um usuário e seu endereço associado
const deleteUser = async function(id) {
    try {
        // Deleta o endereço associado primeiro
        let sqlEndereco = `
            DELETE e FROM tbl_endereco AS e
            JOIN tbl_usuario_endereco AS ue ON e.id = ue.id_endereco
            WHERE ue.id_usuario = ?
        `;
        let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, id);

        // Depois de deletar o endereço, deletamos o usuário
        let sqlUsuario = `DELETE FROM tbl_usuarios WHERE id = ${id}`;
        let resultUsuario = await prisma.$executeRawUnsafe(sqlUsuario);

        return resultUsuario ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Exportando as funções para uso externo
module.exports = {
    selectAllUsers,
    selectUserWithAddress,
    insertUser,
    updateUser,
    deleteUser
};
