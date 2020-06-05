package com.example.demo05.dao;

import com.example.demo05.entity.Sell;
import com.sun.org.apache.bcel.internal.generic.Select;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface SellRepository extends JpaRepository<Sell,Integer> {
    Collection<Sell> findByAmountBetween(double min, double max);

    //不加nativeQuery = true会出错，使用sql原始语句必须加nativeQuery = true
    @Query(value = "Select sum(amount) as money,date_format(create_date,?1) as statsDate from tbl_sell group by date_format(create_date,?1)",nativeQuery = true)
    List<Map<String,String>> sellStats(String data);
    Sell findOrderById(Integer id);
}
