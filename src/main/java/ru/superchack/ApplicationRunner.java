package ru.superchack;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class ApplicationRunner {
     static void main(String[] args) {
        SpringApplication.run(ApplicationRunner.class,args);
        System.out.print("Сайт:http://localhost:8080/");
    }
}
