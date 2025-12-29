package com.mbaevolution.mba_evolutionAI.controller;

// XÓA IMPORT NÀY: import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

//@Controller // <--- DÒNG NÀY PHẢI BỊ XÓA HOẶC COMMENT ĐI
public class MbaSpaController { // <-- Biến thành class thường

    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }
}