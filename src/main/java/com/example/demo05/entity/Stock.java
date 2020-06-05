package com.example.demo05.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tbl_stock")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增组件
    private Integer id;

    @OneToOne
    @JoinColumn(name="goods_id")
    private Goods goods;

    private Integer num;

    @Override
    public String toString() {
        return "Inventory{" +
                "id=" + id +
                ", goods=" + goods +
                ", num=" + num +
                '}';
    }

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
}
