import express from 'express';
import { auth } from '../middlewares';
const router = express.Router();
import { registerController, loginController, userController,refreshController, productController } from "../controllers";
import { admin } from '../middlewares'
router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.post('/logout',auth,loginController.logout);
router.get('/me',auth,userController.me);
router.post('/refresh',refreshController.refresh);
router.post('/product',[auth, admin],productController.create);
router.put('/product/:id',[auth, admin],productController.update);  //updating the products
router.delete('/product/:id',[auth, admin],productController.delete); //deleting the products
router.get('/product',productController.index);  //get all the products details
router.get('/product/:id',productController.show);  //get all the products details

export default router;