package com.hfut.dao;

import com.hfut.entity.FacultyEntity;
import com.hfut.entity.TeacherEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface TeacherDao extends JpaRepository<TeacherEntity,Integer> {
    public List<TeacherEntity> findByFacultyByFId(FacultyEntity facultyEntity);
}
