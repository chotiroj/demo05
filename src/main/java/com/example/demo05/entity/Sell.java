package com.example.demo05.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "tbl_sell")
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public class Sell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增组件
    private Integer id;

    private String createDate;

    private Integer status;
    private double amount;
    private Integer num;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @OneToOne
    @JoinColumn(name="goods_id")
    private Goods goods;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Goods getGoods() {
        return goods;
    }

    public void setGoods(Goods goods) {
        this.goods = goods;
    }

    @Override
    public String toString() {
        return "Sell{" +
                "id=" + id +
                ", createDate='" + createDate + '\'' +
                ", status=" + status +
                ", amount=" + amount +
                ", num=" + num +
                ", employee=" + employee +
                ", goods=" + goods +
                '}';
    }
}
