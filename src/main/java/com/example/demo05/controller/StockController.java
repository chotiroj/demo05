package com.example.demo05.controller;

import com.example.demo05.dao.StockRepository;
import com.example.demo05.entity.Stock;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

@Controller
public class StockController {
    @Autowired
    StockRepository stockRepository;
    /*
    查询库存
     */
    @ResponseBody
    @RequestMapping("/stock")
    public Map<String, Object> getStock(@RequestParam(name="goodsName",required =false,defaultValue = "") String goodsName,
                                        @RequestParam(name="stock_num",required =false )String stock_num,
                                        @RequestParam(name="supid",required =false)String supid,
		        @RequestParam(name="page",required =false) Integer page,
                                        @RequestParam(name = "rows",required =false) Integer rows) {
        Map<String, Object> map = new HashMap<>();
        PageRequest pageable = PageRequest.of(page-1,rows, Sort.Direction.ASC,"id");
        Collection<Stock> stocks= stockRepository.findAll(pageable).getContent();
        System.out.println(stocks);
        if(!"".equals(goodsName)) {
            System.out.println("goodsName为"+goodsName);
            Collection<Stock> stocks1 =  stockRepository.findByGoods_GoodsNameContaining(goodsName);
            System.out.println("根据商品名称查询："+stocks1);
            map.put("rows",stocks1);
            return  map;
        }
        else if (!"".equals(stock_num)&&stock_num!=null){
            System.out.println("=============="+stock_num);
            Collection<Stock> stocks1=stockRepository.findByNum(Integer.valueOf(stock_num));
            System.out.println("按所商品库存量查询："+stocks1);
            map.put("rows",stocks1);
            return  map;
        }
        else if (!"".equals(supid)&&supid!=null){
            System.out.println(supid);
            Collection<Stock> stocks1=stockRepository.findByGoods_Supplier_Id(Integer.valueOf(supid));
            System.out.println("按所属供应商查询："+stocks1);
            map.put("rows",stocks1);
            return  map;
        }

        else{
            int size=  stockRepository.findAll().size();
            System.out.println(size);
            map.put("total",size);
            map.put("rows",stocks);
            return  map;
        }
    }

    /*
    调整库存
     */
    @ResponseBody
    @RequestMapping("/editStock")
    public Map<String, Object> editStock(@RequestParam("goodsid") Integer goodsid,
                                         @RequestParam("new_num") Integer new_num) {
        Map<String, Object> map = new HashMap<>();
        System.out.println("+++++++++"+goodsid);
        Stock stock = stockRepository.findByGoods_Id(goodsid);
        stock.setNum(new_num);
        stockRepository.save(stock);
        System.out.println(stock);
        map.put("type", "success");
        map.put("msg", "修改成功");
        return map;
    }

    /*
    删除库存的商品
     */
    @ResponseBody
    @RequestMapping("/deleteStock")
    public Map<String, Object> editStock(@RequestParam("goodsid") Integer goodsid) {
        Map<String, Object> map = new HashMap<>();
        System.out.println("+++++++++"+goodsid);
        Stock stock = stockRepository.findByGoods_Id(goodsid);
        stockRepository.delete(stock);
        map.put("type", "success");
        map.put("msg", "删除成功");
        return map;
    }
}
