package com.hfut.biz.impl;

import com.hfut.biz.TeachCourseManager;
import com.hfut.dao.CourseDao;
import com.hfut.dao.FacultyDao;
import com.hfut.dao.TeachCourseDao;
import com.hfut.dao.TeacherDao;
import com.hfut.entity.*;
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
public class TeachCourseManagerImpl implements TeachCourseManager {
    @Autowired
    private TeachCourseDao teachCourseDao;
    @Autowired
    private FacultyDao facultyDao;
    @Autowired
    private CourseDao courseDao;
    @Autowired
    private TeacherDao teacherDao;

    @Override
    public List<List> list() {
        List<TeachCourseEntity> teachCourseEntityList = teachCourseDao.findAll();
        List<CourseEntity> courseEntityList = courseDao.findAll();
        List<List> list = new ArrayList<List>();
        list.add(teachCourseEntityList);
        list.add(courseEntityList);
        return list;
    }

    @Override
    public List<TeachCourseEntity> list(String id) {
        List<TeachCourseEntity> teachCourseEntityList = new ArrayList<>();
//        点击不同层次的节点出现不同的授课表
//        点击的是根节点,显示所有授课表
        if (StringUtils.isEmpty(id)) {
            teachCourseEntityList = teachCourseDao.findAll();
        } else {
//            如果点击的是二级系节点，显示一个系的老师的授课表
            String[] ids = id.split("#");
            if (ids[0].equals("f")) {
//                先找到系
                FacultyEntity facultyEntity = facultyDao.findOne(Integer.valueOf(ids[1]));
//                在找到老师
                List<TeacherEntity> teacherEntityList = teacherDao.findByFacultyByFId(facultyEntity);
//                最后找到授课表
                for (TeacherEntity teacherEntity : teacherEntityList) {
                    List<TeachCourseEntity> teachCourseEntities = new ArrayList<>();
                    teachCourseEntities = teachCourseDao.findByTeacherByTId(teacherEntity);
                    if (teachCourseEntities != null) {
                        teachCourseEntityList.addAll(teachCourseEntities);
                    }
                }
            } else {
//                点击的是三级教师节点，直接出现该教师授课表
                TeacherEntity teacherEntity = teacherDao.findOne(Integer.valueOf(id));
                teachCourseEntityList = teachCourseDao.findByTeacherByTId(teacherEntity);
            }
        }
        return teachCourseEntityList;
    }

    @Override
    public List<ZTreeNode> showTeacherTree(String id) {
        List<FacultyEntity> facultyEntityList = new ArrayList<FacultyEntity>();
        List<TeacherEntity> teacherEntityArrayList = new ArrayList<>();
        List<ZTreeNode> treeNodeList = new ArrayList<>();
        ZTreeNode root = null;

//        点击头结点展开专业
        if (StringUtils.isEmpty(id)) {
//            头结点
            root = new ZTreeNode();
            root.setName("老师选课管理");
            root.setId(null);
//            二级系业节点
            facultyEntityList = facultyDao.findAll();
//            facultyEntityList转化为treeNodeList
            for (FacultyEntity facultyEntity : facultyEntityList) {
                ZTreeNode zTreeNode = new ZTreeNode();
                zTreeNode.setId("f#" + String.valueOf(facultyEntity.getfId()));
                zTreeNode.setName(facultyEntity.getfName());
                treeNodeList.add(zTreeNode);
            }
            root.setChildren(treeNodeList);
            List<ZTreeNode> zTreeNodeList = new ArrayList<>();
            zTreeNodeList.add(root);
            return zTreeNodeList;
        }
//        点击系节点（即二级结点）展开老师结点
        else {
//        将id分开以做判断
            String[] ids = id.split("#");
//         先找到点击的系
            FacultyEntity facultyEntity = facultyDao.findOne(Integer.valueOf(ids[1]));
//           在找到属于该系的老师
            teacherEntityArrayList = teacherDao.findByFacultyByFId(facultyEntity);
//            转化
            for (TeacherEntity teacherEntity : teacherEntityArrayList) {
                ZTreeNode zTreeNode = new ZTreeNode();
                zTreeNode.setId(String.valueOf(teacherEntity.gettId()));
                zTreeNode.setName(teacherEntity.gettName());
                zTreeNode.setIsParent(false);
                treeNodeList.add(zTreeNode);
            }
            return treeNodeList;
        }
    }


    @Override
    public boolean save(TeachCourseEntity teachCourseEntity) {
        Integer tId = teachCourseEntity.getTeacherByTId().gettId();
//        找到点击的老师
        TeacherEntity teacherEntity = teacherDao.findOne(tId);
//        赋值保存
        teachCourseEntity.setTeacherByTId(teacherEntity);
        teachCourseDao.save(teachCourseEntity);
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        teachCourseDao.delete(id);
        return true;
    }

    @Override
    public boolean deleteSomeTeachCourse(String ids) {
        String[] allId = ids.split(",");
        for (String id : allId) {
            teachCourseDao.delete(Integer.valueOf(id));
        }
        return true;
    }
}
