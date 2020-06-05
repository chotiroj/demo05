package com.example.demo05.controller;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.demo05.dao.OrderDetailsRepository;
import com.example.demo05.dao.OrderRepository;
import com.example.demo05.dao.PurchaseRepository;
import com.example.demo05.dao.StockRepository;
import com.example.demo05.entity.*;
import com.example.demo05.util.MyUtil;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.HttpMediaTypeException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.nio.charset.MalformedInputException;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class PurchaseController {

    @Autowired
    PurchaseRepository purchaseRepository;

    @Autowired
    OrderDetailsRepository orderDetailsRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    StockRepository stockRepository;

    /*
    添加进货单
     */
    @ResponseBody
    @RequestMapping("/addOrderIn")
    public Map<String, Object> getGoodsForOrder(Order order, OrderDetails orderDetails, @RequestParam("productList") String productList, HttpSession session) {


        Date date = new Date();//获得系统时间.
        SimpleDateFormat sdf = new SimpleDateFormat(" yyyy-MM-dd HH:mm:ss ");
        String nowTime = sdf.format(date);

        //保存订单表
        Employee employee = new Employee();
        employee.setId(MyUtil.getUid(session));
        //employee.setLastName("苏先生");
        order.setEmployee(employee);
        order.setCreateDate(nowTime);
        Order order1 = purchaseRepository.save(order);
        //保存订单详情表
        JSONArray productArray = JSONArray.parseArray(productList);
        double amount = 0;
        List<OrderDetails> list = new ArrayList<>();
        for (int i = 0; i < productArray.size(); i++) {
            //System.out.println(productArray.size());
            JSONObject xx = productArray.getJSONObject(i);
            amount += xx.getInteger("shopnum") * xx.getInteger("price");
            // System.out.println(xx.getString("goodsName"));
            orderDetails = new OrderDetails();
            orderDetails.setNum(xx.getInteger("shopnum"));
            orderDetails.setAmount(amount);
            Goods goods = new Goods();
            goods.setId(xx.getInteger("id"));
            orderDetails.setGoods(goods);
            //System.out.println("ID************+"+orderDetails.getGoods().getId());
            list.add(orderDetails);
            System.out.println(orderDetails);
        }
        for (OrderDetails orderDetails1 : list) {
            orderDetails1.setOrder(order);
            orderDetailsRepository.save(orderDetails1);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("rows", order1);
        map.put("type", "success");
        map.put("msg", "添加成功");
        return map;
    }

    /*
    查询进货单OrderInfo
     */
    @ResponseBody
    @PostMapping("/orderinList")
    public Map<String, Object> showOrder(@RequestParam(value = "status",required = false) Integer status,
                                         @RequestParam(value = "minMoney",required = false) String  minMoney,
                                         @RequestParam(value = "maxMoney",required = false) String maxMoney) {
        Map<String, Object> map = new HashMap<>();
      System.out.println("============="+status);
       System.out.println("============="+maxMoney);
        System.out.println("============="+minMoney);

        List<OrderDetails> ordersDerails = orderDetailsRepository.findAll();
        if((minMoney!=null&&maxMoney!=null)&&(!"".equals(minMoney)&&!"".equals(maxMoney))){
            double min = Double.valueOf(minMoney);
            double max = Double.valueOf(maxMoney);
            Collection<OrderDetails> orderDetails=orderDetailsRepository.findByAmountBetween(min,max);
            System.out.println("+++++++++++++"+orderDetails);
            map.put("rows",orderDetails);
            return map;
        }
        if(status!=null){
            Collection<OrderDetails> orderDetails=orderDetailsRepository.findByOrder_status(status);
            System.out.println(orderDetails);
            map.put("rows",orderDetails);
            return map;
        }

            map.put("rows", ordersDerails);
        ///System.out.println("===================="+map);
            return map;

    }
/*
查看订单表
 */
    @ResponseBody
    @RequestMapping("/orderDetails")
    public Map<String, Object> showOrderDetails(@RequestParam("id") Integer id) {
        Map<String, Object> map = new HashMap<>();
        System.out.println(id);
        List<OrderDetails> orderDetails = Collections.singletonList(orderDetailsRepository.getOne(id));
        // System.out.println("================"+orderDetails);
        map.put("rows", orderDetails);
        map.put("total", orderDetails.size());
        return map;
    }

    /*
    采购入库
    */
    @ResponseBody
    @RequestMapping("/stockIn")
    public Map<String, Object> stockIn(@RequestParam("num") Integer num, @RequestParam("ids") String ids,
                                       @RequestParam("orderId") Integer OrderId) {
        Map<String, Object> map = new HashMap<>();
        System.out.println(num);
        ids=ids.substring(0,ids.length()-1);
        System.out.println(ids);
        Order order = orderRepository.getOne(OrderId);
        order.setStatus(2);
        orderRepository.save(order);

        if(ids.contains(",")){
            Goods goods=new Goods();
            String[] str_ids = ids.split(",");
            List<Integer> save_ids=new ArrayList<>();
            for (String string:str_ids){
                save_ids.add(Integer.parseInt(string));
            }
            for(Integer id:save_ids){
                Stock one = stockRepository.findByGoods_Id(id);
                if(one==null){
                    goods.setId(id);
                    Stock stock=new Stock();
                    stock.setNum(num);
                    stock.setGoods(goods);
                    stockRepository.save(stock);
                }else{
                goods.setId(id);
                one.setNum(one.getNum()+num);
                    System.out.println("====================="+num+one.getNum());
                one.setGoods(goods);
                 stockRepository.save(one);
                }
            }
        }else{
            Goods goods=new Goods();
            Integer id=Integer.parseInt(ids);
            Stock one = stockRepository.findByGoods_Id(id);
            if(one==null){
                goods.setId(id);
                Stock stock=new Stock();
                stock.setGoods(goods);
                stock.setNum(num);
                stockRepository.save(stock);
            }else{
            goods.setId(id);

            one.setNum(one.getNum()+num);
            one.setGoods(goods);
            Stock stock1 = stockRepository.save(one);
            }
        }
        map.put("type", "success");
        map.put("msg", "入库成功");
        return map;
    }


}