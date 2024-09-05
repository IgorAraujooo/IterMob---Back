const message = require('../modulo/config.js');
const usuarioEnderecoDAO = require('../model/DAO/usuario_endereco.js');

// Função para listar um usuário e seus endereços
const getListarUsuarioEEnderecos = async function(idUsuario) {
    try {
        if (idUsuario === '' || idUsuario === undefined || isNaN(idUsuario)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let usuarioComEnderecos = await usuarioEnderecoDAO.selectUserAndAddressesByUserId(idUsuario);
            let usuarioJSON = {};

            if (usuarioComEnderecos) {
                // Assumindo que o primeiro resultado contém os dados do usuário
                let usuarioData = usuarioComEnderecos[0];
                usuarioJSON.usuario = {
                    id: usuarioData.user_id,
                    nome_completo: usuarioData.nome_completo,
                    cpf: usuarioData.cpf,
                    email: usuarioData.email,
                    telefone: usuarioData.telefone,
                    enderecos: usuarioComEnderecos.map(endereco => ({
                        id: endereco.address_id,
                        cep: endereco.cep,
                        rua: endereco.rua,
                        numero: endereco.numero,
                        cidade: endereco.cidade,
                        estado: endereco.estado
                    }))
                };
                usuarioJSON.status_code = 200;
                return usuarioJSON;
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

module.exports = {
    getListarUsuarioEEnderecos,
    setInserirUsuarioEndereco,
    setExcluirUsuarioEndereco
};
