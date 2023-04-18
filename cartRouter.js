import { Router } from 'express';
import CartManager from '../../controllers/cartManager.js';
import ProductManager from '../../controllers/productManager.js';

const cartRouter = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

cartRouter.post('/', async (req, res) => {
  try {
    const response = await cartManager.create();
    res.status(200).json({ data: response });
  } catch (error) {
    return res.status(400).json({ message: 'Error creating cart' });
  }
});

cartRouter.get('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const response = await cartManager.get(id);
    if (response.products) {
      return res.status(200).json({ data: response.products });
    }
    res.status(200).json({ data: response });
  } catch (error) {
    return res.status(400).json({ message: 'Error getting cart' });
  }
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cid = +req.params.cid;
    const pid = +req.params.pid;
    const product = await productManager.getById(pid);
    const cart = await cartManager.get(cid);
    if (product.id && cart.id) {
      const response = await cartManager.addProduct(cid, pid);
      return res.status(200).json({ data: response });
    }
    return res
      .status(400)
      .json({ data: 'No cart or product finded with those id' });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error adding the product to the cart' });
  }
});

export default cartRouter;
