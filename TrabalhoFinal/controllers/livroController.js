const knex = require('../knex');
const errors = require('restify-errors');

// Aqui você pode definir todas as operações relacionadas à categoria

const getLivros = (req, res, next) => {
  knex('livros').then((dados) => {
    res.send(dados);
  }, next);
};

const getLivrosDisponiveis = (req, res, next) => {
  knex('livros')
    .where({ retirado: false })  // Corrigindo a condição aqui
    .then((dados) => {
      res.send(dados);
    })
    .catch(next);
};

const getLivrosPorUsuario = (req, res, next) => {
  const userId = req.params.userId;
  knex('livros')
    .where({locatario: String(userId)})  // Corrigindo a condição aqui
    .then((dados) => {
      res.send(dados);
    })
    .catch(next);
};

const adicionarLivros = (req, res, next) => {
  knex('livros')
    .insert(req.body)
    .then((dados) => {
      res.send(dados);
    }, next);
};
  
  const deletarLivro = (req, res, next) => {
    const isbn = req.params.id;
    knex('livros')
      .where('isbn', isbn)
      .delete()
      .then((dados) => {
        if (!dados) {
          return res.send(new errors.BadRequestError('Este livro não foi encontrado'));
        }
        res.send("Categoria de id "+id+" deletada");
      })
      .catch(next);
  };

  const retirarLivro = async (req, res) => {
    const { livroId, usuarioId } = req.params;
    try {
      // Verifica se o livro está disponível para retirada
      const livro = await knex('livros').where('isbn', livroId).first();
      if (!livro) {
        return res.send(new errors.BadRequestError('Livro não encontrado'));
      }
  
      if (!livro.retirado) {
        // Atualiza o livro para indicar que foi retirado
        await knex('livros').where('isbn', livroId).update({ retirado: true, locatario : usuarioId});
  
        // Calcula a data de devolução (7 dias a partir de hoje)
        const dataDevolucao = new Date();
        dataDevolucao.setDate(dataDevolucao.getDate() + 7);
  
        // Atualiza o ISBN do usuário e a data de devolução
        await knex('usuarios').where('id', usuarioId).update({
          livro:livroId,
          data_devolucao: dataDevolucao,
        });
  
        res.send('Livro retirado com sucesso. Data de devolução: ' + dataDevolucao.toLocaleDateString());
      } else {
        res.send(new errors.BadRequestError('Livro já retirado.'));
      }
    } catch (error) {
      console.error('Erro ao retirar livro:', error);
      res.send(new errors.InternalServerError('Erro ao retirar livro.'));
    }
  };

  const devolverLivro = async (req, res) => {
    try {
      const { livroId, usuarioId} = req.params;
  
      // Verifica se o livro está disponível para retirada
      const livro = await knex('livros').where('isbn', livroId).first();
      if (!livro) {
        return res.send(new errors.BadRequestError('Livro não encontrado'));
      }
  
      if (livro.retirado) {
        // Atualiza o livro para indicar que foi retirado
        await knex('livros').where('isbn', livroId).update({ retirado: false,locatario:null });
        // Atualiza o ISBN do usuário e a data de devolução
        await knex('usuarios').where('id', usuarioId).update({
          livro: null,
          data_devolucao: null
        });
  
        res.send('Livro devolvido com sucesso.');
      } else {
        res.send(new errors.BadRequestError('Livro não retirado.'));
      }
    } catch (error) {
      console.error('Erro ao devolver livro:', error);
      res.send(new errors.InternalServerError('Erro ao devolver livro.'));
    }
  };
  
  

module.exports = {
  getLivros,
  getLivrosDisponiveis,
  getLivrosPorUsuario,
  adicionarLivros,
  deletarLivro,
  retirarLivro,
  devolverLivro
};
