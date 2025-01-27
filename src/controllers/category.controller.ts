import { Request, Response, NextFunction } from 'express';
import Category from '../models/category.model';
import { AppError } from '../middleware/error.middleware';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find().populate('subcategories');
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id).populate('subcategories');
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOne({ name: req.params.name }).populate('subcategories');
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};
