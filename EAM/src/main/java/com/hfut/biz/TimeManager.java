package com.hfut.biz;

import com.hfut.entity.TeacherEntity;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface TimeManager {
    List<List> list();
    boolean save(TeacherEntity teacherEntity);
    boolean delete(Integer id);
    boolean deleteSomeTeacher(String ids);
}
