package com.hfut.dao;

import com.hfut.entity.CourseEntity;
import com.hfut.entity.TeachCourseEntity;
import com.hfut.entity.TeacherEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface TeachCourseDao extends JpaRepository<TeachCourseEntity,Integer> {
    public List<TeachCourseEntity> findByTeacherByTId(TeacherEntity teacherEntity);
    public List<TeachCourseEntity> findByCourseByCourseIdOrderByStartWeek(CourseEntity courseEntity);
}
