package com.mbaevolution.mba_evolutionAI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@Configuration
public class MbaEvolutionAiApplication implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/products/**")
                .addResourceLocations("file:uploads/products/");
    }

    public static void main(String[] args) {
        SpringApplication.run(MbaEvolutionAiApplication.class, args);
    }
}