package com.hfut.dao;

import com.hfut.entity.ClazzEntity;
import com.hfut.entity.CourseEntity;
import com.hfut.entity.SelectCourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface SelectCourseDao extends JpaRepository<SelectCourseEntity,Integer> {
    public List<SelectCourseEntity> findByCourseByCourseId(CourseEntity courseEntity);
    public List<SelectCourseEntity> findByClazzByClassId(ClazzEntity clazzEntity);
    public SelectCourseEntity findByClazzByClassIdAndCourseByCourseId(ClazzEntity clazzEntity,CourseEntity courseEntity);
}
