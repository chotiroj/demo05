package com.example.demo05.util;

import com.alibaba.fastjson.JSONObject;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MyUtil {
    //判断订单是否过期
    public static boolean checktime(String date1, Date date2) throws Exception {
        SimpleDateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date start=format.parse(date1);
        long cha=date2.getTime()-start.getTime();
        if(cha<0) {
            return false;
        }
        double result=cha*1.0/(1000*60*60);
        if(result<=24) {
            return true;
        }
        else {
            return false;
        }
    }

    public static Integer getUid(HttpSession session){
        Integer uid;
        JSONObject object= (JSONObject) session.getAttribute("User");
        if (object!=null||object.equals(null)){
            uid=object.getInteger("uuid");
            return uid;
        }
        return null;
    }

}
