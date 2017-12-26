package com.hfut.biz;

import com.hfut.entity.SelectCourseEntity;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface SelectCourseManager {
//    初始列表
    List<List> list();
//    点击出现分类列表
    List<SelectCourseEntity> list(String id);
    boolean save(SelectCourseEntity selectCourseEntity);
    boolean delete(Integer id);
    boolean deleteSomeSelectCourse(String ids);
}
