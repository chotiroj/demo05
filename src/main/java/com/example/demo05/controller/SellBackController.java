package com.example.demo05.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.demo05.dao.SellBackRepository;
import com.example.demo05.dao.SellRepository;
import com.example.demo05.dao.StockRepository;
import com.example.demo05.entity.*;
import com.example.demo05.util.MyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class SellBackController {

    @Autowired
    SellRepository sellRepository;

    @Autowired
    SellBackRepository sellBackRepository;

    @Autowired
    StockRepository stockRepository;
    @ResponseBody
    @PostMapping("/sellBackList")
    public Map<String,Object> getSellList(@RequestParam(value = "minMoney",required = false) String  minMoney,
                                          @RequestParam(value = "maxMoney",required = false) String maxMoney){
        Map<String, Object> map = new HashMap<>();
        System.out.println(minMoney);
        System.out.println(maxMoney);
        List<SellBack> all = sellBackRepository.findAll();
        if((minMoney!=null&&maxMoney!=null)&&(!"".equals(minMoney)&&!"".equals(maxMoney))){
            double min = Double.valueOf(minMoney);
            double max = Double.valueOf(maxMoney);
            Collection<SellBack> s=sellBackRepository.findByAmountBetween(min,max);
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
    @PostMapping("/sellBackDetail")
    public Map<String,Object> getSellDetail(@RequestParam(value = "id") Integer  id){
        Map<String, Object> map = new HashMap<>();
        System.out.println(id);
        List<Sell> sells = Collections.singletonList(sellRepository.getOne(id));
        System.out.println(sells);
        map.put("rows",sells);
        return map;
    }
    @ResponseBody
    @PostMapping("/addOrderBack")
    public Map<String,Object> getOrderDetails(@RequestParam(value = "productList") String  productList,
                                              @RequestParam(value = "payType") String payType,
                                              @RequestParam(value = "status") Integer status, HttpSession session){

        //System.out.println(productList);
        //System.out.println(payType);
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
        List<SellBack> list = new ArrayList<>();
        for (int i = 0; i < productArray.size(); i++) {
            //System.out.println(productArray.size());
            JSONObject xx = productArray.getJSONObject(i);
            amount += xx.getInteger("num") * xx.getInteger("price");
            // System.out.println(xx.getString("goodsName"));
            SellBack sellBack=new SellBack();
            sellBack.setEmployee(employee);
            sellBack.setCreateDate(nowTime);
            sellBack.setNum(xx.getInteger("num"));
            sellBack.setAmount(amount);
            sellBack.setStatus(status);
            Goods goods = new Goods();
            goods.setId(xx.getInteger("id"));
            sellBack.setGoods(goods);
            Stock stock=new Stock();
            stock=stockRepository.findByGoods_Id(xx.getInteger("id"));
            Integer new_num=stock.getNum()+xx.getInteger("num");
            stock.setNum(new_num);
            stockRepository.save(stock);
            //System.out.println("ID************+"+orderDetails.getGoods().getId());
            list.add(sellBack);
            System.out.println(sellBack);
        }
        for (SellBack sellBack : list) {
            sellBackRepository.save(sellBack);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("type", "success");
        map.put("msg", "添加成功");
        return map;
    }

    @RequestMapping("/checkOrderTime")
    @ResponseBody
    public Map<String,Object>checkOrder(Integer id){
        Sell order=sellRepository.findOrderById(id);
        Map<String,Object>ret=new HashMap<>();
        boolean result=false;
        String ordertime;
        if (order==null){
            ret.put("type","error");
            ret.put("msg","请检查输入的订单号是否有误！");
        }
        try {
            ordertime=order.getCreateDate();
            result=MyUtil.checktime(ordertime,new Date());
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (result){
            ret.put("type","success");
            ret.put("msg","该订单可予退款！");
            return ret;
        }
        ret.put("type","error");
        ret.put("msg","该订单已过期，不可退款！");
        return ret;

    }
}
