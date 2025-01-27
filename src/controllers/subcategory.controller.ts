import { Request, Response, NextFunction } from 'express';
import SubCategory from '../models/subcategory.model';
import Category from '../models/category.model';
import { AppError } from '../middleware/error.middleware';

export const createSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    
    // If tax applicability is not provided, inherit from category
    if (req.body.taxApplicability === undefined) {
      req.body.taxApplicability = category.taxApplicability;
      if (category.taxApplicability) {
        req.body.tax = category.tax;
        req.body.taxType = category.taxType;
      }
    }

    const subCategory = await SubCategory.create(req.body);
    res.status(201).json({
      status: 'success',
      data: subCategory
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subCategories = await SubCategory.find()
      .populate('category')
      .populate('items');
    res.status(200).json({
      status: 'success',
      results: subCategories.length,
      data: subCategories
    });
  } catch (error) {
    next(error);
  }
};

export const getSubCategoriesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subCategories = await SubCategory.find({ category: req.params.categoryId })
      .populate('category')
      .populate('items');
    res.status(200).json({
      status: 'success',
      results: subCategories.length,
      data: subCategories
    });
  } catch (error) {
    next(error);
  }
};

export const getSubCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id)
      .populate('category')
      .populate('items');
    if (!subCategory) {
      return next(new AppError('SubCategory not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: subCategory
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!subCategory) {
      return next(new AppError('SubCategory not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: subCategory
    });
  } catch (error) {
    next(error);
  }
};
