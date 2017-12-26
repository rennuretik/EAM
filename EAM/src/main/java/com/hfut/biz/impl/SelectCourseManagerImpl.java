package com.hfut.biz.impl;

import com.hfut.biz.SelectCourseManager;
import com.hfut.dao.ClazzDao;
import com.hfut.dao.CourseDao;
import com.hfut.dao.MajorDao;
import com.hfut.dao.SelectCourseDao;
import com.hfut.entity.*;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by chenjia on 2017/3/12.
 */
@Component
@Transactional
public class SelectCourseManagerImpl implements SelectCourseManager {
    @Autowired
    private SelectCourseDao selectCourseDao;
    @Autowired
    private MajorDao majorDao;
    @Autowired
    private CourseDao courseDao;
    @Autowired
    private ClazzDao clazzDao;

    //全部选课列表
    @Override
    public List<List> list() {
        List<SelectCourseEntity> selectCourseEntityList = selectCourseDao.findAll();
        for (int size = selectCourseEntityList.size() - 1; size > 0; size--) {
            SelectCourseEntity selectCourseEntity = selectCourseEntityList.get(size);
            SelectCourseEntity selectCourseEntity1 = selectCourseEntityList.get(size - 1);
//            相同专业，年级，课程的选课只要一个
            if (selectCourseEntity.getCourseByCourseId().equals(selectCourseEntity1.getCourseByCourseId()) && selectCourseEntity.getClazzByClassId().getGrade().equals(selectCourseEntity1.getClazzByClassId().getGrade()) && selectCourseEntity.getClazzByClassId().getMajorByMId().equals(selectCourseEntity1.getClazzByClassId().getMajorByMId())) {
                selectCourseEntityList.remove(selectCourseEntity);
            }
        }

        List<CourseEntity> courseEntityList = courseDao.findAll();
        List<List> list = new ArrayList<List>();
        list.add(selectCourseEntityList);
        list.add(courseEntityList);
        return list;
    }

    //点击树节点返回的右侧选课列表
    @Override
    public List<SelectCourseEntity> list(String id) {
        List<SelectCourseEntity> selectCourseEntityList = new ArrayList<>();
//        点击根节点显示所有选课
        if (StringUtils.isEmpty(id)) {
            selectCourseEntityList = selectCourseDao.findAll();
        } else if (!id.split("#")[0].equals("m")) {
//            点击的是专业节点，返回该专业的所有班级的选课情况
//        找到专业
            MajorEntity majorEntity = majorDao.findOne(Integer.valueOf(id));
//        找到班级
            List<ClazzEntity> clazzEntityList = clazzDao.findByMajorByMId(majorEntity);
//        找到选课

            for (ClazzEntity clazzEntity : clazzEntityList) {
                List<SelectCourseEntity> selectCourseEntities = selectCourseDao.findByClazzByClassId(clazzEntity);
                if (selectCourseEntities != null) {
                    selectCourseEntityList.addAll(selectCourseEntities);
                }
            }
        }
//            相同专业，年级，课程的选课只要一个
        for (int size = selectCourseEntityList.size() - 1; size > 0; size--) {
            SelectCourseEntity selectCourseEntity = selectCourseEntityList.get(size);
            for (int i = 0; i < size; i++) {
                SelectCourseEntity selectCourseEntity1 = selectCourseEntityList.get(i);
                if (selectCourseEntity.getCourseByCourseId().equals(selectCourseEntity1.getCourseByCourseId()) && selectCourseEntity.getClazzByClassId().getGrade().equals(selectCourseEntity1.getClazzByClassId().getGrade()) && selectCourseEntity.getClazzByClassId().getMajorByMId().equals(selectCourseEntity1.getClazzByClassId().getMajorByMId())) {
                    selectCourseEntityList.remove(selectCourseEntity);
                }
            }
        }
        return selectCourseEntityList;
    }


    @Override
    public boolean save(SelectCourseEntity selectCourseEntity) {
//        找到专业
        Integer mId = selectCourseEntity.getClazzByClassId().getMajorByMId().getmId();
        Integer grade = selectCourseEntity.getClazzByClassId().getGrade();
        MajorEntity majorEntity = majorDao.findOne(mId);
//        找到该专业与年级的班级
        List<ClazzEntity> clazzEntityList = clazzDao.findByMajorByMIdAndGrade(majorEntity, grade);
//依次存入选课表
        List<SelectCourseEntity> selectCourseEntityList = null;
        for (ClazzEntity clazzEntity : clazzEntityList) {
            if (selectCourseEntityList == null) {
                selectCourseEntityList = new ArrayList<>();
            }
            SelectCourseEntity selectCourseEntity1 = new SelectCourseEntity();
//复制到新的选课selectCourseEntity1
            try {
                BeanUtils.copyProperties(selectCourseEntity1, selectCourseEntity);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }

            selectCourseEntity1.setClazzByClassId(clazzEntity);
            selectCourseEntityList.add(selectCourseEntity1);
        }
        selectCourseDao.save(selectCourseEntityList);
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        SelectCourseEntity selectCourseEntity = selectCourseDao.findOne(id);
        CourseEntity courseEntity = selectCourseEntity.getCourseByCourseId();
        MajorEntity majorEntity = selectCourseEntity.getClazzByClassId().getMajorByMId();
        int grade = selectCourseEntity.getClazzByClassId().getGrade();
        List<ClazzEntity> clazzEntityList = clazzDao.findByMajorByMIdAndGrade(majorEntity, grade);
        for (ClazzEntity clazzEntity : clazzEntityList) {
            SelectCourseEntity selectCourseEntity1 = selectCourseDao.findByClazzByClassIdAndCourseByCourseId(clazzEntity, courseEntity);
            if (selectCourseEntity1 != null) {
                selectCourseDao.delete(selectCourseEntity1);
            }
        }

        return true;
    }

    @Override
    public boolean deleteSomeSelectCourse(String ids) {
        String[] allId = ids.split(",");
        for (String id : allId) {
            delete(Integer.valueOf(id));
        }
        return true;
    }
}
