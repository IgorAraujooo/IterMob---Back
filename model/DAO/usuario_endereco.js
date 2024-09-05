const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para listar um usuário e seus endereços
const selectUserAndAddressesByUserId = async function(idUsuario) {
    try {
        let sql = `
            SELECT 
                u.id as user_id, u.nome_completo, u.cpf, u.email, u.telefone, 
                e.id as address_id, e.cep, e.rua, e.numero, e.cidade, e.estado
            FROM tbl_usuarios u
            LEFT JOIN tbl_usuario_endereco ue ON u.id = ue.id_usuario
            LEFT JOIN tbl_endereco e ON ue.id_endereco = e.id
            WHERE u.id = ${idUsuario}
        `;
        let result = await prisma.$queryRawUnsafe(sql);
        return result.length > 0 ? result : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    selectUserAndAddressesByUserId,
};
