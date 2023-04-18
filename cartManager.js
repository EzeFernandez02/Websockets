import fs from "fs";
import path from "path";

export default class CartManager {
  constructor() {
    this.path = path.resolve() + "/src/db/carts.json";
  }

  /*Este método se encarga de leer la información del archivo carts.json y devolverla en formato JSON. Si el archivo no existe, este método crea un nuevo archivo vacío y lo guarda en la ruta especificada.*/
  async readData() {
    try {
      if (fs.existsSync(this.path)) {
        let data = JSON.parse(await fs.promises.readFile(this.path, "utf8"));

        return data;
      }
      this.saveData([]);
      return [];
    } catch (error) {
      console.log(error);
      throw new Error("There was an error reading the file");
    }
  }

  /*Este método se encarga de guardar la información del carrito en el archivo carts.json*/
  async saveData(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error("There was an error saving the data");
    }
  }

  /*Este método se encarga de crear un nuevo carrito de compra. Si el archivo carts.json está vacío, se crea un carrito con el id 1. Si ya hay carritos en el archivo, se crea uno nuevo con el id siguiente al último carrito en el archivo.*/
  async create() {
    try {
      let carts = await this.readData();

      if (!carts.length) {
        await this.saveData([{ id: 1, products: [] }]);
        return "Cart created successfully";
      }
      carts.push({ id: carts[carts.length - 1].id + 1, products: [] });
      await this.saveData(carts);

      return "Cart created successfully";
    } catch (error) {
      return "There was a problem crating the cart";
    }
  }

  /*Este método se encarga de obtener la información de un carrito de compra en particular, dado su id.*/
  async get(id) {
    try {
      {
        let data = await this.readData();
        let response = data.find((cart) => cart.id === id);
        if (response) {
          return response;
        }
        return "Cart not found";
      }
    } catch (error) {
      throw new Error("Error recovering the data");
    }
  }

  /*Este método se encarga de agregar un producto a un carrito de compra existente. Si el producto ya existe en el carrito, se incrementa su cantidad. Si el carrito no existe, se devuelve un mensaje de error.*/
  async addProduct(cid, pid) {
    try {
      const carts = await this.readData();
      const index = carts.findIndex((cart) => cart.id === cid);

      if (index === -1) {
        return "This cart does not exist";
      }

      const products = carts[index].products;
      const productIndex = products.findIndex((product) => product.id === pid);

      if (productIndex === -1) {
        const productToAdd = { id: pid, quantity: 1 };
        carts[index].products.push(productToAdd);
      } else {
        carts[index].products[productIndex].quantity++;
      }

      await this.saveData(carts);

      return "New product added";
    } catch (error) {
      return "There was an error adding the product to the cart";
    }
  }
}
