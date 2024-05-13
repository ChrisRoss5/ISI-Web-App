package dev.k1k1.isi_java_api.controller.rest;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
public class MainController {

    @GetMapping("/")
    public void test() {
        System.out.println("Test");
    }

    @PostMapping("/purchase")
    public boolean purchaseMovie() {
        return true;

    }
}
