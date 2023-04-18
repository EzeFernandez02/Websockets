import { Router } from 'express';
const viewRouter = Router();

viewRouter.get('/', async (req, res) => {
  res.render('index');
});

export default viewRouter;
