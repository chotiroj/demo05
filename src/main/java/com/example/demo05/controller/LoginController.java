package com.example.demo05.controller;

import com.alibaba.fastjson.JSONObject;
import com.example.demo05.dao.LoginRepository;
import com.example.demo05.entity.Employee;
import javafx.print.Collation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;

@Controller
public class LoginController {
    @Autowired
    private LoginRepository loginRepository;

    @PostMapping(value="/user/login")
    //@RequestMapping(value = "/user/login",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> login(@RequestParam("username") String username,
                        @RequestParam("password") String password,HttpSession session){
        //System.out.println("=============="+username);
      /*  if(!StringUtils.isEmpty(username)&&"a".equals(password)){
            session.setAttribute("loginUser",username);
            ret.put("type","success");
            ret.put("msg","登陆成功！");
            System.out.println(loginRepository.findByUserName("aaa"));
            return ret;
        }else{
            ret.put("type","error");
            ret.put("msg","用户名密码错误");
            return ret;
        }*/
        Map<String,Object>ret=new HashMap<>();
        Employee employees=loginRepository.findByUserName(username);
        System.out.println("=============="+employees);
      if(employees!=null){
          String json="{\"uuid\":\""+employees.getId()+"\",\"userName\":\""+employees.getUserName()+"\",\"lastName\":\""+employees.getLastName()+"\"}";
          JSONObject user=JSONObject.parseObject(json);
          System.out.println(user);
            if(employees.getPassword().equals(password)){
                switch (employees.getDepartment().getId()){
                    case 1001:ret.put("code",1);break;
                    case 1002:ret.put("code",2);break;
                    case 1003:ret.put("code",3);break;
                    case 1004:ret.put("code",4);break;
                    default:ret.put("code",0);break;
                }
                session.setAttribute("User",user);
                ret.put("type","success");
                ret.put("msg","登陆成功！");
                return ret;
            }
          ret.put("type","error");
          ret.put("msg","密码错误！");
          return ret;
      }
      else {
          ret.put("type","error");
          ret.put("msg","该员工不存在！");
          return ret;
      }
    }

    @RequestMapping("/logout")
    public String logout(HttpSession session){
        session.invalidate();
        return "redirect:/login";
    }
}
