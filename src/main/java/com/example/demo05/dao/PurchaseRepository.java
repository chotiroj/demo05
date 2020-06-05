package com.example.demo05.dao;

import com.example.demo05.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Order,Integer> {

}
