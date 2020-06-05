package com.example.demo05.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.demo05.dao.OrderDetailsRepository;
import com.example.demo05.dao.OrderOutRepository;
import com.example.demo05.dao.StockRepository;
import com.example.demo05.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class OrderOutController {

    @Autowired
    OrderOutRepository orderOutRepository;

    @Autowired
    StockRepository stockRepository;

    @ResponseBody
    @PostMapping("/getOrederOut")
    public Map<String,Object> getOrderDetails(@RequestParam(value = "minMoney",required = false) String  minMoney,
                                              @RequestParam(value = "maxMoney",required = false) String maxMoney){
        System.out.println(minMoney);
        Map<String,Object> map=new HashMap<>();
        List<OrderOut> all = orderOutRepository.findAll();
        System.out.println("=============================================="+all);
        if(minMoney!=null&&maxMoney!=null){
            double min = Double.valueOf(minMoney);
            double max = Double.valueOf(maxMoney);
            Collection<OrderOut> orderOuts=orderOutRepository.findByAmountBetween(min,max);
            System.out.println("+++++++++++++"+orderOuts);
            map.put("rows",orderOuts);
            return map;
        }
        map.put("rows",all);
        System.out.println(map);
        return  map;

    }

    @ResponseBody
    @RequestMapping("/addOrderOut")
    public Map<String, Object> getGoodsForOrder(  @RequestParam("productList") String productList) {


        Date date = new Date();//获得系统时间.
        SimpleDateFormat sdf = new SimpleDateFormat(" yyyy-MM-dd HH:mm:ss ");
        String nowTime = sdf.format(date);

        //保存退货订单详情表
        JSONArray productArray = JSONArray.parseArray(productList);
        double amount = 0;
        List<OrderOut> list = new ArrayList<>();
        for (int i = 0; i < productArray.size(); i++) {
            //System.out.println(productArray.size());
            JSONObject xx = productArray.getJSONObject(i);
            amount += xx.getInteger("num") * xx.getInteger("price");
            // System.out.println(xx.getString("goodsName"));
            OrderOut orderOut=new OrderOut();
            orderOut.setCreateDate(nowTime);
            orderOut.setNum(xx.getInteger("num"));
            orderOut.setStatus(1);
            orderOut.setAmount(amount);
            Goods goods=new Goods();
            goods.setId(xx.getInteger("id"));
            orderOut.setGoods(goods);
            Stock stock=new Stock();
            stock=stockRepository.findByGoods_Id(xx.getInteger("id"));
            Integer new_num=stock.getNum()-xx.getInteger("num");
            if(new_num<=0){
                stockRepository.delete(stock);

            }else{
                stock.setNum(new_num);
                stockRepository.save(stock);
            }
            list.add(orderOut);
            System.out.println(orderOut);
        }
        for (OrderOut orderOut1 : list) {
           orderOutRepository.save(orderOut1);
        }

        Map<String, Object> map = new HashMap<>();
        //map.put("rows", order1);
        map.put("type", "success");
        map.put("msg", "退货成功");
        return map;
    }


    @ResponseBody
    @PostMapping("/orderOutDetails")
    public Map<String,Object> getOrderOutDetails(@RequestParam("id") Integer id){
        Map<String,Object> map=new HashMap<>();
        System.out.println(id);
        List<OrderOut> orderOuts = Collections.singletonList(orderOutRepository.getOne(id));
        map.put("rows",orderOuts);
        System.out.println(map);
        return  map;
    }
}
