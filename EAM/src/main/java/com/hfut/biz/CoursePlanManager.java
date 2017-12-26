package com.hfut.biz;

import com.hfut.entity.CourseplanEntity;
import com.hfut.entity.ZTreeNode;
import com.hfut.exception.ArrangeCourseException;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface CoursePlanManager {
    String[] coursePlanByClass(String id);
    List<ZTreeNode> showClassTree(String id);
    String[] coursePlanByTeacher(String id);
    List<ZTreeNode> showTeacherTree(String id);
    String[] coursePlanByRoom(String id);
    List<ZTreeNode> showRoomTree(String id);
    void clear();
    List<CourseplanEntity> creat ()throws ArrangeCourseException;
}
