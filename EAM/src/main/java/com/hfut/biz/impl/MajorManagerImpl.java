package com.hfut.biz.impl;

import com.hfut.biz.MajorManager;
import com.hfut.dao.FacultyDao;
import com.hfut.dao.MajorDao;
import com.hfut.entity.FacultyEntity;
import com.hfut.entity.MajorEntity;
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
public class MajorManagerImpl implements MajorManager {
    @Autowired
    private MajorDao majorDao;
    @Autowired
    private FacultyDao facultyDao;

    @Override
    public List<List> list(String id) {
        List<MajorEntity> majorEntityList;
        if (StringUtils.isEmpty(id)) {
            majorEntityList = majorDao.findAll();
        } else {
            FacultyEntity facultyEntity = facultyDao.findOne(Integer.valueOf(id));
            majorEntityList = majorDao.findByFacultyByFId(facultyEntity);
        }
        List<FacultyEntity> facultyEntityList = facultyDao.findAll();
        List<List> list = new ArrayList<List>();
        list.add(majorEntityList);
        list.add(facultyEntityList);
        return list;
    }

    @Override
    public List<ZTreeNode> getManagerMajorTree(String id) {
        List<FacultyEntity> list = new ArrayList<>();
        List<ZTreeNode> treeNodeList = new ArrayList<>();
        ZTreeNode root = null;

        root = new ZTreeNode();
        root.setName("专业管理");
        root.setId(null);
        list = facultyDao.findAll();

        for (FacultyEntity facultyEntity : list) {
            ZTreeNode zTreeNode = new ZTreeNode();
            zTreeNode.setId(String.valueOf(facultyEntity.getfId()));
            zTreeNode.setName(facultyEntity.getfName());

            zTreeNode.setIsParent(false);
            treeNodeList.add(zTreeNode);
        }

        root.setChildren(treeNodeList);
        List<ZTreeNode> zTreeNodeList = new ArrayList<>();
        zTreeNodeList.add(root);
        return zTreeNodeList;


    }

    @Override
    public boolean save(MajorEntity majorEntity) {
        majorDao.save(majorEntity);
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        majorDao.delete(id);
        return true;
    }

    @Override
    public boolean deleteSomeMajor(String ids) {
        String[] allId = ids.split(",");
        for (String id : allId) {
            majorDao.delete(Integer.valueOf(id));
        }
        return true;
    }
}
