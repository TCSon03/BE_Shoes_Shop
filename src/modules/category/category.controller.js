import handleAsync from "../../common/utils/handleAsync.js";
import { categorySchema } from "./category.validation.js";
import createReponse from "./../../common/utils/reponse.js";
import findByIdCategory from "./category.service.js";
import Category from "./category.model.js";

export const createCategory = handleAsync(async (req, res, next) => {
  const existing = await Category.findOne({ title: req.body.title });
  if (existing) return next(createError(400, "Category already exists"));
  const data = await Category.create(req.body);
  return res.json(
    createReponse(true, 201, "Category created successfully", data)
  );
});

export const getAllCategory = handleAsync(async (req, res, next) => {
  const data = await Category.find();
  return res.json(
    createReponse(true, 200, "Categories retrieved successfully", data)
  );
});

export const getDetailCategory = handleAsync(async (req, res, next) => {
  const data = await findByIdCategory(req.params.id);
  if (!data) {
    return next(createError(404, "Category not found"));
  }
  return res.json(
    createReponse(true, 200, "Category details retrieved successfully", data)
  );
});

export const updateCategory = handleAsync(async (req, res, next) => {
  const data = await Category.findByIdAndUpdate(req.params.id, req.body);
  if (data)
    return res.json(
      createReponse(true, 200, "Category updated successfully", data)
    );
  next(createError(false, 404, "Category update failed!"));
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
