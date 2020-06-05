package com.example.demo05.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "tbl_supplier")
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增组件
    private Integer id;

    private String address;
    //姓名
    @Column(length = 50)
    private String contactName;

    //1 male, 0 female
    @Column
    private Integer gender;

    @Column(name = "tel",length = 11)
    private String tel;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    @Override
    public String toString() {
        return "Supplier{" +
                "id=" + id +
                ", address='" + address + '\'' +
                ", contactName='" + contactName + '\'' +
                ", gender=" + gender +
                ", tel='" + tel + '\'' +
                '}';
    }
}
