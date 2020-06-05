package com.example.demo05.entity;

import javax.persistence.*;

@Entity
@Table(name = "tbl_dept")
public class Department {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)//设置自增主键
	private Integer id;
	@Column
	private String departmentName;

	public Department() {
	}
	
	public Department(int i, String string) {
		this.id = i;
		this.departmentName = string;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	@Override
	public String toString() {
		return "Department [id=" + id + ", departmentName=" + departmentName + "]";
	}
	
}
