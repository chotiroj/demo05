package com.example.demo05.controller;

import com.example.demo05.dao.DepartmentRepository;
import com.example.demo05.dao.EmployeeRepository;
import com.example.demo05.entity.Department;
import com.example.demo05.entity.Employee;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.*;

@Controller
public class EmployeeController {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @RequestMapping("/empManage")
    public String goEmpManage(){
        return "manager/empList";
    }

    /*
    页面展示所有员工信息
    按名字、员工编号搜索，按部门编号搜索
     */
    @ResponseBody
    @PostMapping("/emps")
    public Map<String, Object> getEmps(@RequestParam(name="lastName",required =false,defaultValue = "") String lastName,
                                       @RequestParam(name="id",required =false )Integer id,
                                       @RequestParam(name="emid",required =false)String emid,
                                       @RequestParam(name="page",required =false) Integer page,
                                       @RequestParam(name = "rows",required =false) Integer rows){
        Map<String, Object> map=new HashMap<>();
        int size;
        PageRequest pageable = PageRequest.of(page-1,rows, Sort.Direction.ASC,"id");
        Collection<Employee> employees= employeeRepository.findAll(pageable).getContent();

        if(id!=null){
            Collection<Employee> employee= Collections.singleton(employeeRepository.getOne(id));
            System.out.println("根据员工编号查询："+employee);
            map.put("rows",employee);
            return  map;
        } else if(!"".equals(emid)&&!"".equals(lastName)){
            System.out.println(lastName+"emid为"+emid);
            Collection<Employee> employee=employeeRepository.findByDepartment_IdAndLastNameContaining(Integer.valueOf(emid),lastName);

            System.out.println("根据编号和部门编号查询"+employee);
            map.put("rows",employee);
            return  map;
        }else if(!"".equals(lastName)) {
            System.out.println("LastName为"+lastName);
            Collection<Employee> employee =  employeeRepository.findByLastNameContaining(lastName);

            System.out.println("根据员工姓名查询："+employee);
            map.put("rows",employee);
            return  map;
        }

       else if (emid!=null){
            System.out.println(emid);
            Collection<Employee> employee=employeeRepository.findByDepartment_Id(Integer.valueOf(emid));

            System.out.println("按部门编号查询："+employee);
            map.put("rows",employee);
            return  map;
        }
       else{
            size=  employeeRepository.findAll().size();
            System.out.println(size);
            map.put("rows",employees);
            map.put("total",size);
            System.out.println("这里打印"+employees);
            return  map;
        }
    }

    /*
    查询部门信息
     */
    @ResponseBody
    @PostMapping("/depts")
    public  Collection<Department> getDept(){
        Collection<Department> departments = departmentRepository.findAll();
        return departments;
    }

    /*
    添加员工信息
     */
    @ResponseBody
    @PostMapping("/emp")
    public Map<String,Object> addEmp(Employee employee){
        System.out.println("保存的员工信息："+employee);
        employeeRepository.save(employee);
        Map<String,Object> map=new HashMap<>();
        map.put("type","success");
        map.put("msg","添加成功");
        return map;
    }

    /*
    修改员工信息
     */
    @ResponseBody
    @PutMapping("/emp")
    public Map<String, Object> updateEmployee(Employee employee){
        System.out.println("修改的员工为:"+employee);
        employeeRepository.save(employee);
        Map<String,Object> map=new HashMap<>();
        map.put("type","success");
        map.put("msg","修改成功！");
        return map;
    }

    /*
    根据员工id进行批量删除
     */
    @ResponseBody
    @DeleteMapping("/emp/{ids}")
    public Map<String, Object> deleteEmployee(@PathVariable("ids") String ids){
        System.out.println(ids);
        if(ids.contains(",")){
            String[] str_ids = ids.split(",");
            List<Integer> del_ids=new ArrayList<>();
            for (String string:str_ids){
                del_ids.add(Integer.parseInt(string));
            }
            for(Integer id:del_ids){
                employeeRepository.deleteById(id);
            }
        }else{
            Integer id=Integer.parseInt(ids);
            employeeRepository.deleteById(id);
        }
        Map<String,Object> map=new HashMap<>();
        map.put("type","success");
        map.put("msg","删除成功");
        return map;

    }


//    @GetMapping("/emp/{id}")
//    public String toUpdatePage(@PathVariable("id") Integer id,Model model){
//        Employee employee = employeeRepository.getOne(id);
//        model.addAttribute("emp",employee);
//        Collection<Department> departments = departmentRepository.findAll();
//        model.addAttribute("depts",departments);
//        return "emp/update";
//    }

//      @Autowired
//    JdbcTemplate jdbcTemplate;
//
//    @ResponseBody
//    @RequestMapping("/query")
//    public Map<String,Object> map(){
//        List<Map<String, Object>> maps = jdbcTemplate.queryForList("SELECT * FROM tbl_user");
//        return maps.get(0);
//    }
}
