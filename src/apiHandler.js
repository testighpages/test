import Product from "./Product";

async function getAllProductsData() {
  const products = await fetch("http://localhost:3000/api/products");
  const data = await products.json();
  return data;
}

function dataToProducts(data) {
  if (!Array.isArray(data)) return [];

  return data.map((e) => new Product(e));
}

function filterProductsByIdType(idType, array) {
  return array.filter((e) => e.id && e.id.includes(idType));
}

export { getAllProductsData, filterProductsByIdType, dataToProducts };
