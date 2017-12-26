package com.hfut.dao;

import com.hfut.entity.FacultyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface FacultyDao extends JpaRepository<FacultyEntity,Integer> {

}
