import { Router } from 'express';
import * as itemController from '../controllers/item.controller';

const router = Router();

router.post('/', itemController.createItem);
router.get('/', itemController.getAllItems);
router.get('/search', itemController.searchItems);
router.get('/category/:categoryId', itemController.getItemsByCategory);
router.get('/subcategory/:subCategoryId', itemController.getItemsBySubCategory);
router.get('/:id', itemController.getItemById);
router.patch('/:id', itemController.updateItem);

export default router;
