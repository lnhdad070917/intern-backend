import express from "express";
import {
  getProduct,
  postProduct,
  getProductbyId,
  getProductbyIdParent,
  getProductParent,
  deleteProductById,
  updateProductDataById,
  updateProductImageById,
  searchProductParent,
  updateProductById,
  getProductAll,
} from "../controller/productController.js";
import {
  getCategory,
  getCategorybyId,
  updateCategory,
  deleteCategory,
  postCategory,
} from "../controller/categoryController.js";

import { postRegister, login } from "../controller/authController.js";

import {
  postRegisterAdmin,
  loginAdmin,
} from "../controller/admin/authController.js";

import {
  deleteCustomer,
  getCustomer,
  getCustomerbyId,
  postCustomer,
  updateCustomer,
} from "../controller/customerController.js";

import {
  deleteAdmin,
  getAdmin,
  getAdminbyId,
  postAdmin,
  updateAdmin,
} from "../controller/admin/adminController.js";

import {
  updateStatus,
  postStatus,
  getStatusbyId,
  getStatus,
  deleteStatus,
} from "../controller/statusController.js";

import {
  getSalesItem,
  getSalesItembyId,
  deleteSalesItem,
  updateSalesItem,
  postSalesItem,
  createSalesItem,
} from "../controller/salesItemsController.js";

import {
  getSales,
  getSalesbyId,
  updateSales,
  deleteSales,
  postSales,
  getSalesbyInvoice,
} from "../controller/salesController.js";

const router = express.Router();

//Product
router.get("/products", getProduct);
router.post("/products", postProduct);
router.get("/products/:id", getProductbyId);
router.put("/productsid/:id", updateProductById);
router.delete("/products/:id", deleteProductById);
router.get("/product-parent/:id", getProductbyIdParent);
router.get("/product-parent", getProductParent);
router.get("/product/cari", searchProductParent);
router.get("/productall", getProductAll);

//Category
router.get("/categories", getCategory);
router.get("/categories/:id", getCategorybyId);
router.post("/categories", postCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

//user(customer)
router.post("/auth", postRegister);
router.post("/login", login);

//Admin
router.post("/auth-admin", postRegisterAdmin);
router.post("/login-admin", loginAdmin);

//Customers
router.get("/customer", getCustomer);
router.get("/customer/:id", getCustomerbyId);
router.post("/customer", postCustomer);
router.put("/customer/:id", updateCustomer);
router.delete("/customer/:id", deleteCustomer);

//Admin
router.get("/admin", getAdmin);
router.get("/admin/:id", getAdminbyId);
router.post("/admin", postAdmin);
router.put("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin);

//Status
router.get("/status", getStatus);
router.get("/status/:id", getStatusbyId);
router.post("/status", postStatus);
router.put("/status/:id", updateStatus);
router.delete("/status/:id", deleteStatus);

//Sales-Items
router.get("/sales-item", getSalesItem);
router.get("/sales-item/:id", getSalesItembyId);
router.post("/sales-item", postSalesItem);
router.post("/salesitem", createSalesItem);
router.put("/sales-item/:id", updateSalesItem);
router.delete("/sales-item/:id", deleteSalesItem);

//Sales
router.get("/sales", getSales);
router.get("/sales/:id", getSalesbyId);
router.get("/sales-track", getSalesbyInvoice);
router.post("/sales", postSales);
router.put("/sales/:id", updateSales);
router.delete("/sales/:id", deleteSales);

export default router;
