package com.hfut.dao;

import com.hfut.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface CoursePlanDao extends JpaRepository<CourseplanEntity, Integer> {
    public List<CourseplanEntity> findByTeachClassByRcId(TeachClassEntity teachClassEntity);
    public List<CourseplanEntity> findByTeacherByTId(TeacherEntity teacherEntity);
    public List<CourseplanEntity> findByTeacherByTIdOrderByStartWeek(TeacherEntity teacherEntity);
    public List<CourseplanEntity> findByTeachClassByRcIdAndCourseByCourseIdAndTimeByTimeId(TeachClassEntity teachClassEntity, CourseEntity courseEntity, TimeEntity timeEntity);
}
