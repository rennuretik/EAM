package com.hfut.biz;

import com.hfut.entity.SelectCourseEntity;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface SelectCourseManager {
//    ��ʼ�б�
    List<List> list();
//    ������ַ����б�
    List<SelectCourseEntity> list(String id);
    boolean save(SelectCourseEntity selectCourseEntity);
    boolean delete(Integer id);
    boolean deleteSomeSelectCourse(String ids);
}
