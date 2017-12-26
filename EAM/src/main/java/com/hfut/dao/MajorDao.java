package com.hfut.dao;

import com.hfut.entity.FacultyEntity;
import com.hfut.entity.MajorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface MajorDao extends JpaRepository<MajorEntity,Integer> {
    public List<MajorEntity> findByFacultyByFId(FacultyEntity facultyEntity);
}
