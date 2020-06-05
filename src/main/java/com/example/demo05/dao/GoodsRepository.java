package com.example.demo05.dao;

import com.example.demo05.entity.Goods;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface GoodsRepository extends JpaRepository<Goods,Integer> {
    Collection<Goods> findByGoodsNameContaining(String goodsName);

    Collection<Goods> findBySupplier_Id(Integer integer);
}
