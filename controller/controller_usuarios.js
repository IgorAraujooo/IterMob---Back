/********************************************************
 * Objetivo: Controlador para realizar o CRUD de usuários
 * Data: 03/09/2024
 * Autor: Igor Araujo
 * Versão: 2.0
 ********************************************************/

const message = require('../modulo/config.js');
const usuarioDAO = require('../model/DAO/usuarios.js');


const getListarUsuarios = async function() {
    try {
        let listarUsuarios = await usuarioDAO.selectAllUsersWithAddress();
        let usuariosJSON = { usuarios: [] };

        if (listarUsuarios && listarUsuarios.length > 0) {
            listarUsuarios.forEach(usuario => {
                let usuarioJSON = {
                    id: usuario.id,
                    cpf: usuario.cpf,
                    nome: usuario.nome,
                    sobrenome: usuario.sobrenome,
                    telefone: usuario.telefone,
                    email: usuario.email,
                    foto_perfil: usuario.foto_perfil,
                    endereco: {
                        cep: usuario.cep,
                        rua: usuario.rua,
                        numero: usuario.numero,
                        cidade: usuario.cidade,
                        bairro: usuario.bairro,
                        estado: usuario.estado
                    }
                };
                usuariosJSON.usuarios.push(usuarioJSON);
            });
            usuariosJSON.quantidade = usuariosJSON.usuarios.length;
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
            let dadosUsuarioEndereco = await usuarioDAO.selectUserWithAddress(id);

            if (dadosUsuarioEndereco) {
                let usuarioJSON = {
                    id: dadosUsuarioEndereco.id,
                    cpf: dadosUsuarioEndereco.cpf,
                    nome: dadosUsuarioEndereco.nome,
                    sobrenome: dadosUsuarioEndereco.sobrenome,
                    telefone: dadosUsuarioEndereco.telefone,
                    email: dadosUsuarioEndereco.email,
                    foto_perfil: dadosUsuarioEndereco.foto_perfil,
                    endereco: {
                        cep: dadosUsuarioEndereco.cep,
                        rua: dadosUsuarioEndereco.rua,
                        numero: dadosUsuarioEndereco.numero,
                        cidade: dadosUsuarioEndereco.cidade,
                        bairro: dadosUsuarioEndereco.bairro,
                        estado: dadosUsuarioEndereco.estado
                    },
                    status_code: 200
                };
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


const setInserirNovoUsuario = async function(dadosUsuario, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosUsuario.cpf === '' || dadosUsuario.cpf === undefined || dadosUsuario.cpf.length > 11 ||
                dadosUsuario.nome === '' || dadosUsuario.nome === undefined || dadosUsuario.nome.length > 100 ||
                dadosUsuario.sobrenome === '' || dadosUsuario.sobrenome === undefined || dadosUsuario.sobrenome.length > 100 ||
                dadosUsuario.email === '' || dadosUsuario.email === undefined || dadosUsuario.email.length > 100 ||
                dadosUsuario.senha === '' || dadosUsuario.senha === undefined || dadosUsuario.senha.length > 100
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let novoUsuario = await usuarioDAO.insertUser(dadosUsuario);
                if (novoUsuario) {
                    let resultadoUsuario = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        usuario: dadosUsuario
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


const setAtualizarUsuario = async function(id, novosDadosUsuario) {
    try {
        if (
            id === '' || id === undefined || isNaN(id) ||
            novosDadosUsuario.cpf === '' || novosDadosUsuario.cpf === undefined || novosDadosUsuario.cpf.length > 11 ||
            novosDadosUsuario.nome === '' || novosDadosUsuario.nome === undefined || novosDadosUsuario.nome.length > 100 ||
            novosDadosUsuario.sobrenome === '' || novosDadosUsuario.sobrenome === undefined || novosDadosUsuario.sobrenome.length > 100 ||
            novosDadosUsuario.email === '' || novosDadosUsuario.email === undefined || novosDadosUsuario.email.length > 100 ||
            novosDadosUsuario.senha === '' || novosDadosUsuario.senha === undefined || novosDadosUsuario.senha.length > 100
        ) {
            return message.ERROR_INVALID_INPUT; // 400
        } else {
            let usuarioExistente = await usuarioDAO.selectByIdUser(id);

            if (usuarioExistente) {
                let resultadoAtualizacao = await usuarioDAO.updateUser(id, novosDadosUsuario);

                if (resultadoAtualizacao) {
                    return message.SUCCESS_UPDATED_ITEM; // 200
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

module.exports = {
    getListarUsuarios,
    getBuscarUsuario, 
    setInserirNovoUsuario,
    setAtualizarUsuario,
    setExcluirUsuario
};
