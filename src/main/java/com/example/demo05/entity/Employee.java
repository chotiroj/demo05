package com.example.demo05.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "tbl_user")
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增组件
	private Integer id;

    //姓名
    @Column(name = "last_name",length = 50)
    private String lastName;

    //1 male, 0 female
    @Column
    private Integer gender;

    @Column(name = "userName",length = 10)
    private String userName;

    @Column(name = "password",length = 10)
    private String password;

    @Column(name = "tel",length = 11)
    private String tel;


    @OneToOne
    @JoinColumn(name="department_id")
    private Department department;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", lastName='" + lastName + '\'' +
                ", gender=" + gender +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", tel='" + tel + '\'' +
                ", department=" + department +
                '}';
    }
}
