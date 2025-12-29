package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import com.mbaevolution.mba_evolutionAI.services.MbaProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class MbaProductController {

    @Autowired
    private MbaProductRepository productRepository;

    @Autowired
    private MbaProductService productService;

    @GetMapping
    public List<MbaProduct> getAllProducts() {
        return productRepository.findAll();
    }
    @GetMapping("/{id}")
    public ResponseEntity<MbaProduct> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    @Transactional
    public MbaProduct createProduct(@RequestBody MbaProduct product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<MbaProduct> updateProduct(
            @PathVariable Long id,
            @RequestBody MbaProduct productDetails
    ) {
        Optional<MbaProduct> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isPresent()) {
            MbaProduct product = optionalProduct.get();

            product.setMbaName(productDetails.getMbaName());
            product.setMbaPrice(productDetails.getMbaPrice());
            product.setMbaOriginalPrice(productDetails.getMbaOriginalPrice());
            product.setMbaCategory(productDetails.getMbaCategory());
            product.setMbaBrand(productDetails.getMbaBrand());
            product.setMbaDescription(productDetails.getMbaDescription());
            product.setMbaCpu(productDetails.getMbaCpu());
            product.setMbaRam(productDetails.getMbaRam());
            product.setMbaStorage(productDetails.getMbaStorage());
            product.setMbaGpu(productDetails.getMbaGpu());
            product.setMbaScreen(productDetails.getMbaScreen());
            product.setMbaImage(productDetails.getMbaImage());

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