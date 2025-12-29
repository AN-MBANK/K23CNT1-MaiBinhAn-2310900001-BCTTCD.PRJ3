package com.mbaevolution.mba_backend.controller;

import com.mbaevolution.mba_backend.entity.Product;
import com.mbaevolution.mba_backend.repository.ProductRepository;
import com.mbaevolution.mba_backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    @Transactional
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product productDetails
    ) {
        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();

            product.setName(productDetails.getName());
            product.setPrice(productDetails.getPrice());
            product.setOriginalPrice(productDetails.getOriginalPrice());
            product.setCategory(productDetails.getCategory());
            product.setBrand(productDetails.getBrand());
            product.setDescription(productDetails.getDescription());
            product.setCpu(productDetails.getCpu());
            product.setRam(productDetails.getRam());
            product.setStorage(productDetails.getStorage());
            product.setGpu(productDetails.getGpu());
            product.setScreen(productDetails.getScreen());
            product.setImage(productDetails.getImage());

            return ResponseEntity.ok(productRepository.save(product));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}