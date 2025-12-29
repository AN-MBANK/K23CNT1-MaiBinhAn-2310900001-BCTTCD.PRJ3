// FILE: src/main/resources/static/js/mba-admin-logic.js

// === 1. LOGIC CHUYỂN ĐỔI TAB ===

function changeTab(tabName) {
    // Ẩn tất cả nội dung và reset style nút
    document.getElementById('content-orders').classList.add('hidden');
    document.getElementById('content-products').classList.add('hidden');
    document.getElementById('tab-orders').classList.remove('bg-brand-100', 'text-brand-700');
    document.getElementById('tab-products').classList.remove('bg-brand-100', 'text-brand-700');
    document.getElementById('tab-orders').classList.add('text-gray-600', 'hover:bg-gray-50');
    document.getElementById('tab-products').classList.add('text-gray-600', 'hover:bg-gray-50');

    // Hiện nội dung và set style nút đang active
    document.getElementById('content-' + tabName).classList.remove('hidden');
    document.getElementById('tab-' + tabName).classList.add('bg-brand-100', 'text-brand-700');
    document.getElementById('tab-' + tabName).classList.remove('text-gray-600', 'hover:bg-gray-50');
}

// === 2. LOGIC CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (AJAX PUT) ===

async function updateOrderStatus(orderId, newStatus) {
    const selectElement = document.querySelector(`[data-order-id="${orderId}"]`);
    selectElement.disabled = true;

    try {
        const response = await fetch(`/mba-admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStatus) // Gửi trạng thái mới dưới dạng JSON
        });

        if (response.ok) {
            alert('Cập nhật trạng thái thành công!');
        } else {
            alert('Cập nhật thất bại.');
        }
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        alert('Lỗi kết nối Server.');
    } finally {
        selectElement.disabled = false;
    }
}

// === 3. LOGIC XỬ LÝ MODAL (Thêm/Sửa Sản phẩm) ===

// Đóng modal bằng cách quay lại trang admin mà không có tham số editId
function closeProductModal() {
    window.location.href = '/mba-admin';
}

// Hiển thị ảnh preview khi chọn file
function previewImage(event) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';

    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = "Preview";
            img.className = 'w-24 h-24 object-contain border rounded-lg p-1';
            preview.appendChild(img);
        }
        reader.readAsDataURL(event.target.files[0]);
    }
}


// === 4. CHẠY KHI TẢI TRANG ===

window.onload = function() {
    // Đặt tab mặc định là Đơn hàng khi tải trang (nếu không có modal)
    // Nếu modal đang mở, người dùng sẽ thấy modal.
    changeTab('orders');
};