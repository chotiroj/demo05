package com.example.demo05.dao;


import com.example.demo05.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Collection;
import java.util.Optional;


public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

     Collection<Employee> findByLastNameContaining(String lastName);

     Collection<Employee> findByDepartment_Id(Integer id);

     Collection<Employee> findByDepartment_IdAndLastNameContaining(Integer id,String lastName);

}
