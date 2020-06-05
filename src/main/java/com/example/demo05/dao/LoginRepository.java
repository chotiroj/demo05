package com.example.demo05.dao;

import com.example.demo05.entity.Employee;
import javafx.print.Collation;
import org.springframework.data.jpa.repository.JpaRepository;
import sun.security.util.Password;

import java.util.Collection;

public interface LoginRepository extends JpaRepository<Employee,Integer> {
    Employee findByUserName(String username);
}
