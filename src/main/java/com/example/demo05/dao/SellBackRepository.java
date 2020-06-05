package com.example.demo05.dao;

import com.example.demo05.entity.Sell;
import com.example.demo05.entity.SellBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface SellBackRepository extends JpaRepository<SellBack,Integer> {
    Collection<SellBack> findByAmountBetween(double min, double max);

    @Query(value = "Select sum(amount) as money,date_format(create_date,?1) as statsDate from tbl_sell_back group by date_format(create_date,?1)",nativeQuery = true)
    List<Map<String,String>> backStats(String data);
}
