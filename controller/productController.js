import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

export const getProduct = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    const parentMap = new Map();
    products.forEach((product) => {
      if (product.type === "parent") {
        parentMap.set(product.id, product);
        product.children = [];
      } else if (product.type === "child") {
        const parent = parentMap.get(product.id_parent);
        if (parent) {
          parent.children.push(product);
        }
      }
    });

    const parentProducts = Array.from(parentMap.values());
    const product = parentProducts.map((product) => {
      if (product.img) {
        product.img = `http://example.com/${product.img}`;
      }
      return product;
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductParent = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        type: "parent",
      },
      include: {
        category: true,
      },
    });

    const product = products.map((product) => {
      if (product.img) {
        product.img = `http://example.com/${product.img}`;
      }
      return product;
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductbyIdParent = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.type === "parent") {
      const products = await prisma.product.findMany({
        where: { id_parent: Number(id) },
        include: {
          category: true,
        },
      });

      const parentWithChildren = { ...product, children: products };

      parentWithChildren.children = parentWithChildren.children.map((child) => {
        if (child.img) {
          child.img = `http://example.com/${child.img}`;
        }
        return child;
      });

      if (parentWithChildren.img) {
        parentWithChildren.img = `http://example.com/${parentWithChildren.img}`;
      }

      res.status(200).json(parentWithChildren);
    } else {
      if (product.img) {
        product.img = `http://example.com/${product.img}`;
      }

      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductbyId = async (req, res) => {
  try {
    const response = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        category: true,
      },
    });

    if (!response) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (response.img) {
      response.img = `http://example.com/${response.img}`;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postProduct = async (req, res) => {
  try {
    upload.single("img")(req, res, async (err) => {
      if (err) {
        res.status(500).json({ msg: "Error upload imgage : " + err.message });
      } else {
        const lastProduct = await prisma.product.findFirst({
          orderBy: [{ code: "desc" }],
        });

        let newCode = "P1";

        if (lastProduct) {
          const lastCode = lastProduct.code;
          const numericPart = parseInt(lastCode.slice(1));
          const newNumericPart = numericPart + 1;
          newCode = `P${newNumericPart}`;
        }

        const product = await prisma.product.create({
          data: {
            code: newCode,
            id_category: Number(req.body.id_category),
            name: req.body.name,
            img: req.file.filename,
            weight: parseInt(req.body.weight),
            stock: parseInt(req.body.stock),
            price: req.body.price,
            price_discount: req.body.price_discount,
            id_parent: parseInt(req.body.id_parent),
            type: req.body.type,
            status: req.body.status,
            description: req.body.description,
            variant: req.body.variant,
          },
        });
        res.status(200).json(product);
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    res
      .status(200)
      .json({ msg: `Product with ID ${productId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProductById = async (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProductData = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatedProductData,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
