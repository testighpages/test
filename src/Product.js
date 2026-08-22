class Product {
  constructor({
    id = null,
    text = "товар",
    image = null,
    price = 0,
    variants = null,
  } = {}) {
    this.id = id ?? text;
    this.text = text;
    this.image = image;
    this.price = Number(price) || 0;
    const baseVariant = {
      id: `${this.id}-base`,
      name: "основной",
      stock: 0,
    };

    this.variants =
      Array.isArray(variants) && variants.length > 0
        ? variants.map((variant, index) => ({
            id: variant.id ?? `${this.id}-${index}`,
            name: variant.name ?? "основной",
            stock: Math.max(0, Number(variant.stock) || 0),
          }))
        : [baseVariant];
  }
}

export default Product;
