package com.hfut.biz.impl;

import com.hfut.biz.TeachClassManager;
import com.hfut.dao.*;
import com.hfut.entity.*;
import com.hfut.exception.ArrangeCourseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * created by chenjia on 2017/3/12.
 */
@Component
@Transactional
public class TeachClassManagerImpl implements TeachClassManager {

    @Autowired
    private MajorDao majorDao;
    @Autowired
    private ClazzDao clazzDao;
    @Autowired
    private TeachClassDao teachClassDao;
    @Autowired
    private SelectCourseDao selectCourseDao;
    @Autowired
    private RoomDao roomDao;
    @Autowired
    private CoursePlanDao coursePlanDao;

    @Override
    public List<TeachClassEntity> list() {
        List<TeachClassEntity> teachClassEntityList = teachClassDao.findAll();
        return teachClassEntityList;
    }

    //创建教学班
    @Override
    public List<List> createTeachClass() throws ArrangeCourseException {
        try {
//        先删除先前排好的课程计划和教学班
            coursePlanDao.deleteAll();
            teachClassDao.deleteAll();
//        先分班
            List<List> teachClassEntityList = separateClass();
//      给教学班分教室
            teachClassEntityList = separateRoom(teachClassEntityList);
            return teachClassEntityList;
        } catch (ArrangeCourseException e) {
            throw new ArrangeCourseException(e.getError());
        }
    }

    //    分教室
    private List<List> separateRoom(List<List> teachClassEntityList) throws ArrangeCourseException {
        for (int capacity = 1; capacity <= 3; capacity++) {
//          找到容量为capacity的教学班
            List<TeachClassEntity> teachClassEntities = teachClassEntityList.get(capacity - 1);
            if (teachClassEntities != null) {
//          找到容量为capacity的教室
                List<RoomEntity> roomEntityList = roomDao.findByCapacity(capacity);
                int roomSize = roomEntityList.size();
//                报错信息
                if (roomSize == 0) {
                    String Error = "自动生成教学班出现错误：缺少容量为"+capacity+"个自然班的教室！！！" +
                            "建议解决方法：添加容量为"+capacity+"个自然班的教室";
                    throw new ArrangeCourseException(Error);
                }
                int teachClassSize = teachClassEntities.size();
//                平均分教室
                for (int i = 0; i < teachClassSize; i++) {
                    teachClassEntities.get(i).setRoomByRId(roomEntityList.get(i % roomSize));
                }
            }
        }
//       容量大的放前面便于排课
        List<TeachClassEntity> teachClassEntities = teachClassEntityList.get(0);
        teachClassEntityList.set(0, teachClassEntityList.get(2));
        teachClassEntityList.set(2, teachClassEntities);
        return teachClassEntityList;
    }

    /**
     * 先分班
     *
     * @return
     */
    private List<List> separateClass() {
//       给教学班命名用，如教学id班
        int id = 1;

//                存放分好的教学班
        List<List> teachClassEntityList = new ArrayList<>();
//        存放容量为一个班的教学班
        List<TeachClassEntity> teachClassEntityListOne = new ArrayList<>();
        //        存放容量为两个班的教学班
        List<TeachClassEntity> teachClassEntityListTwo = new ArrayList<>();
        //        存放容量为三个班的教学班
        List<TeachClassEntity> teachClassEntityListThree = new ArrayList<>();
        teachClassEntityList.add(teachClassEntityListOne);
        teachClassEntityList.add(teachClassEntityListTwo);
        teachClassEntityList.add(teachClassEntityListThree);


//        找到所有专业
        List<MajorEntity> majorEntityList = majorDao.findAll();
//        年级大一到大四
        for (int grade = 1; grade <= 4; grade++) {
//            一个年级的所有专业
            for (MajorEntity majorEntity : majorEntityList) {
//                一个年级专业的所有班级
                List<ClazzEntity> clazzEntities = clazzDao.findByMajorByMIdAndGrade(majorEntity, grade);
//                班级的个数
                int clazzSize = clazzEntities.size();
                if (clazzSize != 0) {
//               找到班级的选课
                    List<SelectCourseEntity> selectCourseEntityList = selectCourseDao.findByClazzByClassId(clazzEntities.get(0));
//                判断是否有单班课程
                    if (judgeIsSingle(selectCourseEntityList) || clazzSize == 1) {
//                  有单班课程每个自然班必须分为一个教学班
                        for (ClazzEntity clazzEntity : clazzEntities) {
                            TeachClassEntity teachClassEntity = new TeachClassEntity();
                            teachClassEntity.setClazzByOneId(clazzEntity);
                            teachClassEntity.setRcName("教学" + id + "班");
                            id++;
                            teachClassEntityListOne.add(teachClassEntity);
                        }
                    }

//              如果班级为奇数
                    if (clazzSize % 2 == 1 && clazzSize != 1) {
                        TeachClassEntity teachClassEntity = new TeachClassEntity();
                        teachClassEntity.setClazzByOneId(clazzEntities.get(0));
                        teachClassEntity.setClazzByTwoId(clazzEntities.get(1));
                        teachClassEntity.setClazzByThreeId(clazzEntities.get(2));
                        teachClassEntity.setRcName("教学" + id + "班");
                        id++;
                        teachClassEntityListThree.add(teachClassEntity);
//                    删除排好的三个班
                        for (int j = 0; j < 3; j++) {
                            clazzEntities.remove(clazzEntities.get(0));
                        }
                        clazzSize = clazzSize - 3;
                    }
//                剩下偶数个班级
                    for (int flog = 0; flog < clazzSize; flog = flog + 2) {
                        TeachClassEntity teachClassEntity = new TeachClassEntity();
                        teachClassEntity.setClazzByOneId(clazzEntities.get(flog));
                        teachClassEntity.setClazzByTwoId(clazzEntities.get(flog + 1));
                        teachClassEntity.setRcName("教学" + id + "班");
                        id++;
                        teachClassEntityListTwo.add(teachClassEntity);
                    }

                }
            }
        }
        return teachClassEntityList;
    }

    private boolean judgeIsSingle(List<SelectCourseEntity> selectCourseEntityList) {
        for (SelectCourseEntity selectCourseEntity : selectCourseEntityList) {
            if (selectCourseEntity.getCourseByCourseId().getIsSingle() == 1) {
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean save(TeachClassEntity teachClassEntity) {
        teachClassDao.save(teachClassEntity);
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        teachClassDao.delete(id);
        return true;
    }

    @Override
    public boolean deleteSomeTeachClass(String ids) {
        String[] allId = ids.split(",");
        for (String id : allId) {
            teachClassDao.delete(Integer.valueOf(id));
        }
        return true;
    }
}
