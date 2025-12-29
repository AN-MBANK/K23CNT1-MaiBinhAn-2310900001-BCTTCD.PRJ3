package com.mbaevolution.mba_evolutionAI.services;

import com.mbaevolution.mba_evolutionAI.entity.MbaOrder;
import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class MbaOrderService {

    @Autowired
    private MbaOrderRepository orderRepository;

    /**
     * Cập nhật trạng thái đơn hàng (Dùng trong MbaAdminController)
     * @param orderId ID của đơn hàng
     * @param newStatus Trạng thái mới (PENDING, SHIPPED, COMPLETED,...)
     * @return true nếu cập nhật thành công, false nếu không tìm thấy
     */
    @Transactional
    public boolean updateOrderStatus(Long orderId, String newStatus) {
        Optional<MbaOrder> optionalOrder = orderRepository.findById(orderId);

        if (optionalOrder.isPresent()) {
            MbaOrder order = optionalOrder.get();
            order.setMbaStatus(newStatus);
            orderRepository.save(order);
            return true;
        }
        return false;
    }

    /**
     * Tạo đơn hàng mới sau khi thanh toán (Dùng trong MbaCartController)
     * @param name Tên khách hàng
     * @param phone Số điện thoại
     * @param address Địa chỉ giao hàng
     * @param totalPrice Tổng tiền
     * @param user Thông tin người dùng (có thể là null nếu là khách)
     * @param cart Giỏ hàng (Map<ProductId, Quantity>)
     * @return Order entity đã được lưu
     */
    @Transactional
    public MbaOrder createOrder(String name, String phone, String address, Double totalPrice, MbaUser user, Map<Long, Integer> cart) {
        // [Logic nghiệp vụ phức tạp: Kiểm tra tồn kho, xử lý thanh toán thực tế sẽ nằm ở đây]

        MbaOrder newOrder = new MbaOrder();
        newOrder.setMbaCustomerName(name);
        newOrder.setMbaPhone(phone);
        newOrder.setMbaAddress(address);
        newOrder.setMbaTotalAmount(totalPrice);
//        newOrder.setMbaFullName(user != null ? user.getMbaUsername() : "GUEST");
        newOrder.setMbaOrderDate(LocalDateTime.now());
        newOrder.setMbaStatus("PENDING"); // Đơn hàng mới luôn bắt đầu là PENDING

        // [Logic lưu chi tiết đơn hàng (Order Items) sẽ được thêm vào đây]

        return orderRepository.save(newOrder);
    }
}