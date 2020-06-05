package com.example.demo05.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MechandiserController {

    @RequestMapping("/mechandiserManege")
    public String goMechandiser(){
        return "mechandiser/main";
    }

    @RequestMapping("/goodsym")
    public String goGoodsym(){
        return "mechandiser/goodsList";
    }

    @RequestMapping("/order_inym")
    public String goOrder_inym(){
        return "mechandiser/order_in";
    }

    @RequestMapping("/order_in_rebackym")
    public String goOrder_reback(){
        return "mechandiser/order_reback";
    }
    @RequestMapping("/stockym")
    public String goStockym(){
        return "mechandiser/stock";
    }

}
