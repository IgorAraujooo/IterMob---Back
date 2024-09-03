const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


const bodyParserJSON = bodyParser.json();

const controllerUsuario = require('./controller/controller_usuarios')

////////////////////////////////////////////////////////////////////// End Point Usuarios ///////////////////////////////////////////////////////////////////////////////////////////

// Rota para listar os usuários
app.get('/v1/itermob/usuarios', cors(), async function(request, response, next) {
    // Chama a função para retornar os dados dos usuários
    let dadosUsuario = await controllerUsuario.getListarUsuarios();

    // Validação para verificar se existem dados
    if (dadosUsuario) {
        response.status(200).json(dadosUsuario);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});

// Rota para buscar um usuário pelo ID
app.get('/v1/itermob/usuario/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição 
    let idUsuario = request.params.id;
  
    // Solicita para o controller o usuário filtrando pelo ID
    let dadosUsuario = await controllerUsuario.getBuscarUsuario(idUsuario);
  
    response.status(dadosUsuario.status_code).json(dadosUsuario);
});

// Rota para inserir um novo usuário
app.post('/v1/itermob/inserirUsuario', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body;
   
    // Encaminha os dados da requisição para a controller enviar para o banco de dados
    let resultDados = await controllerUsuario.setInserirNovoUsuario(dadosBody, contentType);

    response.status(resultDados.status_code).json(resultDados);
});

// Rota para excluir um usuário pelo ID
app.delete('/v1/itermob/usuario/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição
    let idUsuario = request.params.id;

    // Encaminha os dados para a controller excluir o usuário
    let resultDados = await controllerUsuario.setExcluirUsuario(idUsuario);

    response.status(resultDados.status_code).json(resultDados)
});

app.put('/v1/itermob/usuario/:id', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o ID da requisição
    let idUsuario = request.params.id;

    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os novos dados encaminhados na requisição do body (JSON)
    let novosDadosUsuario = request.body;

    // Encaminha os dados para a controller atualizar o usuario
    let resultDados = await controllerUsuario.setAtualizarUsuario(idUsuario, novosDadosUsuario, contentType);

    response.status(resultDados.status_code).json(resultDados);
});

app.listen(8080, function() {
    console.log('Servidor rodando na porta 8080');
});