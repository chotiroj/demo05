package com.example.demo05.controller;

import com.example.demo05.dao.SellBackRepository;
import com.example.demo05.dao.SellRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class StatsController {

    @Autowired
    private SellRepository sellRepository;

    @Autowired
    private SellBackRepository sellBackRepository;

    @RequestMapping("/goSatas")
    public String goSatas(){
        return "manager/stats";
    }

    @RequestMapping("/Stats")
    @ResponseBody
    public Map<String,Object> Stats(@RequestParam(name="type",defaultValue="statsDay")String type){
        Map<String,Object>ret=new HashMap<>();
        switch (type){
            case "statsDay":{
                ret.put("sellData",sellRepository.sellStats("%Y-%m-%d"));
                ret.put("sellRebackData", sellBackRepository.backStats("%Y-%m-%d"));
                break;
            }
            case "statsMonth":{
                ret.put("sellData",sellRepository.sellStats("%Y-%m"));
                ret.put("sellRebackData", sellBackRepository.backStats("%Y-%m"));
                break;
            }
            case "statsYear":{
                ret.put("sellData",sellRepository.sellStats("%Y"));
                ret.put("sellRebackData", sellBackRepository.backStats("%Y"));
               break;
            }
            default:{
                ret.put("sellData", sellRepository.sellStats("%Y-%m-%d"));
                ret.put("sellRebackData", sellBackRepository.backStats("%Y-%m-%d"));
                break;
            }
        }
        ret.put("type","success");
        return ret;
    }
}
