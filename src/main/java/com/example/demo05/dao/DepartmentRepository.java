package com.example.demo05.dao;

import com.example.demo05.entity.Department;
import com.example.demo05.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface DepartmentRepository extends JpaRepository<Department,Integer> {

}
