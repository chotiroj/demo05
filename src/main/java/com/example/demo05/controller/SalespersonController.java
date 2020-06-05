package com.example.demo05.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SalespersonController {

    @RequestMapping("/salespersonManege")
    public String goSalesperson(){
        return "salesperson/main";
}

    @RequestMapping("/sell")
    public String goSell(){
        return "salesperson/sell";
    }

    @RequestMapping("/sell_reback")
    public String goSell_reback(){
        return "salesperson/sell_reback";
    }
}
