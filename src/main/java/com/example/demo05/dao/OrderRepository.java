package com.example.demo05.dao;

import com.example.demo05.entity.Order;
import com.example.demo05.entity.OrderInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Integer> {
    @Query(value="SELECT new com.example.demo05.entity.OrderInfo(u,a)FROM "
            + " com.example.demo05.entity.Order u, com.example.demo05.entity.OrderDetails a WHERE u.id = a.order and u.employee=id")
    List<OrderInfo> findOrderInfo(Integer id);

    Collection<Order> findByStatus(Integer status);


//    @Query("SELECT new com.demo.test.Entity.OrderInfo"
//            + "(u) FROM Order u WHERE u.id IS NULL OR u.Id NOT IN (SELECT a.id FROM Address a)")
//    List<OrderInfo> findViewInfoLeft();
////
//    @Query("SELECT new com.demo.test.Entity.ViewInfo"
//            + "(a) FROM Address a WHERE a.id NOT IN (SELECT u.addressId FROM UserInfo u WHERE u.addressId IS NOT NULL)")
//    List<OrderInfo> findViewInfoRight();
}
