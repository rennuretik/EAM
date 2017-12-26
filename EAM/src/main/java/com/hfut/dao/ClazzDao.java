package com.hfut.dao;

import com.hfut.entity.ClazzEntity;
import com.hfut.entity.MajorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface ClazzDao extends JpaRepository<ClazzEntity,Integer> {
    public List<ClazzEntity> findByMajorByMId(MajorEntity majorEntity);
    public  List<ClazzEntity>findByMajorByMIdAndGrade(MajorEntity majorEntity,Integer grade);
}
