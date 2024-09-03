/********************************************************
 * Objetivo: Controlador para realizar o CRUD de usuários
 * Data: 03/09/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const message = require('../modulo/config.js');
const usuarioDAO = require('../model/DAO/usuarios.js');

// Função para listar todos os usuários
const getListarUsuarios = async function() {
    try {
        let listarUsuarios = await usuarioDAO.selectAllUsers();
        let usuariosJSON = {};

        if (listarUsuarios && listarUsuarios.length > 0) {
            usuariosJSON.usuarios = listarUsuarios;
            usuariosJSON.quantidade = listarUsuarios.length;
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

// Função para buscar um usuário pelo id
const getBuscarUsuario = async function(id) {
    try {
        if (id === '' || id === undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let dadosUsuario = await usuarioDAO.selectByIdUser(id);
            let usuarioJSON = {};

            if (dadosUsuario) {
                usuarioJSON.usuario = dadosUsuario;
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

// Função para excluir um usuário pelo id
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

// Função para inserir um novo usuário
const setInserirNovoUsuario = async function(dadosUsuario, contentType) {
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

// Função para atualizar um usuário pelo ID
const setAtualizarUsuario = async function(id, novosDadosUsuario) {
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

// Exportando as funções para uso externo
module.exports = {
    getListarUsuarios,
    getBuscarUsuario,
    setExcluirUsuario,
    setInserirNovoUsuario,
    setAtualizarUsuario
};
