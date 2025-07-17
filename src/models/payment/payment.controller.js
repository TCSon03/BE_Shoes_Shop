import moment from "moment";
import crypto from "crypto";
import queryString from "query-string";
import {
  VNP_TMNCODE,
  VNP_HASH_SECRET,
  VNP_URL,
  VNP_RETURN_URL,
} from "../../common/configs/vnpay.js";
import Order from "../../models/order/order.model.js";

export const createPaymentUrl = async (req, res) => {
  try {
    const { orderId, amount, bankCode, language } = req.body;
    // Lấy userId từ token đã được giải mã bởi authenticateToken
    // (req.user được thêm vào bởi middleware authenticateToken)
    const userId = req.user.id;

    // Bước 1: Kiểm tra và lấy thông tin đơn hàng từ DB
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Bước 2: Kiểm tra bảo mật - đảm bảo đơn hàng thuộc về người dùng hiện tại
    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden: Order does not belong to the authenticated user",
      });
    }

    // Bước 3: Đảm bảo số tiền khớp với tổng số tiền của đơn hàng
    if (amount !== order.totalAmount) {
      return res
        .status(400)
        .json({ message: "Amount mismatch with order total" });
    }

    // VNPAY yêu cầu số tiền là số nguyên (ví dụ: 1000000 cho 1,000,000 VND)
    const vnp_Amount = amount * 100; // Chuyển đổi sang hệ số 100 (cents)

    // Lấy địa chỉ IP của client
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const tmnCode = VNP_TMNCODE;
    const secretKey = VNP_HASH_SECRET;
    let vnpUrl = VNP_URL;
    const returnUrl = VNP_RETURN_URL;

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");

    // QUAN TRỌNG: Tạo vnp_TxnRef chứa TOÀN BỘ orderId gốc (24 ký tự ObjectId)
    // Thêm tiền tố thời gian để đảm bảo tính duy nhất nếu cần thiết,
    // nhưng orderId gốc luôn là 24 ký tự cuối.
    const vnp_TxnRef = createDate + orderId;

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = language || "vn"; // Ngôn ngữ hiển thị trên cổng VNPAY
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = vnp_TxnRef; // Mã giao dịch của bạn tại hệ thống của bạn, cần là duy nhất
    vnp_Params[
      "vnp_OrderInfo"
    ] = `Thanh toan cho don hang: ${order.userId} - ${order.totalAmount}`;
    vnp_Params["vnp_OrderType"] = "billpayment"; // Có thể thay đổi tùy loại hình dịch vụ
    vnp_Params["vnp_Amount"] = vnp_Amount;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params); // Sắp xếp các tham số trước khi tạo hash

    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    // Sử dụng Buffer.from() thay vì new Buffer() cho các phiên bản Node.js mới hơn
    const vnp_SecureHash = hmac
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    vnpUrl += "?" + queryString.stringify(vnp_Params, { encode: false });
    vnpUrl += "&vnp_SecureHash=" + vnp_SecureHash;

    res.status(200).json({ vnpUrl }); // Trả về URL VNPAY cho frontend
  } catch (error) {
    console.error("Error creating VNPAY payment URL:", error);
    res
      .status(500)
      .json({ message: "Failed to create payment URL", error: error.message });
  }
};

