package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaOrder;
import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaOrderRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Comparator;
import java.util.List;

@Controller
@RequestMapping("/user-orders")
public class MbaUserOrdersController {

    @Autowired
    private MbaOrderRepository orderRepository;

    @GetMapping
    public String showUserOrders(HttpSession session, Model model) {
        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");

        if (currentUser == null) {
            return "redirect:/mba-login";
        }

        List<MbaOrder> orders = orderRepository.findByUser_MbaUsername(currentUser.getMbaUsername());

        // Sắp xếp đơn mới nhất lên đầu
        orders.sort(Comparator.comparing(MbaOrder::getMbaOrderId).reversed());

        model.addAttribute("orders", orders);
        model.addAttribute("currentUser", currentUser);

        return "mba-user-orders";
    }
}