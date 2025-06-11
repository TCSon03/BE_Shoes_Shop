export const getListProduct = (req, res) => {
  console.log("danh sach san pham");
  res.send("danh sach a san pham");
};

export const getDetailProduct = (req, res) => {
  console.log("chi tiet san pham");
  res.send("chi tiet san pham");
};

export const createProduct = (req, res) => {
  console.log("tao san pham");
  res.send("tao san pham");
};

export const updateProduct = (req, res) => {
  console.log("cap nhat san pham");
  res.send("cap nhat san pham");
};

export const deleteProduct = (req, res) => {
  console.log("xoa san pham");
  res.send("xoa san pham");
};
