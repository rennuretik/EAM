package com.hfut.biz;

import com.hfut.entity.TeacherEntity;
import com.hfut.entity.ZTreeNode;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface TeacherManager {
    List<List> list(String id);
    List<ZTreeNode> getManagerTeacherTree(String id);
    boolean save(TeacherEntity teacherEntity);
    boolean delete(Integer id);
    boolean deleteSomeTeacher(String ids);
}
