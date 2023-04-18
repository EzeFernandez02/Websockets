import fs from 'fs';
import path from 'path';

export default class ProductManager {
  constructor() {
    this.path = path.resolve() + '/src/db/products.json';
  }

  async readData() {
    try {
      if (fs.existsSync(this.path)) {
        let data = JSON.parse(await fs.promises.readFile(this.path, 'utf8'));

        return data;
      }
      this.saveData([]);
      return [];
    } catch (error) {
      console.log(error);
      throw new Error('There was an error reading the file');
    }
  }

  async saveData(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error('There was an error saving the data');
    }
  }

  async get() {
    try {
      {
        let data = await this.readData();
        console.log(data);
        return data;
      }
    } catch (error) {
      throw new Error('Error recovering the data');
    }
  }

  async add(product) {
    try {
      let { title, description, price, thumbnail, code, stock, status } =
        product;
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !status
      ) {
        return 'Missing fields';
      }
      let data = await this.readData();
      if (data.some((product) => product.code === code)) {
        return 'This product is already on our list';
      }

      if (!data.length) {
        this.saveData([{ ...product, id: 1 }]);
        return 'Product added successfully';
      }

      data.push({ ...product, id: data[data.length - 1].id + 1 });
      this.saveData(data);
      return 'Product added successfully';
    } catch (error) {
      console.error(error);
      throw new Error('There was an error adding the product');
    }
  }
  async getById(id) {
    try {
      const data = await this.readData();
      const product = data.find((product) => product.id === id);
      if (product) {
        return product;
      }
      return 'Product not found';
    } catch (error) {
      throw new Error('There was an error getting the product');
    }
  }

  async delete(id) {
    try {
      const data = await this.readData();
      const newData = data.filter((product) => product.id !== id);
      await this.saveData(newData);
      return 'Product deleted successfully';
    } catch (error) {
      throw new Error('There was an error deleting the product');
    }
  }

  async update(id, updatedProduct) {
    try {
      const data = await this.readData();
      const index = data.findIndex((product) => product.id === id);
      if (index === -1) {
        return 'We cannot find your product to update';
      }
      data[index] = { ...data[index], ...updatedProduct };
      await this.saveData(data);
      return 'Product successfully updated';
    } catch (error) {
      throw new Error('There was an error updating the file');
    }
  }
}

const product1 = {
  title: 'Camiseta Manchester City',
  description: 'Camiseta de futbol Manchester city',
  price: 5200,
  thumbnail: 'imagen camiseta MC',
  code: 'MCS9562',
  stock: 16,
};
const product2 = {
  title: 'Camiseta Barcelona',
  description: 'Camiseta de futbol Barcelona',
  price: 4350,
  thumbnail: 'imagen camiseta FCB',
  code: 'FCBS9925',
  stock: 12,
};
const product3 = {
  title: 'Camiseta Milan',
  description: 'Camiseta de futbol Milan',
  price: 300,
  thumbnail: 'imagen camiseta Milan',
  code: 'MS1824',
  stock: 10,
};
async function exec() {
  let p = new ProductManager();
  await p.add(product1);
  await p.add(product2);
  await p.add(product3);
}
exec();
