// FILE: mba-admin-logic.js (Cập nhật)

function changeTab(tabName) {
    // ... (logic thay đổi tab giữ nguyên) ...
    document.getElementById('content-orders').classList.add('hidden');
    document.getElementById('content-products').classList.add('hidden');
    document.getElementById('tab-orders').classList.remove('bg-brand-100', 'text-brand-700');
    document.getElementById('tab-products').classList.remove('bg-brand-100', 'text-brand-700');
    document.getElementById('tab-orders').classList.add('text-gray-600', 'hover:bg-gray-50');
    document.getElementById('tab-products').classList.add('text-gray-600', 'hover:bg-gray-50');

    document.getElementById('content-' + tabName).classList.remove('hidden');
    document.getElementById('tab-' + tabName).classList.add('bg-brand-100', 'text-brand-700');
    document.getElementById('tab-' + tabName).classList.remove('text-gray-600', 'hover:bg-gray-50');
}

async function updateOrderStatus(orderId, newStatus) {
    // ... (logic cập nhật trạng thái đơn hàng giữ nguyên) ...
    const selectElement = document.querySelector(`[data-order-id="${orderId}"]`);
    selectElement.disabled = true;

    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStatus)
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

// Logic mới cho Modal
function closeProductModal() {
    window.location.href = '/mba-admin'; // Đóng modal bằng cách quay lại trang admin mà không có tham số editId
}

function previewImage(event) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = ''; // Xóa ảnh cũ
    
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

window.onload = function() {
    changeTab('orders');
};