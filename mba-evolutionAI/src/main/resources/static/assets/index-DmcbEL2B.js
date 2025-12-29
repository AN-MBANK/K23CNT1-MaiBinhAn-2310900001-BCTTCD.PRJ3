/** * MbaEvolutionAI - Frontend Logic 
 * Định dạng lại cho gọn và dễ quản lý
 */

(function() {
    // 1. Cấu hình Module Preload cho trình duyệt
    const relList = document.createElement("link").relList;
    if (relList && relList.supports && relList.supports("modulepreload")) return;

    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processLink(link);
    }

    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === "LINK" && node.rel === "modulepreload") {
                        processLink(node);
                    }
                }
            }
        }
    }).observe(document, { childList: true, subtree: true });

    function getFetchOpts(link) {
        const opts = {};
        if (link.integrity) opts.integrity = link.integrity;
        if (link.referrerPolicy) opts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === "use-credentials") {
            opts.credentials = "include";
        } else if (link.crossOrigin === "anonymous") {
            opts.credentials = "omit";
        } else {
            opts.credentials = "same-origin";
        }
        return opts;
    }

    function processLink(link) {
        if (link.ep) return;
        link.ep = true;
        fetch(link.href, getFetchOpts(link));
    }
})();

// 2. Logic điều khiển UI cơ bản (Gọn gàng)
document.addEventListener('DOMContentLoaded', () => {
    // Toggle Modal sản phẩm
    const productModal = document.getElementById('productModal');
    const openBtn = document.querySelector('[onclick="openModal()"]');
    const closeBtn = document.querySelector('[onclick="closeModal()"]');

    if (openBtn) {
        openBtn.onclick = () => productModal?.classList.remove('hidden');
    }
    if (closeBtn) {
        closeBtn.onclick = () => productModal?.classList.add('hidden');
    }

    // Tự động ẩn thông báo lỗi sau 3 giây
    const errorMsg = document.querySelector('.bg-red-100');
    if (errorMsg) {
        setTimeout(() => errorMsg.style.display = 'none', 3000);
    }
});

// 3. Phần Footer & Social Icons (Xử lý Lucide Icons)
// (Giữ nguyên các thư viện React/Lucide bên trong file nhưng đã format xuống dòng)