package com.example.demo05.entity;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "tbl_order")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增组件
    private Integer id;

    private String createDate;

    private Integer status;
    //操作员
    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", date=" + createDate +
                ", status='" + status + '\'' +
                ", employee=" + employee +
                '}';
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

}
