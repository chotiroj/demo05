package com.example.demo05.dao;

import com.example.demo05.entity.OrderDetails;
import com.example.demo05.entity.OrderOut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface OrderOutRepository extends JpaRepository<OrderOut,Integer> {
    Collection<OrderOut> findByAmountBetween(double min, double max);
}
