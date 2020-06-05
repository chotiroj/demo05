package com.example.demo05.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "tbl_orderOut")
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public class OrderOut {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增组件
    private Integer id;

    private Integer status;

    private double amount;

    private Integer num;

    private String createDate;

    @OneToOne
    @JoinColumn(name="goods_id")
    private Goods goods;

    public Goods getGoods() {
        return goods;
    }

    public void setGoods(Goods goods) {
        this.goods = goods;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    @Override
    public String toString() {
        return "OrderOut{" +
                "id=" + id +
                ", status=" + status +
                ", amount=" + amount +
                ", num=" + num +
                ", createDate='" + createDate + '\'' +
                ", goods=" + goods +
                '}';
    }
}
