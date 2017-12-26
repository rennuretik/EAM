package com.hfut.dao;

import com.hfut.entity.CourseEntity;
import com.hfut.entity.FacultyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface CourseDao extends JpaRepository<CourseEntity,Integer> {
    public List<CourseEntity> findByFacultyByFId(FacultyEntity facultyEntity);
    public List<CourseEntity> findByCourseName(String courseName);
}
