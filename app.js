import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import router from './routes/indexRouter.js';
import { Server } from 'socket.io';

const PORT = 8080;

const app = express();
//Establecemos y configuramos que motor de plantilla usaremos
app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');

app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/', router);

const server = app.listen(PORT, () =>
  console.log('Server listening on port ' + PORT)
);

let messages = [];

let products = [];

const socketServer = new Server(server);

socketServer.on('connection', (socket) => {
  // socket.emit('messageHistory', messages);
  socket.emit('listProducts', products);
  // socket.on('message', (data) => {
  //   let message = { socketId: socket.id, message: data };
  //   messages.push(message);
  //   socketServer.emit('messageHistory', messages);
  // });

  socket.on('addProduct', (data) => {
    products.push(data);
    socket.emit('listProducts', products);
  });
  socket.on('deleteProduct', (data) => {
    products = products.filter((products) => products.name !== data.name);

    socket.emit('listProducts', products);
  });
});
export { socketServer };
