package com.example.demo05.dao;

import com.example.demo05.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface StockRepository extends JpaRepository<Stock,Integer> {

    Stock findByGoods_Id(Integer id);

    Collection<Stock> findByGoods_GoodsNameContaining(String goodsName);

    Collection<Stock> findByGoods_Supplier_Id(Integer integer);

    Collection<Stock> findByNum(Integer stock_num);
}
