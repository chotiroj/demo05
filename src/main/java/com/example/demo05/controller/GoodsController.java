package com.example.demo05.controller;

import com.example.demo05.dao.GoodsRepository;
import com.example.demo05.dao.SupplierRepository;
import com.example.demo05.entity.Goods;
import com.example.demo05.entity.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class GoodsController {

    @Autowired
    GoodsRepository goodsRepository;

    @Autowired
    SupplierRepository supplierRepository;

    /*
    查询所有商品信息
     */
    @ResponseBody
    @PostMapping("/goods")
    public Map<String,Object> getGoods(@RequestParam(name="goodsName",required =false,defaultValue = "") String goodsName,
                                       @RequestParam(name="id",required =false )Integer id,
                                       @RequestParam(name="supid",required =false)String supid,
                                       @RequestParam(name="page",required =false) Integer page,
                                       @RequestParam(name = "rows",required =false) Integer rows){
        Map<String,Object> map=new HashMap<>();
        PageRequest pageable = PageRequest.of(page-1,rows, Sort.Direction.ASC,"id");
        Collection<Goods> goods= goodsRepository.findAll(pageable).getContent();
        int  size=goodsRepository.findAll().size();;
        System.out.println("goodsName为"+goodsName);
        if(id!=null){
            Collection<Goods> good= Collections.singleton(goodsRepository.getOne(id));
            System.out.println("根据商品编号查询："+good);
            map.put("rows",good);
            return  map;
        }else if(!"".equals(goodsName)) {
            System.out.println("goodsName为"+goodsName);
            Collection<Goods> good =  goodsRepository.findByGoodsNameContaining(goodsName);
            System.out.println("根据商品名称查询："+good);
            return  map;
        }
        else if (supid!=null&&!"".equals(supid)){
            System.out.println(supid);
            Collection<Goods> good=goodsRepository.findBySupplier_Id(Integer.valueOf(supid));
            System.out.println("按所属供应商查询："+good);
            map.put("rows",good);
            return  map;
        }
        else{
            System.out.println(size);
            map.put("total",size);
            map.put("rows",goods);
            System.out.println("这里打印"+goods);
            return  map;
        }

    }

    /*
    查询供应商信息
     */
    @ResponseBody
    @PostMapping("/suppliers")
    public List<Supplier> getSuppliers(){
        List<Supplier> suppliers = supplierRepository.findAll();
        return suppliers;
    }

    /*
   添加商品信息
    */
    @ResponseBody
    @PostMapping("/good")
    public Map<String,Object> addEmp(Goods goods){
        goodsRepository.save(goods);
        System.out.println("保存的员工信息："+goods);
        Map<String,Object> map=new HashMap<>();
        map.put("type","success");
        map.put("msg","添加成功");
        return map;
    }

    /*
    修改商品信息
     */
    @ResponseBody
    @PutMapping("/good")
    public Map<String, Object> updateEmployee(Goods goods){
        System.out.println("修改的员工为:"+goods);
        goodsRepository.save(goods);
        Map<String,Object> map=new HashMap<>();
        map.put("msg","修改成功！");
        map.put("type","success");
        return map;
    }

    /*
    按ids批量删除商品信息
     */
    @ResponseBody
    @DeleteMapping("/good/{ids}")
    public Map<String, Object> deleteEmployee(@PathVariable("ids") String ids){
        System.out.println(ids);
        if(ids.contains(",")){
            String[] str_ids = ids.split(",");
            List<Integer> del_ids=new ArrayList<>();
            for (String string:str_ids){
                del_ids.add(Integer.parseInt(string));
            }
            for(Integer id:del_ids){
                goodsRepository.deleteById(id);
            }
        }else{
            Integer id=Integer.parseInt(ids);
            goodsRepository.deleteById(id);
        }
        Map<String,Object> map=new HashMap<>();
        map.put("msg","删除成功");
        map.put("type","success");
        return map;

    }
}
