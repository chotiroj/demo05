package com.example.demo05.dao;

import com.example.demo05.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface SupplierRepository  extends JpaRepository<Supplier,Integer> {

    Collection<Supplier> findByContactNameContaining(String contactName);
}
