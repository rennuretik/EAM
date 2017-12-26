package com.hfut.biz.impl;

import com.hfut.biz.ClazzManager;
import com.hfut.dao.ClazzDao;
import com.hfut.dao.FacultyDao;
import com.hfut.dao.MajorDao;
import com.hfut.entity.ClazzEntity;
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
public class ClazzManagerImpl implements ClazzManager {
    @Autowired
    private ClazzDao clazzDao;
    @Autowired
    private MajorDao majorDao;
    @Autowired
    private FacultyDao facultyDao;

    @Override
    public List<List> list(String id) {
        List<List> list = new ArrayList<List>();
        //        将id分开以做判断
//点击的是更节点或叶子节点
        if (StringUtils.isEmpty(id) || (StringUtils.isNotEmpty(id) && !(id.split("#")[0]).equals("m"))) {
            List<ClazzEntity> clazzEntityList;
            if (StringUtils.isEmpty(id)) {
                clazzEntityList = clazzDao.findAll();
            } else {
                MajorEntity majorEntity = majorDao.findOne(Integer.valueOf(id));
                clazzEntityList = clazzDao.findByMajorByMId(majorEntity);
            }
            List<MajorEntity> majorEntityList = majorDao.findAll();
            list.add(clazzEntityList);
            list.add(majorEntityList);
        } else {
            //点击的是二级系节点显示该系的班级
            id = id.split("#")[1];
//            查找该系
            FacultyEntity facultyEntity = facultyDao.findOne(Integer.valueOf(id));
//            查找该系的专业
            List<MajorEntity> majorEntityList = majorDao.findByFacultyByFId(facultyEntity);
//            存放查到的班级
            List<ClazzEntity >clazzEntityList=new ArrayList<>();
//            根据专业查找该系的班级
            for (MajorEntity majorEntity : majorEntityList) {
                List<ClazzEntity> clazzEntities = clazzDao.findByMajorByMId(majorEntity);
                clazzEntityList.addAll(clazzEntities);
            }
//            最后返回结果
            list.add(clazzEntityList);
        }
        return list;
    }

    @Override
    public List<ZTreeNode> getManagerMajorTree(String id) {
        List<FacultyEntity> facultyEntityList = new ArrayList<FacultyEntity>();
        List<MajorEntity> majorEntityArrayList = new ArrayList<>();
        List<ZTreeNode> treeNodeList = new ArrayList<>();
        ZTreeNode root = null;

//        点击头结点展开专业
        if (StringUtils.isEmpty(id)) {
//            头结点
            root = new ZTreeNode();
            root.setName("班级管理");
            root.setId(null);
            facultyEntityList = facultyDao.findAll();
//            facultyEntityList转化为treeNodeList
            for (FacultyEntity facultyEntity : facultyEntityList) {
                ZTreeNode zTreeNode = new ZTreeNode();
                zTreeNode.setId("m#" + String.valueOf(facultyEntity.getfId()));
                zTreeNode.setName(facultyEntity.getfName());
                treeNodeList.add(zTreeNode);
            }
            root.setChildren(treeNodeList);
            List<ZTreeNode> zTreeNodeList = new ArrayList<>();
            zTreeNodeList.add(root);
            return zTreeNodeList;
        }
//        点击系节点（即二级结点）展开专业结点
        else {
//        将id分开以做判断
            String[] ids = id.split("#");
//         先找到点击的系
            FacultyEntity facultyEntity = facultyDao.findOne(Integer.valueOf(ids[1]));
//           在找到属于该系的专业
            majorEntityArrayList = majorDao.findByFacultyByFId(facultyEntity);
//            转化
            for (MajorEntity majorEntity : majorEntityArrayList) {
                ZTreeNode zTreeNode = new ZTreeNode();
                zTreeNode.setId(String.valueOf(majorEntity.getmId()));
                zTreeNode.setName(majorEntity.getmName());
                zTreeNode.setIsParent(false);
                treeNodeList.add(zTreeNode);
            }
            return treeNodeList;
        }
    }


    @Override
    public boolean save(ClazzEntity clazzEntity) {
        clazzDao.save(clazzEntity);
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        clazzDao.delete(id);
        return true;
    }

    @Override
    public boolean deleteSomeClazz(String ids) {
        String[] allId = ids.split(",");
        for (String id : allId) {
            clazzDao.delete(Integer.valueOf(id));
        }
        return true;
    }
}
