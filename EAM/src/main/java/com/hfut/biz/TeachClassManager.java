package com.hfut.biz;

import com.hfut.entity.TeachClassEntity;
import com.hfut.exception.ArrangeCourseException;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface TeachClassManager {
    List<TeachClassEntity> list();
    List<List> createTeachClass()throws ArrangeCourseException;
    boolean save(TeachClassEntity teachClassEntity);
    boolean delete(Integer id);
    boolean deleteSomeTeachClass(String ids);
}
