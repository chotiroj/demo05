package com.example.demo05.entity;

import com.alibaba.druid.sql.dialect.oracle.visitor.OracleEvalVisitor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "tbl_orderDetails")
@JsonIgnoreProperties(value = { "hibernateLazyInitializer"})
public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增组件
    private Integer id;

    @OneToOne
    @JoinColumn(name="goods_id")
    private Goods goods;

    private Integer num;

    private double amount;

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Goods getGoods() {
        return goods;
    }

    public void setGoods(Goods goods) {
        this.goods = goods;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    @Override
    public String toString() {
        return "OrderDetails{" +
                "id=" + id +
                ", goods=" + goods +
                ", num=" + num +
                ", amount=" + amount +
                ", order=" + order +
                '}';
    }
}
