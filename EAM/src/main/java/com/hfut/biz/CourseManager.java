package com.hfut.biz;

import com.hfut.entity.CourseEntity;
import com.hfut.entity.ZTreeNode;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface CourseManager {
    List<List> list(String id);
    List<ZTreeNode> getManagerCourseTree(String id);
    boolean save(CourseEntity courseEntity);
    boolean delete(Integer id);
    boolean deleteSomeCourse(String ids);
}
