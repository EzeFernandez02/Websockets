import { Router } from 'express';
import productRouter from './productRouter/productRouter.js';
import cartManager from './cartRouter/cartRouter.js';
import viewRouter from './viewRouter/viewsRoutes.js';
const router = Router();

router.use('/products', productRouter);
router.use('/carts', cartManager);
router.use('/realtimeproducts', viewRouter);

export default router;
