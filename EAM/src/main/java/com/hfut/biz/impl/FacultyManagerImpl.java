package com.hfut.biz.impl;

import com.hfut.biz.FacultyManager;
import com.hfut.dao.FacultyDao;
import com.hfut.entity.FacultyEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by chenjia on 2017/3/12.
 */
@Component
@Transactional
public class FacultyManagerImpl implements FacultyManager {

    @Autowired
    private FacultyDao facultyDao;

    @Override
    public List<List> list() {
        List<FacultyEntity> facultyEntityList = facultyDao.findAll();
        List<List>list=new ArrayList<List>();
        list.add(facultyEntityList);
        return list;
    }

    @Override
    public boolean save(FacultyEntity facultyEntity) {
        facultyDao.save(facultyEntity);
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        facultyDao.delete(id);
        return true;
    }

    @Override
    public boolean deleteSomeFaculty(String ids) {
        String[] allId=ids.split(",");
        for (String id:allId){
            facultyDao.delete(Integer.valueOf(id));
        }
        return true;
    }
}
