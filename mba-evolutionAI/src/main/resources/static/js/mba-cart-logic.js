// FILE: src/main/resources/static/js/mba-cart-logic.js

// Hàm 1: Hàm đơn giản để làm mới trang
function updateCartCount() {
    window.location.reload();
}

// Hàm 2: HÀM GỌI API THÊM SẢN PHẨM VÀO GIỎ HÀNG (Sử dụng URL /api/cart/add)
async function addToCart(productId, quantity = 1) {
    try {
        const url = `/api/cart/add?productId=${productId}&quantity=${quantity}`;

        const response = await fetch(url, {
            method: 'POST',
        });

        if (response.ok) {
            updateCartCount(); // Gọi hàm làm mới trang
            alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
        } else {
            alert('Thêm vào giỏ hàng thất bại. Vui lòng kiểm tra Server.');
        }
    } catch (error) {
        console.error('Lỗi kết nối khi thêm vào giỏ hàng:', error);
        alert('Lỗi kết nối Server.');
    }
}


// 3. HÀM DÙNG TRÊN TRANG CHI TIẾT SẢN PHẨM (ĐÃ FIX LỖI TYPEERROR)
function addProductToCartFromDetail(button) {
    const productId = button.dataset.productid;

    // Khắc phục lỗi: Bắt đầu với quantity = 1 (mặc định)
    let quantity = 1;

    // Thử tìm ô nhập số lượng
    const quantityInput = document.getElementById('quantity-input');

    // BƯỚC CẢI TIẾN: Chỉ đọc giá trị nếu element tồn tại
    if (quantityInput) {
        const parsedQuantity = parseInt(quantityInput.value, 10);
        if (parsedQuantity > 0) {
            quantity = parsedQuantity;
        }
    }

    if (productId && quantity > 0) {
        addToCart(productId, quantity);
    } else {
        alert('Lỗi: Sản phẩm hoặc số lượng không hợp lệ.');
    }
}