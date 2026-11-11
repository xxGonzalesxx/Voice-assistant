package ru.superchack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApplicationRunner {
     static void main(String[] args) {
        SpringApplication.run(ApplicationRunner.class,args);
        System.out.print("Сайт:http://localhost:8080/");
    }
}
