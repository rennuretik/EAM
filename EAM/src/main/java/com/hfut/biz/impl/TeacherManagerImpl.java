package com.hfut.biz.impl;

import com.hfut.biz.TeacherManager;
import com.hfut.dao.FacultyDao;
import com.hfut.dao.TeacherDao;
import com.hfut.entity.FacultyEntity;
import com.hfut.entity.TeacherEntity;
import com.hfut.entity.ZTreeNode;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chenjia on 2017/3/12.
 */
@Component
@Transactional
public class TeacherManagerImpl implements TeacherManager {
    @Autowired
    private TeacherDao teacherDao;
    @Autowired
    private FacultyDao facultyDao;

    @Override
    public List<List> list(String id) {
        List<TeacherEntity> teacherEntityList;
        if (StringUtils.isEmpty(id)) {
            teacherEntityList = teacherDao.findAll();
        }else{
            FacultyEntity facultyEntity=facultyDao.findOne(Integer.valueOf(id));
            teacherEntityList=teacherDao.findByFacultyByFId(facultyEntity);
        }
        List<FacultyEntity> facultyEntityList = facultyDao.findAll();
        List<List>list=new ArrayList<List>();
        list.add(teacherEntityList);
        list.add(facultyEntityList);
        return list;
    }

    @Override
    public List<ZTreeNode> getManagerTeacherTree(String id) {
        List<FacultyEntity> list = new ArrayList<>();
        List<ZTreeNode> treeNodeList = new ArrayList<>();
        ZTreeNode root = null;
        if (StringUtils.isEmpty(id)) {
            root = new ZTreeNode();
            root.setName("教师管理");
            root.setId(null);
            list = facultyDao.findAll();
        }
        for (FacultyEntity facultyEntity : list) {
            ZTreeNode zTreeNode = new ZTreeNode();
            zTreeNode.setId(String.valueOf(facultyEntity.getfId()));
            zTreeNode.setName(facultyEntity.getfName());

            zTreeNode.setIsParent(false);
            treeNodeList.add(zTreeNode);
        }
        if (StringUtils.isEmpty(id)) {
            root.setChildren(treeNodeList);
            List<ZTreeNode> zTreeNodeList = new ArrayList<>();
            zTreeNodeList.add(root);
            return zTreeNodeList;
        }
        return treeNodeList;
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
