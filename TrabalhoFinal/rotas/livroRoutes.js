const livroController = require('../controllers/livroController');
const { Router } = require("express");

const router = Router();

router.get('/', livroController.getLivros);
router.get('/disponiveis', livroController.getLivrosDisponiveis);
router.get('/retirados/:userId', livroController.getLivrosPorUsuario);
router.post('/', livroController.adicionarLivros);
router.delete('/:id', livroController.deletarLivro);
router.post('/:livroId/retirar/:usuarioId', livroController.retirarLivro);
router.post('/:livroId/devolver/:usuarioId', livroController.devolverLivro);


module.exports = router;