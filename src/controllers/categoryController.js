import Category from "../models/Category.js";
import handleAsync from "../utils/handleAsync.js";
import createReponse from "../utils/reponse.js";
import { categorySchema } from "../validators/category.js";

export const createCategory = handleAsync(async (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return next(createError(400, error.details[0].message));
  }
  const data = await Category.create(req.body);
  console.log("Category created:", data);
  if (data) {
    return res.json(
      createReponse(true, 201, "Category created successfully", data)
    );
  }

  next(createError(400, "Category creation failed"));
});

export const getAllCategory = handleAsync(async (req, res, next) => {
  const categories = await Category.find();
  console.log("Categories retrieved:", categories);
  if (categories) {
    return res.json(
      createReponse(true, 200, "Categories retrieved successfully", categories)
    );
  }

  next(createError(404, "No categories found"));
});

export const getDetailCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  console.log("Category details retrieved:", category);
  if (category) {
    return res.json(
      createReponse(
        true,
        200,
        "Category details retrieved successfully",
        category
      )
    );
  }

  next(createError(404, "Category not found"));
});

export const updateCategory = handleAsync(async (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return next(createError(400, error.details[0].message));
  }
  const { id } = req.params;
  if (id) {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body);
    console.log("Category updated:", updatedCategory);
    return res.json(
      createReponse(true, 200, "Category updated successfully", updatedCategory)
    );
  }

  next(createError(404, "Category not found"));
});

export const deleteCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id) {
    const deletedCategory = await Category.findByIdAndDelete(id);
    console.log("Category deleted:", deletedCategory);
    return res.json(
      createReponse(true, 200, "Category deleted successfully", deletedCategory)
    );
  }

  next(createError(404, "Category not found"));
});

export const sortDeleteCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id) {
    const deletedCategory = await Category.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });
    console.log("Category hidden:", deletedCategory);
    return res.json(
      createReponse(true, 200, "Category hidden successfully", deletedCategory)
    );
  }

  next(createError(false, 404, "Category not found"));
});

export const restoreCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id) {
    const restoredCategory = await Category.findByIdAndUpdate(id, {
      deletedAt: null,
    });
    console.log("Category restored:", restoredCategory);
    return res.json(
      createReponse(
        true,
        200,
        "Category restored successfully",
        restoredCategory
      )
    );
  }

  next(createError(false, 404, "Category not found"));
});
