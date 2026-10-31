import Product from "./Product";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://tg-shop-back-end.vercel.app/api"
).replace(/\/+$/, "");

async function getAllProductsData() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки товаров: ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Сервер вернул некорректный список товаров");
  }

  return data;
}

function dataToProducts(data) {
  if (!Array.isArray(data)) return [];

  return data.map((e) => new Product(e));
}

function filterProductsByIdType(idType, array) {
  return array.filter((e) => e.id && e.id.includes(idType));
}

export {
  API_BASE_URL,
  getAllProductsData,
  filterProductsByIdType,
  dataToProducts,
};
