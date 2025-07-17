// Trong src/common/configs/vnpay.js
const VNP_TMNCODE = "21B7CAO2";
const VNP_HASH_SECRET = "VC9A13WZQUE53NSR829H3G8V7ICHT0KY";
const VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNP_API = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

const VNP_RETURN_URL = "http://localhost:8000/api/payment/vnpay/vnpay_return"; // Cập nhật port nếu server chạy trên 8000
// Gợi ý: Đưa VNP_RETURN_URL vào .env cho môi trường production
// const VNP_RETURN_URL = process.env.VNP_RETURN_URL;

// Thay thế module.exports bằng export
export { VNP_TMNCODE, VNP_HASH_SECRET, VNP_URL, VNP_RETURN_URL, VNP_API };
