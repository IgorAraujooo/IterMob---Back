const message = require('../modulo/config.js');
const enderecoDAO = require('../model/DAO/endereco.js');

// Função para listar todos os endereços
const getListarEnderecos = async function() {
    try {
        let listarEnderecos = await enderecoDAO.selectAllEnderecos();
        let enderecosJSON = {};

        if (listarEnderecos && listarEnderecos.length > 0) {
            enderecosJSON.enderecos = listarEnderecos;
            enderecosJSON.quantidade = listarEnderecos.length;
            enderecosJSON.status_code = 200;
            return enderecosJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para buscar um endereço pelo id
const getBuscarEndereco = async function(id) {
    try {
        if (id === '' || id === undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let dadosEndereco = await enderecoDAO.selectByIdEndereco(id);
            let enderecoJSON = {};

            if (dadosEndereco) {
                enderecoJSON.endereco = dadosEndereco;
                enderecoJSON.status_code = 200;
                return enderecoJSON; // 200
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para excluir um endereço pelo id
const setExcluirEndereco = async function(id) {
    try {
        if (id === '' || id === undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let enderecoExistente = await enderecoDAO.selectByIdEndereco(id);

            if (enderecoExistente) {
                let resultadoExclusao = await enderecoDAO.deleteEndereco(id);

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


const setInserirNovoEndereco = async function(dadosEndereco, idUsuario, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosEndereco.cep === '' || dadosEndereco.cep === undefined || dadosEndereco.cep.length > 10 ||
                dadosEndereco.rua === '' || dadosEndereco.rua === undefined || dadosEndereco.rua.length > 100 ||
                dadosEndereco.numero === undefined || dadosEndereco.numero.length > 10 ||
                dadosEndereco.cidade === '' || dadosEndereco.cidade === undefined || dadosEndereco.cidade.length > 100 ||
                dadosEndereco.bairro === '' || dadosEndereco.bairro === undefined || dadosEndereco.bairro.length > 100 ||
                dadosEndereco.estado === '' || dadosEndereco.estado === undefined || dadosEndereco.estado.length > 100 ||
                idUsuario === '' || idUsuario === undefined || isNaN(idUsuario)
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let idEndereco = await enderecoDAO.insertEndereco(dadosEndereco, idUsuario);
                if (idEndereco) {
                    let resultadoEndereco = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        endereco: {
                            id: idEndereco,
                            ...dadosEndereco
                        }
                    };
                    return resultadoEndereco; // 201
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


const setAtualizarEndereco = async function(id, novosDadosEndereco) {
    try {
        if (
            id === '' || id === undefined || isNaN(id) ||
            novosDadosEndereco.cep === '' || novosDadosEndereco.cep === undefined || novosDadosEndereco.cep.length > 10 ||
            novosDadosEndereco.rua === '' || novosDadosEndereco.rua === undefined || novosDadosEndereco.rua.length > 100 ||
            novosDadosEndereco.numero === undefined || novosDadosEndereco.numero.length > 10 ||
            novosDadosEndereco.cidade === '' || novosDadosEndereco.cidade === undefined || novosDadosEndereco.cidade.length > 100 ||
            novosDadosEndereco.bairro === '' || novosDadosEndereco.bairro === undefined || novosDadosEndereco.bairro.length > 100 ||
            novosDadosEndereco.estado === '' || novosDadosEndereco.estado === undefined || novosDadosEndereco.estado.length > 100
        ) {
            return message.ERROR_REQUIRED_FIELDS; // 400
        } else {
            let enderecoExistente = await enderecoDAO.selectByIdEndereco(id);

            if (enderecoExistente) {
                let resultadoAtualizacao = await enderecoDAO.updateEndereco(id, novosDadosEndereco);

                if (resultadoAtualizacao) {
                    return {
                        status: message.SUCCESS_UPDATED_ITEM.status,
                        status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                        message: message.SUCCESS_UPDATED_ITEM.message,
                        endereco: {
                            id: id,
                            ...novosDadosEndereco
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

module.exports = {
    getListarEnderecos,
    getBuscarEndereco,
    setExcluirEndereco,
    setInserirNovoEndereco,
    setAtualizarEndereco
};
