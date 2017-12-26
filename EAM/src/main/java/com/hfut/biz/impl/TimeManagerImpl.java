package com.hfut.biz.impl;

import com.hfut.biz.TeacherManager;
import com.hfut.dao.FacultyDao;
import com.hfut.dao.TeacherDao;
import com.hfut.entity.FacultyEntity;
import com.hfut.entity.TeacherEntity;
import com.hfut.entity.ZTreeNode;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chenjia on 2017/3/12.
 */
//@Component
//@Transactional
public class TimeManagerImpl implements TeacherManager {
    @Autowired
    private TeacherDao teacherDao;
    @Autowired
    private FacultyDao facultyDao;

    @Override
    public List<List> list(String id) {
        List<TeacherEntity> teacherEntityList=teacherDao.findAll();
        List<FacultyEntity> facultyEntityList = facultyDao.findAll();
        List<List>list=new ArrayList<List>();
        list.add(teacherEntityList);
        list.add(facultyEntityList);
        return list;
    }

    @Override
    public List<ZTreeNode> getManagerTeacherTree(String id) {
        return null;
    }

    @Override
    public boolean save(TeacherEntity teacherEntity) {
        teacherDao.save(teacherEntity);
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        teacherDao.delete(id);
        return true;
    }

    @Override
    public boolean deleteSomeTeacher(String ids) {
        String[] allId=ids.split(",");
        for (String id:allId){
            teacherDao.delete(Integer.valueOf(id));
        }
        return true;
    }
}
