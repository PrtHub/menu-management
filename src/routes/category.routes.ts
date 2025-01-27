import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';

const router = Router();

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/id/:id', categoryController.getCategoryById);
router.get('/name/:name', categoryController.getCategoryByName);
router.patch('/:id', categoryController.updateCategory);

export default router;
