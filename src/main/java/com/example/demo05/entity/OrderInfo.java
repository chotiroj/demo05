package com.example.demo05.entity;

import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import java.io.Serializable;

public class OrderInfo implements Serializable {
//
//    private String createDate;
//
//    private Integer status;
//    //操作员
//    @OneToOne
//    @JoinColumn(name = "employee_id")
//    private Employee employee;
//
//    @OneToOne
//    @JoinColumn(name="goods_id")
//    private Goods goods;
//
//    private Integer num;
//
//    @Override
//    public String toString() {
//        return "OrderInfo{" +
//                "createDate='" + createDate + '\'' +
//                ", status=" + status +
//                ", employee=" + employee +
//                ", goods=" + goods +
//                ", num=" + num +
//                ", amount=" + amount +
//                '}';
//    }
//
//    public String getCreateDate() {
//        return createDate;
//    }
//
//    public void setCreateDate(String createDate) {
//        this.createDate = createDate;
//    }
//
//    public Integer getStatus() {
//        return status;
//    }
//
//    public void setStatus(Integer status) {
//        this.status = status;
//    }
//
//    public Employee getEmployee() {
//        return employee;
//    }
//
//    public void setEmployee(Employee employee) {
//        this.employee = employee;
//    }
//
//    public Goods getGoods() {
//        return goods;
//    }
//
//    public void setGoods(Goods goods) {
//        this.goods = goods;
//    }
//
//    public Integer getNum() {
//        return num;
//    }
//
//    public void setNum(Integer num) {
//        this.num = num;
//    }
//
//    public double getAmount() {
//        return amount;
//    }
//
//    public void setAmount(double amount) {
//        this.amount = amount;
//    }
//
//    private double amount;
    private Order order;
    private OrderDetails orderDetails;

    public OrderInfo(){}
    public OrderInfo(Order order){
        OrderDetails orderDetails=new OrderDetails();
        this.order=order;
        this.orderDetails=orderDetails;
    }
    public OrderInfo(OrderDetails orderDetails){
        Order order=new Order();
        this.order=order;
        this.orderDetails=orderDetails;
    }
    public OrderInfo(Order order, OrderDetails orderDetails){
        this.order=order;
        this.orderDetails=orderDetails;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public OrderDetails getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(OrderDetails orderDetails) {
        this.orderDetails = orderDetails;
    }
}
