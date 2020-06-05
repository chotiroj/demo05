package com.example.demo05.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

@Entity
@Table(name = "tbl_goods")
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public class Goods {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增组件
    private Integer id;

    @Column(length = 50)
    private String goodsName;

    @Column(length = 50)
    private String produceArea;

    @Column(length = 10)
    private String size;

    @Column(length = 10)
    private double price;

    @OneToOne
    @JoinColumn(name="supplier_id")
    private Supplier supplier;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getProduceArea() {
        return produceArea;
    }

    public void setProduceArea(String produceArea) {
        this.produceArea = produceArea;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    @Override
    public String toString() {
        return "Goods{" +
                "id=" + id +
                ", goodsName='" + goodsName + '\'' +
                ", produceArea='" + produceArea + '\'' +
                ", size='" + size + '\'' +
                ", price=" + price +
                ", supplier=" + supplier +
                '}';
    }
}
