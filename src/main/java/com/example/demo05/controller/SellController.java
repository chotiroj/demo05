package com.example.demo05.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.demo05.dao.SellRepository;
import com.example.demo05.dao.StockRepository;
import com.example.demo05.entity.*;
import com.example.demo05.util.MyUtil;
import org.apache.catalina.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class SellController {

    @Autowired
    SellRepository sellRepository;

    @Autowired
    StockRepository stockRepository;
    @ResponseBody
    @PostMapping("/sellList")
    public Map<String,Object> getSellList(@RequestParam(value = "minMoney",required = false) String  minMoney,
                                          @RequestParam(value = "maxMoney",required = false) String maxMoney){
        Map<String, Object> map = new HashMap<>();
        System.out.println(minMoney);
        System.out.println(maxMoney);
        List<Sell> all = sellRepository.findAll();
        if((minMoney!=null&&maxMoney!=null)&&(!"".equals(minMoney)&&!"".equals(maxMoney))){
            double min = Double.valueOf(minMoney);
            double max = Double.valueOf(maxMoney);
            Collection<Sell> s=sellRepository.findByAmountBetween(min,max);
            System.out.println("+++++++++++++"+s);
            map.put("rows",s);
            return map;
        }else{
            System.out.println(all);
            map.put("rows",all);
            return map;
        }

    }

    @ResponseBody
    @PostMapping("/Selldetail")
    public Map<String,Object> getSellDetail(@RequestParam(value = "id") Integer id){
        Map<String, Object> map = new HashMap<>();
        //System.out.println(id);
        List<Sell> sells = Collections.singletonList(sellRepository.getOne(id));
        //System.out.println(sells);
        map.put("rows",sells);
        return map;
    }
    @ResponseBody
    @PostMapping("/addSell")
    public Map<String,Object> getOrderDetails(@RequestParam(value = "productList") String  productList,
                                              @RequestParam(value = "payType") String payType,
                                              @RequestParam(value = "status") Integer status,HttpSession session){

        /*JSONObject jsonObject= (JSONObject) session.getAttribute("User");
        Integer uuid=jsonObject.getInteger("uuid");*/
       // System.out.println(productList);
       // System.out.println(payType);
        //System.out.println(status);
        Date date = new Date();//获得系统时间.
        SimpleDateFormat sdf = new SimpleDateFormat(" yyyy-MM-dd HH:mm:ss ");
        String nowTime = sdf.format(date);
        Employee employee = new Employee();
        employee.setId(MyUtil.getUid(session));
        //employee.setLastName("苏先生");

        //保存退单详情表
        JSONArray productArray = JSONArray.parseArray(productList);
        double amount = 0;
        List<Sell> list = new ArrayList<>();
        for (int i = 0; i < productArray.size(); i++) {
            //System.out.println(productArray.size());
            JSONObject xx = productArray.getJSONObject(i);
            amount += xx.getInteger("num") * xx.getInteger("price");
            // System.out.println(xx.getString("goodsName"));
            Sell sell=new Sell();
            sell.setEmployee(employee);
            sell.setCreateDate(nowTime);
            sell.setNum(xx.getInteger("num"));
            sell.setAmount(amount);
            sell.setStatus(status);
            Goods goods = new Goods();
            goods.setId(xx.getInteger("id"));
            sell.setGoods(goods);
            Stock stock=new Stock();
            stock=stockRepository.findByGoods_Id(xx.getInteger("id"));
            Integer new_num=stock.getNum()-xx.getInteger("num");
            if(new_num<0){
                Map<String,Object> map2=new HashMap<>();
                map2.put("type", "success");
                map2.put("msg", "库存不足，请尽快补充!");
                return map2;
            }else{
                stock.setNum(new_num);
                stockRepository.save(stock);
            }
            //System.out.println("ID************+"+orderDetails.getGoods().getId());
            list.add(sell);
            //System.out.println(sell);
        }
        for (Sell sell : list) {
            sellRepository.save(sell);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("type", "success");
        map.put("msg", "添加成功");
        return map;
    }
}
