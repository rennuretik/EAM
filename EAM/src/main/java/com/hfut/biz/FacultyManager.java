package com.hfut.biz;

import com.hfut.entity.FacultyEntity;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface FacultyManager {
    List<List> list();
    boolean save(FacultyEntity facultyEntity);
    boolean delete(Integer id);
    boolean deleteSomeFaculty(String ids);
}
