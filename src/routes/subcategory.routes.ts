import { Router } from 'express';
import * as subcategoryController from '../controllers/subcategory.controller';

const router = Router();

router.post('/', subcategoryController.createSubCategory);
router.get('/', subcategoryController.getAllSubCategories);
router.get('/category/:categoryId', subcategoryController.getSubCategoriesByCategory);
router.get('/:id', subcategoryController.getSubCategoryById);
router.patch('/:id', subcategoryController.updateSubCategory);

export default router;
