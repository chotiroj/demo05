package com.example.demo05.controller;

import com.example.demo05.dao.SupplierRepository;
import com.example.demo05.entity.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class SupplierController {

    @Autowired
    SupplierRepository supplierRepository;

    @RequestMapping("/supplierManage")
    public String goSupplierManage(){
        return "manager/supList";
    }

    @ResponseBody
    @PostMapping("/supliers")
    public Map<String, Object> getSupplier(@RequestParam(name="contactName",required =false,defaultValue = "") String contactName,
                                           @RequestParam(name="id",required =false )Integer id,
                                           @RequestParam(name="page",required =false) Integer page,
                                           @RequestParam(name = "rows",required =false) Integer rows){
        Map<String, Object> map=new HashMap<>();
        int size;
        PageRequest pageable = PageRequest.of(page-1,rows, Sort.Direction.ASC,"id");
        Collection<Supplier> suppliers= supplierRepository.findAll(pageable).getContent();
        if(id!=null){
            Collection<Supplier> supplier= Collections.singleton(supplierRepository.getOne(id));
            System.out.println("根据供应商编号查询："+supplier);
            map.put("rows",supplier);
            return  map;
        }
        else if(!"".equals(contactName)) {
            Collection<Supplier> supplier =  supplierRepository.findByContactNameContaining(contactName);
            System.out.println("根据联系人姓名查询："+supplier);
            map.put("rows",supplier);
            return  map;
        }
        else{
            size=  supplierRepository.findAll().size();
            System.out.println(size);
            map.put("rows",suppliers);
            map.put("total",size);
            return  map;}
    }

    /*
    添加供应商信息
     */
    @ResponseBody
    @PostMapping("/supplier")
    public Map<String,Object> addEmp(Supplier supplier){
       // System.out.println("保存的员工信息："+supplier);
        supplierRepository.save(supplier);
        Map<String,Object> map=new HashMap<>();
        map.put("type","success");
        map.put("msg","添加成功");
        return map;
    }

    /*
   修改员工信息
    */
    @ResponseBody
    @PutMapping("/supplier")
    public Map<String, Object> updateEmployee(Supplier supplier){
       // System.out.println("修改的员工为:"+supplier);
        supplierRepository.save(supplier);
        Map<String,Object> map=new HashMap<>();
        map.put("type","success");
        map.put("msg","修改成功！");
        return map;
    }

    /*
   根据供应商id进行批量删除
    */
    @ResponseBody
    @DeleteMapping("/supplier/{ids}")
    public Map<String, Object> deleteEmployee(@PathVariable("ids") String ids){
        //System.out.println(ids);
        if(ids.contains(",")){
            List<Integer> del_ids=new ArrayList<>();
            String[] str_ids = ids.split(",");
            for (String string:str_ids){
                del_ids.add(Integer.parseInt(string));
            }
            for(Integer id:del_ids){
                supplierRepository.deleteById(id);
            }
        }else{
            Integer id=Integer.parseInt(ids);
            supplierRepository.deleteById(id);
        }
        Map<String,Object> map=new HashMap<>();
        map.put("type","success");
        map.put("msg","删除成功");
        return map;

    }

}
