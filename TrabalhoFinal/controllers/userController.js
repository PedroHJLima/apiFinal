
const knex = require('../knex'); // Importe o arquivo knexfile.js que acabamos de criar
const errors = require('restify-errors');

// Aqui você pode definir todas as operações relacionadas à categoria

const getUsers = (req, res, next) => {
  knex('usuarios').then((dados) => {
    res.send(dados);
  }, next);
};


const addUser = (req, res, next) => {
    console.log('Request Body:', req.body);
    knex('usuarios')
      .insert(req.body)
      .returning('*')
      .then((dados) => {
        res.send(dados[0]);
      })
      .catch(next);
};
  
const deleteUser = (req, res, next) => {
  const id = req.params.id;
  knex('usuarios')
    .where('id', id)
    .delete()
    .then((dados) => {
      if (!dados) {
        return res.send(new errors.BadRequestError('Este usuario não foi encontrado'));
      }
      res.send("Usuario de id "+id+" deletada");
    })
    .catch(next);
};
  
const verificaEmail = async (req, res) => {
  const email = req.params.email;

  try {
    const result = await knex('usuarios').where('email', email).first();

    if (result) {
      res.json({ existe: true });
    } else {
      res.json({ existe: false });
    }
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getUsers,
  addUser,
  deleteUser,
  verificaEmail
};
