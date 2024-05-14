package dev.k1k1.isi_java_api.controller.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

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
