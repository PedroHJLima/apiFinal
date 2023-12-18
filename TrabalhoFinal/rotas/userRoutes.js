const userController = require('../controllers/userController');
const { Router } = require("express");

const router = Router();

router.get('/', userController.getUsers);
router.get('/verificar/:email',userController.verificaEmail);
router.post('/', userController.addUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;