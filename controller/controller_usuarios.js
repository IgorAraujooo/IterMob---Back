const message = require('../modulo/config.js');
const usuarioDAO = require('../model/DAO/usuarios.js');

const getListarUsuarios = async function() {
    try {
        let listarUsuarios = await usuarioDAO.selectAllUsers();
        let usuariosJSON = {};

        if (listarUsuarios && listarUsuarios.length > 0) {
            // Agrupa os usuários e seus endereços
            let usuariosComEnderecos = await Promise.all(
                listarUsuarios.map(async(usuario) => {
                    let usuarioEndereco = await usuarioDAO.selectByIdUser(usuario.id);

                    return {
                        id: usuario.id,
                        cpf: usuario.cpf,
                        nome: usuario.nome,
                        sobrenome: usuario.sobrenome,
                        email: usuario.email,
                        telefone: usuario.telefone,
                        foto_perfil: usuario.foto_perfil,
                        endereco: usuarioEndereco && usuarioEndereco.id_endereco ? {
                            id: usuarioEndereco.id_endereco,
                            cep: usuarioEndereco.cep,
                            rua: usuarioEndereco.rua,
                            numero: usuarioEndereco.numero,
                            cidade: usuarioEndereco.cidade,
                            bairro: usuarioEndereco.bairro,
                            estado: usuarioEndereco.estado
                        } : null
                    };
                })
            );

            usuariosJSON.usuarios = usuariosComEnderecos;
            usuariosJSON.status_code = 200;
            return usuariosJSON; // 200 OK
        } else {
            return message.ERROR_NOT_FOUND; // 404 Not Found
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500 Internal Server Error
    }
};

const getBuscarUsuario = async function(id) {
    try {
        if (!id || isNaN(id)) {
            return message.ERROR_INVALID_ID; // 400 Bad Request
        }

        let dadosUsuario = await usuarioDAO.selectByIdUser(id);

        if (dadosUsuario) {
            let usuarioJSON = {
                usuario: {
                    id: dadosUsuario.id,
                    cpf: dadosUsuario.cpf,
                    nome: dadosUsuario.nome,
                    sobrenome: dadosUsuario.sobrenome,
                    email: dadosUsuario.email,
                    telefone: dadosUsuario.telefone,
                    foto_perfil: dadosUsuario.foto_perfil,
                    endereco: dadosUsuario.id_endereco ? {
                        id: dadosUsuario.id_endereco,
                        cep: dadosUsuario.cep,
                        rua: dadosUsuario.rua,
                        numero: dadosUsuario.numero,
                        cidade: dadosUsuario.cidade,
                        bairro: dadosUsuario.bairro,
                        estado: dadosUsuario.estado
                    } : null
                },
                status_code: 200
            };
            return usuarioJSON; // 200 OK
        } else {
            return message.ERROR_NOT_FOUND; // 404 Not Found
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500 Internal Server Error
    }
};


const setExcluirUsuario = async function(id) {
    try {
        if (!id || isNaN(id)) {
            return message.ERROR_INVALID_ID; // 400
        }

        let usuarioExistente = await usuarioDAO.selectUserWithAddress(id);

        if (usuarioExistente) {
            let resultadoExclusao = await usuarioDAO.deleteUser(id);

            if (resultadoExclusao) {
                return message.SUCCESS_DELETED_ITEM; // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB; // 500
            }
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

const setInserirNovoUsuario = async function(dadosUsuario, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE; // 415
        }

        if (!dadosUsuario.cpf || dadosUsuario.cpf.length > 11 ||
            !dadosUsuario.nome || dadosUsuario.nome.length > 200 ||
            !dadosUsuario.sobrenome || dadosUsuario.sobrenome.length > 200 ||
            !dadosUsuario.email || dadosUsuario.email.length > 100 ||
            !dadosUsuario.telefone || dadosUsuario.telefone.length > 20
        ) {
            return message.ERROR_REQUIRED_FIELDS; // 400
        }

        let novoUsuario = await usuarioDAO.insertUser(dadosUsuario, dadosUsuario.endereco);
        if (novoUsuario) {
            let usuarioComEndereco = await usuarioDAO.selectByIdUser(novoUsuario.id);

            let resultadoUsuario = {
                status: message.SUCCESS_CREATED_ITEM.status,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,

                usuario: usuarioComEndereco

                usuario: {
                    id: novoUsuario.id,
                    cpf: dadosUsuario.cpf,
                    nome: dadosUsuario.nome,
                    sobrenome: dadosUsuario.sobrenome,
                    email: dadosUsuario.email,
                    telefone: dadosUsuario.telefone,
                    foto_perfil: dadosUsuario.foto_perfil,
                    endereco: dadosEndereco ? {
                        id: novoUsuario.id_endereco,
                        cep: dadosEndereco.cep,
                        rua: dadosEndereco.rua,
                        numero: dadosEndereco.numero,
                        cidade: dadosEndereco.cidade,
                        bairro: dadosEndereco.bairro,
                        estado: dadosEndereco.estado
                    } : null
                }

            };
            return resultadoUsuario; // 201
        } else {
            return message.ERROR_INTERNAL_SERVER_DB; // 500
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};



const setAtualizarUsuario = async function(id, novosDadosUsuario, novosDadosEndereco) {
    try {
        if (!id || isNaN(id) ||
            !novosDadosUsuario.cpf || novosDadosUsuario.cpf.length > 11 ||
            !novosDadosUsuario.nome || novosDadosUsuario.nome.length > 200 ||
            !novosDadosUsuario.sobrenome || novosDadosUsuario.sobrenome.length > 200 ||
            !novosDadosUsuario.email || novosDadosUsuario.email.length > 100 ||
            !novosDadosUsuario.telefone || novosDadosUsuario.telefone.length > 20
        ) {
            return message.ERROR_INVALID_INPUT; // 400 Bad Request
        }

        let usuarioExistente = await usuarioDAO.selectByIdUser(id);

        if (usuarioExistente) {
            // Atualiza o usuário
            let resultadoAtualizacao = await usuarioDAO.updateUser(id, novosDadosUsuario);


            if (novosDadosEndereco) {
                if (usuarioExistente.endereco) {
                    await usuarioDAO.updateEndereco(usuarioExistente.endereco.id, novosDadosEndereco);
                } else {
                    // Se o usuário não tiver um endereço, você pode optar por criar um novo
                    await usuarioDAO.insertUser(id, novosDadosEndereco);

                }
            }

            if (resultadoAtualizacao) {
                // Obtém o usuário atualizado com o endereço
                let usuarioAtualizado = await usuarioDAO.selectByIdUser(id);

                return {
                    status: message.SUCCESS_UPDATED_ITEM.status,
                    status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                    message: message.SUCCESS_UPDATED_ITEM.message,
                    usuario: {

                        id: id,
                        cpf: novosDadosUsuario.cpf,
                        nome: novosDadosUsuario.nome,
                        sobrenome: novosDadosUsuario.sobrenome,
                        email: novosDadosUsuario.email,
                        telefone: novosDadosUsuario.telefone,
                        foto_perfil: novosDadosUsuario.foto_perfil,
                        endereco: novosDadosEndereco ? {
                            id: usuarioExistente.endereco ? usuarioExistente.endereco.id : undefined,
                            cep: novosDadosEndereco.cep,
                            rua: novosDadosEndereco.rua,
                            numero: novosDadosEndereco.numero,
                            cidade: novosDadosEndereco.cidade,
                            bairro: novosDadosEndereco.bairro,
                            estado: novosDadosEndereco.estado
                        } : usuarioExistente.endereco

                    }
                };
            } else {
                return message.ERROR_INTERNAL_SERVER_DB; // 500 Internal Server Error
            }
        } else {
            return message.ERROR_NOT_FOUND; // 404 Not Found
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500 Internal Server Error
    }
};

module.exports = {
    getListarUsuarios,
    getBuscarUsuario,
    setInserirNovoUsuario,

    setAtualizarUsuario,
    setExcluirUsuario
};

