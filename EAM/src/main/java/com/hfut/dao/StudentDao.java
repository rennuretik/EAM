package com.hfut.dao;

import com.hfut.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface StudentDao extends JpaRepository<StudentEntity,Integer> {
}
