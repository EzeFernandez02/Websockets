const socket = io();

 const campo = document.getElementById('message');
 const messagesHtml = document.getElementById('recievedMessages');
const productsHtml = document.getElementById('products');
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const deleteProductTitle = document.getElementById('productId');

const addProduct = () => {
  let product = { name: productName.value, price: productPrice.value };
  if (productName.value === '' || productPrice.value === '') {
    alert('All fields are required');
  } else {
    socket.emit('addProduct', product);
  }
  productName.value = '';
  productPrice.value = '';
};

const deleteProduct = () => {
  socket.emit('deleteProduct', { name: deleteProductTitle.value });
  deleteProductTitle.value = '';
};

socket.on('listProducts', (data) => {
  let html = makeHtmlProductList(data);
  productsHtml.innerHTML = html;
});

 const sendMessage = () => {
   let message = campo.value;
   if (campo.value === '') {
     alert('No se puede enviar un mensaje vacio');
   } else {
     socket.emit('message', message);
   }
   campo.value = '';
 };
  socket.on('messageHistory', (data) => {
   let html = makeHtmlMessageList(data);
   messagesHtml.innerHTML = html;
 });

function makeHtmlProductList(products) {
  if (products.length === 0) {
    return `<br />
  <br />
  <div>There is no products yet</div>`;
  } else {
    return products
      .map((product) => {
        return `<div style='border: 5px solid rgb(112, 236, 112); width:80%'>
          <p>  Product Title: ${product.name}</p>
          <p>  Product Price: ${product.price}</p>
        </div>`;
      })
      .join(' ');
  }
}
 function makeHtmlMessageList(mensajes) {
   return mensajes
     .map((mensaje) => {
       console.log(socket.id + ' ' + mensaje.socketId);
       if (mensaje.socketId === socket.id) {
         return `<div>
                 <p style="text-align:left;">${mensaje.message}</p>
             </div>`;
       } else {
         return `<div>
                 <p style="text-align:right;">${mensaje.message}</p>
             </div>`;
       }
     })
     .join(' ');
}
