const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bycript = require("bcryptjs");

exports.register = async (req, res, next) => {
  try {
    const email = await User.find({ email: req.body.email });
    if (email.length !== 0) {
      res.json({
        status: "failed",
        messenger: "Email đã có người sử dụng",
      });
      return;
    }
    // Hash password trước khi tạo user
    const hashedPassword = await bycript.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    if (!newUser) {
      res.json({
        status: "failed",
        messenger: "Đăng ký tài khoản thất bại",
      });
      return;
    }
    const token = jwt.sign({ userID: newUser._id }, process.env.APP_SECERT);
    res.json({
      status: "success",
      user: newUser,
      token,
    });
  } catch (err) {
    console.log("Err", err);
    res.json({
      status: "failed",
      messenger: "Đã xảy ra lỗi",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "cart.product"
    );

    // Kiểm tra nếu người dùng không tồn tại
    if (!user) {
      res.json({
        status: "failed",
        messenger: "Email không hợp lệ",
      });
      return;
    }

    if (user.status === "không hoạt động" || user.status === "bị khóa") {
      res.json({
        status: "failed",
        messenger:
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ để được mở khóa.",
      });
      return;
    }

    // Kiểm tra mật khẩu
    if (bycript.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ userID: user.id }, process.env.APP_SECERT);
      const subTotal = user.cart.reduce((total, cart) => {
        let price =
          cart.product.sale > 0
            ? cart.product.price -
              (cart.product.sale / 100) * cart.product.price
            : cart.product.price;
        return total + price * cart.quantity;
      }, 0);
      res.status(200).json({
        status: "success",
        token: token,
        user: {
          _id: user._id,
          cart: user.cart,
          email: user.email,
          firstName: user.firstName,
          status: user.status,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          image: user.image,
          address: user.address,
        },
        subTotal,
      });
    } else {
      res.json({
        status: "failed",
        messenger: "Sai email hoặc mật khẩu",
      });
    }
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({
      status: "error",
      messenger: "Đã xảy ra lỗi",
    });
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const { userID } = req.user;
    if (userID) {
      const user = await User.findById(userID).populate("cart.product");
      const subTotal = user.cart.reduce((total, cart) => {
        let price =
          cart.product.sale > 0
            ? cart.product.price -
              (cart.product.sale / 100) * cart.product.price
            : cart.product.price;
        return total + price * cart.quantity;
      }, 0);
      res.status(200).json({
        status: "success",
        user,
        subTotal,
      });
    }
  } catch (err) {}
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({
        status: "failed",
        messenger: "Không tìm thấy email",
      });
    }

    // Kiểm tra vai trò (role) và trạng thái (status) của tài khoản
    if (user.role !== "admin") {
      return res.json({
        status: "failed",
        messenger: "Bạn không có quyền truy cập vào trang quản trị",
      });
    }

    if (user.status == "không hoạt động") {
      return res.json({
        status: "failed",
        messenger:
          "Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên.",
      });
    }

    if (bycript.compareSync(password, user.password)) {
      const token = jwt.sign({ userID: user.id }, process.env.APP_SECERT);
      return res.status(200).json({
        status: "success",
        token: token,
        user: {
          id: user._id,
          cart: user.cart,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          address: user.address,
          image: user.image,
        },
      });
    } else {
      return res.json({
        status: "failed",
        messenger: "Sai tài khoản hoặc mật khẩu",
      });
    }
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({
      status: "error",
      messenger: "Đã xảy ra lỗi",
    });
  }
};
//     catch (err) {
//         console.log("Err", err);
//         res.status(500).json({
//             status: 'error',
//             messenger: 'Đã xảy ra lỗi'
//         });
//     }
// };
