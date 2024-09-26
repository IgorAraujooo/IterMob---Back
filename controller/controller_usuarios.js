const message = require('../modulo/config.js');
const usuarioDAO = require('../model/DAO/usuarios.js');

// Função para listar todos os usuários
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

// Função para buscar um usuário pelo ID
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

            // Atualiza o endereço se fornecido
            if (novosDadosEndereco) {
                if (usuarioExistente.endereco) {
                    // Atualiza endereço existente
                    await usuarioDAO.updateEndereco(usuarioExistente.endereco.id, novosDadosEndereco);
                } else {
                    // Adiciona novo endereço se não houver
                    await usuarioDAO.insertUserAddress(id, novosDadosEndereco);
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
                        id: usuarioAtualizado.id,
                        cpf: usuarioAtualizado.cpf,
                        nome: usuarioAtualizado.nome,
                        sobrenome: usuarioAtualizado.sobrenome,
                        email: usuarioAtualizado.email,
                        telefone: usuarioAtualizado.telefone,
                        foto_perfil: usuarioAtualizado.foto_perfil,
                        endereco: usuarioAtualizado.id_endereco ? {
                            id: usuarioAtualizado.id_endereco,
                            cep: usuarioAtualizado.cep,
                            rua: usuarioAtualizado.rua,
                            numero: usuarioAtualizado.numero,
                            cidade: usuarioAtualizado.cidade,
                            bairro: usuarioAtualizado.bairro,
                            estado: usuarioAtualizado.estado
                        } : null
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

const loginUsuario = async function(email, senha) {
    try {
        
        if (!email || !senha) {
            return message.ERROR_REQUIRED_FIELDS; 
        }

     
        let dadosUsuario = await usuarioDAO.selectUserByEmail(email);

        if (dadosUsuario) {
            
            const senhaValida = await bcrypt.compare(senha, dadosUsuario.senha);

            if (senhaValida) {
               
                let usuarioJSON = {
                    usuario: {
                        id: dadosUsuario.id,
                        nome: dadosUsuario.nome,
                        sobrenome: dadosUsuario.sobrenome,
                        email: dadosUsuario.email
                        
                    },
                    status_code: 200
                };
                return usuarioJSON; 
            } else {
                return message.ERROR_INVALID_CREDENTIALS; 
            }
        } else {
            return message.ERROR_NOT_FOUND; 
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB; 
    }
};

module.exports = {
    getListarUsuarios,
    getBuscarUsuario,
    setExcluirUsuario,
    setInserirNovoUsuario,
    setAtualizarUsuario
};