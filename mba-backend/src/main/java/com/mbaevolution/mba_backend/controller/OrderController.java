package com.mbaevolution.mba_backend.controller;

import com.mbaevolution.mba_backend.entity.Order;
import com.mbaevolution.mba_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    @GetMapping("/user/{username}")
    public List<Order> getOrdersByUser(@PathVariable String username) {
        return orderRepository.findByUsername(username);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        return orderRepository.findById(id)
                .map(order -> {
                    // Cắt bỏ dấu ngoặc kép nếu có do JSON gửi lên
                    String newStatus = status.replace("\"", "");
                    order.setStatus(newStatus);
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}