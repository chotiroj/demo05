package com.example.demo05.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LogController {

    @RequestMapping("/Log")
    public String goLog(){
        return "manager/log";
    }
}
