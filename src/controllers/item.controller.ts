import { Request, Response, NextFunction } from "express";
import Item from "../models/item.model";
import Category from "../models/category.model";
import SubCategory from "../models/subcategory.model";
import { AppError } from "../middleware/error.middleware";

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    if (req.body.subCategory) {
      const subCategory = await SubCategory.findById(req.body.subCategory);
      if (!subCategory) {
        return next(new AppError("SubCategory not found", 404));
      }
      if (subCategory.category.toString() !== category._id.toString()) {
        return next(
          new AppError(
            "SubCategory does not belong to the specified category",
            400
          )
        );
      }
    }

    const item = await Item.create(req.body);
    res.status(201).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await Item.find()
      .populate("category")
      .populate("subCategory");
    res.status(200).json({
      status: "success",
      results: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getItemsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await Item.find({ category: req.params.categoryId })
      .populate("category")
      .populate("subCategory");
    res.status(200).json({
      status: "success",
      results: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getItemsBySubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await Item.find({ subCategory: req.params.subCategoryId })
      .populate("category")
      .populate("subCategory");
    res.status(200).json({
      status: "success",
      results: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("category")
      .populate("subCategory");
    if (!item) {
      return next(new AppError("Item not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: "query" // This ensures update validators run
    })
    if (!item) {
      return next(new AppError("Item not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const searchItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.query;
    if (!query) {
      return next(new AppError("Search query is required", 400));
    }

    const items = await Item.find(
      { $text: { $search: query as string } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("category")
      .populate("subCategory");

    res.status(200).json({
      status: "success",
      results: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};
