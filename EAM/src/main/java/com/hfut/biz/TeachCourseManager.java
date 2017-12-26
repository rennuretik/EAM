package com.hfut.biz;

import com.hfut.entity.TeachCourseEntity;
import com.hfut.entity.ZTreeNode;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface TeachCourseManager {
    List<List> list();
    List<TeachCourseEntity> list(String id);
    List<ZTreeNode> showTeacherTree(String id);
    boolean save(TeachCourseEntity teachCourseEntity);
    boolean delete(Integer id);
    boolean deleteSomeTeachCourse(String ids);
}