export const vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query; // Lấy tất cả các tham số VNPAY từ query string
    const secureHash = vnp_Params["vnp_SecureHash"]; // Lấy chữ ký bảo mật

    // Xóa các tham số không dùng để tạo hash
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params); // Sắp xếp lại các tham số

    const secretKey = VNP_HASH_SECRET;
    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // QUAN TRỌNG: Lấy lại TOÀN BỘ orderId gốc (24 ký tự) từ vnp_TxnRef
    const vnpTxnRef = vnp_Params["vnp_TxnRef"];
    // Nếu vnp_TxnRef có định dạng YYYYMMDDHHmmss + orderId (24 ký tự), thì orderId gốc là 24 ký tự cuối.
    const originalOrderId = vnpTxnRef.slice(-24);

    // Bước 1: Xác minh chữ ký bảo mật VNPAY
    if (secureHash === signed) {
      const orderId = originalOrderId; // ID đơn hàng gốc
      const rspCode = vnp_Params["vnp_ResponseCode"]; // Mã phản hồi VNPAY
      const transactionStatus = vnp_Params["vnp_TransactionStatus"]; // Trạng thái giao dịch VNPAY
      const amount = parseInt(vnp_Params["vnp_Amount"]) / 100; // Số tiền giao dịch (đổi từ cents về VND)

      let order = await Order.findById(orderId); // Tìm đơn hàng trong DB

      if (order) {
        // Bước 2: Kiểm tra số tiền và trạng thái giao dịch
        if (order.totalAmount === amount) {
          // Đảm bảo số tiền khớp
          if (rspCode === "00" && transactionStatus === "00") {
            // Giao dịch thành công
            if (!order.isPaid) {
              // Chỉ cập nhật nếu đơn hàng chưa được thanh toán
              order.isPaid = true;
              order.paidAt = new Date();
              order.paymentMethod = "Online"; // Cập nhật phương thức thanh toán
              order.status = "processing"; // Chuyển trạng thái đơn hàng sang đang xử lý
              await order.save();
            }
            // Chuyển hướng về trang thành công của Frontend
            return res.redirect(
              `${
                process.env.FE_SUCCESS_URL ||
                "http://localhost:3000/payment-success"
              }?orderId=${orderId}&status=success&amount=${amount}`
            );
          } else {
            // Giao dịch thất bại hoặc bị hủy (rspCode khác 00 hoặc transactionStatus khác 00)
            // Bạn có thể thêm logic cập nhật trạng thái đơn hàng tại đây (ví dụ: "payment_failed")
            // order.status = "payment_failed";
            // await order.save();
            return res.redirect(
              `${
                process.env.FE_FAIL_URL || "http://localhost:3000/payment-fail"
              }?orderId=${orderId}&status=failed&message=Giao dịch không thành công`
            );
          }
        } else {
          // Lỗi: Số tiền không khớp (có thể là tấn công hoặc lỗi dữ liệu)
          console.log("VNPAY Return: Amount mismatch for order", orderId);
          return res.redirect(
            `${
              process.env.FE_FAIL_URL || "http://localhost:3000/payment-fail"
            }?orderId=${orderId}&status=failed&message=Lỗi số tiền không khớp`
          );
        }
      } else {
        // Lỗi: Không tìm thấy đơn hàng trong hệ thống của bạn
        console.log("VNPAY Return: Order not found", orderId);
        return res.redirect(
          `${
            process.env.FE_FAIL_URL || "http://localhost:3000/payment-fail"
          }?orderId=${orderId}&status=failed&message=Không tìm thấy đơn hàng`
        );
      }
    } else {
      // Lỗi: Sai chữ ký bảo mật (dữ liệu bị giả mạo)
      console.log("VNPAY Return: Invalid signature");
      return res.redirect(
        `${
          process.env.FE_FAIL_URL || "http://localhost:3000/payment-fail"
        }?status=failed&message=Sai chữ ký bảo mật`
      );
    }
  } catch (error) {
    console.error("Error in VNPAY return:", error);
    return res.redirect(
      `${
        process.env.FE_FAIL_URL || "http://localhost:3000/payment-fail"
      }?status=error&message=Lỗi hệ thống`
    );
  }
};

function sortObject(obj) {
  // Đảm bảo obj là một đối tượng. Nếu không, trả về đối tượng rỗng.
  if (typeof obj !== "object" || obj === null) {
    return {};
  }

  let sorted = {};
  let str = [];
  let key;

  // Sử dụng Object.keys để duyệt qua các thuộc tính an toàn hơn
  // và tránh lỗi nếu obj không có hasOwnProperty trực tiếp
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    str.push(encodeURIComponent(key));
  }

  str.sort(); // Sắp xếp các key đã encode

  for (key = 0; key < str.length; key++) {
    // Giải mã key để lấy giá trị gốc từ obj, sau đó encode lại giá trị
    sorted[str[key]] = encodeURIComponent(
      obj[decodeURIComponent(str[key])]
    ).replace(/%20/g, "+");
  }
  return sorted;
}
