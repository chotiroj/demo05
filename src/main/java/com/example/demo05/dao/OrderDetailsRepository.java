package com.example.demo05.dao;

import com.example.demo05.entity.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface OrderDetailsRepository extends JpaRepository<OrderDetails,Integer> {

    Collection<OrderDetails> findByOrder_status(Integer status);

    @Query("select o from OrderDetails o where amount>?1 and amount<?2")
    Collection<OrderDetails> findByAmountBetween(double min, double max);
}
