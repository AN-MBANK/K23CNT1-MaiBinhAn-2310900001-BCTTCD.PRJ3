package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaOrder;
import com.mbaevolution.mba_evolutionAI.repository.MbaOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class MbaOrderController {

    @Autowired
    private MbaOrderRepository orderRepository;

    @PostMapping
    public MbaOrder createOrder(@RequestBody MbaOrder order) {
        return orderRepository.save(order);
    }

    @GetMapping
    public List<MbaOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/user/{username}")
    public List<MbaOrder> getOrdersByUser(@PathVariable String username) {
        return orderRepository.findByUser_MbaUsername(username);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MbaOrder> updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        return orderRepository.findById(id)
                .map(order -> {
                    String newStatus = status.replace("\"", "");
                    order.setMbaStatus(newStatus);
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

}