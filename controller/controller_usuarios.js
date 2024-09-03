const message = require('../modulo/config.js');
const usuarioDAO = require('../model/DAO/usuarios.js');

const getListarUsuarios = async function() {
    try {
        let listarUsuarios = await usuarioDAO.selectAllUsers();
        let usuariosJSON = {};

        if (listarUsuarios && listarUsuarios.length > 0) {
            // Itera sobre todos os usuários e busca seus respectivos endereços
            let usuariosComEnderecos = await Promise.all(
                listarUsuarios.map(async (usuario) => {
                    let usuarioEndereco = await usuarioDAO.selectUserWithAddress(usuario.id);

                    // Adiciona as informações do endereço dentro do objeto do usuário
                    return {
                        id: usuario.id,
                        cpf: usuario.cpf,
                        nome_completo: usuario.nome_completo,
                        email: usuario.email,
                        telefone: usuario.telefone,
                        foto_perfil: usuario.foto_perfil,
                        endereco: usuarioEndereco ? {
                            id: usuarioEndereco.id_endereco,  // Ajuste conforme o seu modelo de dados
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
            return usuariosJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};


const getBuscarUsuario = async function(id) {
    try {
        if (id === '' || id === undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let dadosUsuario = await usuarioDAO.selectUserWithAddress(id);
            let usuarioJSON = {};

            if (dadosUsuario) {
                usuarioJSON.usuario = {
                    id: dadosUsuario.id,
                    cpf: dadosUsuario.cpf,
                    nome_completo: dadosUsuario.nome_completo,
                    email: dadosUsuario.email,
                    telefone: dadosUsuario.telefone,
                    foto_perfil: dadosUsuario.foto_perfil,
                    endereco: dadosUsuario ? {
                        id: dadosUsuario.id_endereco,
                        cep: dadosUsuario.cep,
                        rua: dadosUsuario.rua,
                        numero: dadosUsuario.numero,
                        cidade: dadosUsuario.cidade,
                        bairro: dadosUsuario.bairro,
                        estado: dadosUsuario.estado
                    } : null
                };
                usuarioJSON.status_code = 200;
                return usuarioJSON; // 200
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};


const setExcluirUsuario = async function(id) {
    try {
        if (id === '' || id === undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let usuarioExistente = await usuarioDAO.selectByIdUser(id);

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
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};


const setInserirNovoUsuario = async function(dadosUsuario, dadosEndereco, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosUsuario.cpf === '' || dadosUsuario.cpf === undefined || dadosUsuario.cpf.length > 11 ||
                dadosUsuario.nome_completo === '' || dadosUsuario.nome_completo === undefined || dadosUsuario.nome_completo.length > 100 ||
                dadosUsuario.email === '' || dadosUsuario.email === undefined || dadosUsuario.email.length > 100 ||
                dadosUsuario.telefone === '' || dadosUsuario.telefone === undefined || dadosUsuario.telefone.length > 20
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let novoUsuario = await usuarioDAO.insertUser(dadosUsuario);
                if (novoUsuario) {
                    let novoEndereco = await usuarioDAO.insertEndereco(novoUsuario.id, dadosEndereco);  // Supondo que você tenha um método para inserir o endereço
                    let resultadoUsuario = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        usuario: {
                            id: novoUsuario.id,
                            cpf: dadosUsuario.cpf,
                            nome_completo: dadosUsuario.nome_completo,
                            email: dadosUsuario.email,
                            telefone: dadosUsuario.telefone,
                            foto_perfil: dadosUsuario.foto_perfil,
                            endereco: novoEndereco ? {
                                id: novoEndereco.id,
                                cep: novoEndereco.cep,
                                rua: novoEndereco.rua,
                                numero: novoEndereco.numero,
                                cidade: novoEndereco.cidade,
                                bairro: novoEndereco.bairro,
                                estado: novoEndereco.estado
                            } : null
                        }
                    };
                    return resultadoUsuario; // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};


const setAtualizarUsuario = async function(id, novosDadosUsuario, novosDadosEndereco) {
    try {
        if (
            id === '' || id === undefined || isNaN(id) ||
            novosDadosUsuario.cpf === '' || novosDadosUsuario.cpf === undefined || novosDadosUsuario.cpf.length > 11 ||
            novosDadosUsuario.nome_completo === '' || novosDadosUsuario.nome_completo === undefined || novosDadosUsuario.nome_completo.length > 100 ||
            novosDadosUsuario.email === '' || novosDadosUsuario.email === undefined || novosDadosUsuario.email.length > 100 ||
            novosDadosUsuario.telefone === '' || novosDadosUsuario.telefone === undefined || novosDadosUsuario.telefone.length > 20
        ) {
            return message.ERROR_INVALID_INPUT; // 400
        } else {
            let usuarioExistente = await usuarioDAO.selectUserWithAddress(id);

            if (usuarioExistente) {
                let resultadoAtualizacao = await usuarioDAO.updateUser(id, novosDadosUsuario);

                // Se houver dados de endereço, atualize-os
                if (novosDadosEndereco && usuarioExistente.endereco) {
                    await usuarioDAO.updateEndereco(usuarioExistente.endereco.id, novosDadosEndereco);
                }

                if (resultadoAtualizacao) {
                    return {
                        status: message.SUCCESS_UPDATED_ITEM.status,
                        status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                        message: message.SUCCESS_UPDATED_ITEM.message,
                        usuario: {
                            id: id,
                            cpf: novosDadosUsuario.cpf,
                            nome_completo: novosDadosUsuario.nome_completo,
                            email: novosDadosUsuario.email,
                            telefone: novosDadosUsuario.telefone,
                            foto_perfil: novosDadosUsuario.foto_perfil,
                            endereco: novosDadosEndereco ? {
                                id: usuarioExistente.endereco.id,
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
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                }
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};


// Exportando as funções para uso externo
module.exports = {
    getListarUsuarios,
    getBuscarUsuario,
    setExcluirUsuario,
    setInserirNovoUsuario,
    setAtualizarUsuario
};
