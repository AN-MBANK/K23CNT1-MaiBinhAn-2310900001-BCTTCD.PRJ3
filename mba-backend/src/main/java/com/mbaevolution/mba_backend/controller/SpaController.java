package com.mbaevolution.mba_backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Chuyển hướng mọi đường dẫn không có đuôi file (không có dấu chấm) về index.html
    // Để React Router tự xử lý việc chuyển trang
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }
}