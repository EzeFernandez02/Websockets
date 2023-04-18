import { Router } from 'express';
import ProductManager from '../../controllers/productManager.js';
import { socketServer } from '../../app.js';

const productRouter = Router();
const productManager = new ProductManager();

productRouter.get('/', async (req, res) => {
  try {
    const response = await productManager.get();
    res.status(200).json({ data: response });
  } catch (err) {
    return res.status(400).json({ message: 'Error getting products' });
  }
});

productRouter.get('/:id', async (req, res) => {
  try {
    let id = +req.params.id;

    const response = await productManager.getById(id);

    res.status(200).json({ data: response });
  } catch (error) {
    return res.status(400).json({ message: 'Error getting product' });
  }
});

productRouter.post('/', async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, status } =
      req.body;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !status
    ) {
      res.status(400).json({ message: 'Missing data' });
    }
    const product = { title, description, price, thumbnail, code, stock };

    const response = await productManager.add(product);

    res.status(201).json({ data: response });
  } catch (error) {
    return res.status(400).json({ message: 'Error adding product' });
  }
});

productRouter.put('/:id', async (req, res) => {
  try {
    let id = +req.params.id;

    const { title, description, price, thumbnail, code, stock } = req.body;

    const productUpdated = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    const response = await productManager.update(id, productUpdated);

    res.status(201).json({ data: response });
  } catch (error) {
    return res.status(400).json({ message: 'Error updating product' });
  }
});

productRouter.delete('/:id', async (req, res) => {
  try {
    let id = +req.params.id;
    const response = await productManager.delete(id);

    res.status(204).json({ message: response });
  } catch (e) {
    return res.status(400).json({ message: 'Error deleting product' });
  }
});
export default productRouter;
