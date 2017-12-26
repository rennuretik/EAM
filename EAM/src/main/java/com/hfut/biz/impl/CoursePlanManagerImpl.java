package com.hfut.biz.impl;

import com.hfut.biz.CoursePlanManager;
import com.hfut.biz.TeachClassManager;
import com.hfut.controller.AbstractBaseController;
import com.hfut.dao.*;
import com.hfut.entity.*;
import com.hfut.exception.ArrangeCourseException;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by chenjia on 2017/3/12.
 */
@Component
@Transactional
public class CoursePlanManagerImpl implements CoursePlanManager {
    @Autowired
    private FacultyDao facultyDao;
    @Autowired
    private TeacherDao teacherDao;
    @Autowired
    private MajorDao majorDao;
    @Autowired
    private ClazzDao clazzDao;
    @Autowired
    private TimeDao timeDao;
    @Autowired
    private RoomDao roomDao;
    @Autowired
    private TeachClassManager teachClassManager;
    @Autowired
    private SelectCourseDao selectCourseDao;
    @Autowired
    private TeachCourseDao teachCourseDao;
    @Autowired
    private CourseDao courseDao;
    @Autowired
    private CoursePlanDao coursePlanDao;
    @Autowired
    private TeachClassDao teachClassDao;


    /**
     * 根据自然班找到其所有的教学计划
     * 自然班id @param id
     *
     * @return
     */
    @Override
    public String[] coursePlanByClass(String id) {
//找到所点击的班级
        ClazzEntity clazzEntity = clazzDao.findOne(Integer.valueOf(id));
/*找到有该班级存在的教学班  */
//        存放有该班级存在的教学班
        List<TeachClassEntity> teachClassEntityList = new ArrayList<>();
        teachClassEntityList.addAll(teachClassDao.findByClazzByOneId(clazzEntity));
        teachClassEntityList.addAll(teachClassDao.findByClazzByTwoId(clazzEntity));
        teachClassEntityList.addAll(teachClassDao.findByClazzByThreeId(clazzEntity));
/*找到有该教学班的教学计划*/
        List<CourseplanEntity> courseplanEntityList = new ArrayList<>();
        for (TeachClassEntity teachClassEntity : teachClassEntityList) {
            courseplanEntityList.addAll(coursePlanDao.findByTeachClassByRcId(teachClassEntity));
        }
        return coursePlanToString(courseplanEntityList, false);
    }

    @Override
    public List<ZTreeNode> showClassTree(String id) {
        List<ZTreeNode> treeNodeList = new ArrayList<>();
        ZTreeNode root = null;
//        点击头结点展开系
        if (StringUtils.isEmpty(id)) {
//            头结点
            root = new ZTreeNode();
            root.setName("班级分类");
            root.setId(null);
            List<FacultyEntity> facultyEntityList = facultyDao.findAll();
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
//        点击系节点（即二级结点）展开专业结点
        else {
//        将id分开以做判断
            String[] ids = id.split("#");
            if (ids[0].equals("f")) {
//         先找到点击的系
                FacultyEntity facultyEntity = facultyDao.findOne(Integer.valueOf(ids[1]));
//           在找到属于该系的专业
                List<MajorEntity> majorEntityArrayList = majorDao.findByFacultyByFId(facultyEntity);
//            转化
                for (MajorEntity majorEntity : majorEntityArrayList) {
                    ZTreeNode zTreeNode = new ZTreeNode();
                    zTreeNode.setId("m#" + String.valueOf(majorEntity.getmId()));
                    zTreeNode.setName(majorEntity.getmName());
                    treeNodeList.add(zTreeNode);
                }
            } else if (ids[0].equals("m")) {
//            找到点击的专业
                MajorEntity majorEntity = majorDao.findOne(Integer.valueOf(ids[1]));
//             找到属于该专业的班级
                List<ClazzEntity> clazzEntityList = clazzDao.findByMajorByMId(majorEntity);
//                转化
                for (ClazzEntity clazzEntity : clazzEntityList) {
                    ZTreeNode zTreeNode = new ZTreeNode();
                    zTreeNode.setId(String.valueOf(clazzEntity.getClassId()));
                    zTreeNode.setName(clazzEntity.getClassName());
                    zTreeNode.setIsParent(false);
                    treeNodeList.add(zTreeNode);
                }
            }
            return treeNodeList;

        }
    }

    @Override
    public String[] coursePlanByTeacher(String id) {
        TeacherEntity teacherEntity = teacherDao.findOne(Integer.valueOf(id));
        List<CourseplanEntity> courseplanEntities = coursePlanDao.findByTeacherByTIdOrderByStartWeek(teacherEntity);

        return coursePlanToString(courseplanEntities, true);
    }

    @Override
    public List<ZTreeNode> showTeacherTree(String id) {
        List<ZTreeNode> treeNodeList = new ArrayList<>();
        ZTreeNode root = null;
//        点击头结点展开系
        if (StringUtils.isEmpty(id)) {
//            头结点
            root = new ZTreeNode();
            root.setName("教师分类");
            root.setId(null);
            List<FacultyEntity> facultyEntityList = facultyDao.findAll();
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
//        点击系节点（即二级结点）展开教师结点
        else {
//        将id分开以做判断
            String[] ids = id.split("#");
//         先找到点击的系
            FacultyEntity facultyEntity = facultyDao.findOne(Integer.valueOf(ids[1]));
//           再找到属于该系的老师
            List<TeacherEntity> teacherEntityList = teacherDao.findByFacultyByFId(facultyEntity);
//            转化
            for (TeacherEntity teacherEntity : teacherEntityList) {
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
    public String[] coursePlanByRoom(String id) {
        //找到所点击的教室
        RoomEntity roomEntity = roomDao.findOne(Integer.valueOf(id));
/*找到有该教室存在的教学班  */
//        存放有该班级存在的教学班
        List<TeachClassEntity> teachClassEntityList = teachClassDao.findByRoomByRId(roomEntity);
/*找到有该教学班的教学计划*/
        List<CourseplanEntity> courseplanEntityList = new ArrayList<>();
        for (TeachClassEntity teachClassEntity : teachClassEntityList) {
            courseplanEntityList.addAll(coursePlanDao.findByTeachClassByRcId(teachClassEntity));
        }
        return coursePlanToString(courseplanEntityList, false);
    }

    @Override
    public List<ZTreeNode> showRoomTree(String id) {
        List<ZTreeNode> treeNodeList = new ArrayList<>();
        ZTreeNode root = null;
//        点击头结点展开系
        if (StringUtils.isEmpty(id)) {
//            头结点
            root = new ZTreeNode();
            root.setName("教室分类");
            root.setId(null);
            List<RoomEntity> roomEntityList = roomDao.findAll();
//            facultyEntityList转化为treeNodeList
            for (RoomEntity roomEntity : roomEntityList) {
                ZTreeNode zTreeNode = new ZTreeNode();
                zTreeNode.setId(String.valueOf(roomEntity.getrId()));
                zTreeNode.setName(roomEntity.getrName());
                zTreeNode.setIsParent(false);
                treeNodeList.add(zTreeNode);
            }
            root.setChildren(treeNodeList);
            List<ZTreeNode> zTreeNodeList = new ArrayList<>();
            zTreeNodeList.add(root);
            return zTreeNodeList;
        }
        return treeNodeList;
    }

    /**
     * 将教学计划转化为便于显示的string数组，分别对应星期一至星期五的4节课
     * 是否是通过老师调用的@param isByTeacher
     *
     * @param courseplanEntityList
     * @return
     */

    private String[] coursePlanToString(List<CourseplanEntity> courseplanEntityList, boolean isByTeacher) {
        //        用于存放每节具体的显示
        String[] week = new String[20];
        for (int i = 0; i < week.length; i++) {
            week[i] = "";
        }
        String courseName;
        String rcName;
        int startTime;
        int overTime;
        String rName;
        String tName;
        int timeId;
/*教学计划依次转化*/
        for (CourseplanEntity courseplanEntity : courseplanEntityList) {
            //课程名
            courseName = courseplanEntity.getCourseByCourseId().getCourseName();
            //教学班名
            rcName = courseplanEntity.getTeachClassByRcId().getRcName();
            //开始和结束时间(周)
            startTime = courseplanEntity.getStartWeek();
            overTime = courseplanEntity.getOverWeek();
            //教室
            rName = courseplanEntity.getTeachClassByRcId().getRoomByRId().getrName();
            //教师
            tName = courseplanEntity.getTeacherByTId().gettName();
//            具体时间的id
            timeId = courseplanEntity.getTimeByTimeId().getTimeId();
            if (week[timeId - 1].equals("")) {
                week[timeId - 1] = "<strong>" + courseName + "</strong>" + " " + rcName + "</br>(" + startTime + "-" + overTime + "周)" + rName + "</br>" + tName;
            } else {
//                通过老师调用的不用合并
                if (!isByTeacher) {
             /*该教学班中一门由多个教师上的课的教学计划要合并，便于显示*/
//                找到教学班，课程，具体时间都相同而老师不同的教学计划
                    List<CourseplanEntity> courseplanEntities = coursePlanDao.findByTeachClassByRcIdAndCourseByCourseIdAndTimeByTimeId(courseplanEntity.getTeachClassByRcId(), courseplanEntity.getCourseByCourseId(), courseplanEntity.getTimeByTimeId());
                    if (courseplanEntities.size() > 1) {
                        for (CourseplanEntity courseplanEntity1 : courseplanEntities) {
                            if (!courseplanEntity1.equals(courseplanEntity)) {
//                        开始时间以最小，结束时间以最大的为准
                                if (courseplanEntity1.getStartWeek() < startTime) {
                                    startTime = courseplanEntity1.getStartWeek();
                                }
                                if (courseplanEntity1.getOverWeek() > overTime) {
                                    overTime = courseplanEntity1.getOverWeek();
                                }
                                tName = tName + "," + courseplanEntity1.getTeacherByTId().gettName();
                            }
                        }
                        week[timeId - 1] = "<strong>" + courseName + "</strong>" + " " + rcName + "</br>(" + startTime + "-" + overTime + "周)" + rName + "</br>" + tName;
                    } else {
//                    多门课程在同一节上，但周不同
                        week[timeId - 1] = week[timeId - 1] + "</br>" + "<strong>" + courseName + "</strong>" + " " + rcName + "</br>(" + startTime + "-" + overTime + "周)" + rName + "</br>" + tName;
                    }
                } else {
//                    多门课程在同一节上，但周不同
                    week[timeId - 1] = week[timeId - 1] + "</br>" + "<strong>" + courseName + "</strong>" + " " + rcName + "</br>(" + startTime + "-" + overTime + "周)" + rName + "</br>" + tName;

                }
            }
        }

        return week;
    }


    @Override
    public void clear() {
        //     删除先前排好的课程计划和教学班
        coursePlanDao.deleteAll();
        teachClassDao.deleteAll();
    }


    /**
     * 生成完整的教学计划
     *
     * @return
     */
    @Override
    public List<CourseplanEntity> creat() throws ArrangeCourseException {
        try {
/*创建教学班*/
            List<List> teachClassEntityList = teachClassManager.createTeachClass();
/*        先分课*/
            List<CourseplanEntity> courseplanEntityList = separateCourse(teachClassEntityList);
 /*再给老师教授的课分工作量*/
            separateWorkLoad(courseplanEntityList);
/*  接着根据授课表分老师，分周数*/
            List<List> courseplanEntityListTwo = separateTeacher(courseplanEntityList);
/* 最后分具体的上课时间，完毕*/
            courseplanEntityList = separateTime(courseplanEntityListTwo);
/*存入教学班和教学计划*/
            List<TeachClassEntity> teachClassEntities = new ArrayList<>();
            for (List<TeachClassEntity> teachClassEntityList1 : teachClassEntityList) {
                teachClassEntities.addAll(teachClassEntityList1);
            }
            teachClassDao.save(teachClassEntities);
            coursePlanDao.save(courseplanEntityList);
            return courseplanEntityList;
        } catch (ArrangeCourseException e) {
            throw new ArrangeCourseException(e.getError());
        }
    }

    /**
     * 分具体时间（星期和节）
     * 第二阶段的教学计划 @param courseplanEntityListTwo
     *
     * @return
     */
    private List<CourseplanEntity> separateTime(List<List> courseplanEntityListTwo) throws ArrangeCourseException {
//        用于存放完整的教学计划
        List<CourseplanEntity> courseplanEntityList = new ArrayList<>();
//        周一到周五的具体时间
        List<TimeEntity> timeEntityList = timeDao.findAll();
//     如果第一节课排在星期一，第二节课排在星期三或五的标志（false为排在星期三，针对一周上两次的课的派法）
        boolean flog = false;
        for (List<CourseplanEntity> courseplanEntities : courseplanEntityListTwo) {
            CourseplanEntity courseplanEntity = courseplanEntities.get(0);
//            该课一周上几次
            int quarterOfCourse = courseplanEntity.getCourseByCourseId().getQuarater();
//          初始化开始与结束的星期
            int startWeek = 0;
            int overWeek;
//                如果该课一周有一节，则每个工作日都有可能
            if (quarterOfCourse == 1) {
                overWeek = 4;
            }
//                如果该课一周有两节，第一节必在周一或周二或周三
            else if (quarterOfCourse == 2) {
                overWeek = 2;
            }
//                如果该课一周有三节，第一节必在周一或周二
            else {
                overWeek = 1;
            }
//                循环quarterOfCourse次，以创建循环quarterOfCourse个教学计划对象
            for (int time = 1; time <= quarterOfCourse; time++) {
//                    第二节课的排法
//                    已经创建的标志
                boolean isCread = false;
//                一门课的第一节只循环到星期三的第四节，节放前面是为了让每天的课程数更加平均
//                    节
                for (int quarter = 0; quarter < 4; quarter++) {
//                        星期
                    for (int week = startWeek; week <= overWeek; week++) {
//                            取出对应的时间
                        TimeEntity timeEntity = timeEntityList.get(4 * week + quarter);
//                            如果该时间不冲突
                        if (!isConflict(timeEntity, courseplanEntities, courseplanEntityList)) {
                            //       由于一个教学班的一门课可能会被多个老师上，且这门课只能在一个特定的时间
//      （比如小明上一到五周，小芳上六到八周，且都是星期一的第一节，不能分开，即小芳不能排到星期二的第一节）
                            for (CourseplanEntity courseplanEntity2 : courseplanEntities) {
                                try {
//                                  准备创建一个新的教学计划
                                    CourseplanEntity courseplanEntity1 = new CourseplanEntity();
                                    BeanUtils.copyProperties(courseplanEntity1, courseplanEntity2);
                                    courseplanEntity1.setTimeByTimeId(timeEntity);
                                    courseplanEntityList.add(courseplanEntity1);
                                } catch (IllegalAccessException e) {
                                    e.printStackTrace();
                                } catch (InvocationTargetException e) {
                                    e.printStackTrace();
                                }
                            }
                            isCread = true;
//                                    针对一周上两次的课的第二节课的派法
                            if (quarterOfCourse == 2) {
                                if (week == 0) {
                                    if (flog) {
                                        startWeek = 4;
                                        overWeek = 4;
                                        flog = !flog;
                                    } else {
//                                    如果是第一节课在星期一第二节课就排到星期三或者星期五（循环排）
                                        startWeek = 2;
                                        overWeek = 2;
                                        flog = !flog;
                                    }
                                } else {
//                                      除了上个特殊情况，第二节课就跳一天排
                                    startWeek = week + 2;
                                    overWeek = week + 2;
                                }
                            }
//                                    针对一周上三次的课的第二，三节课的派法
                            else if (quarterOfCourse == 3) {
//                                    第一节在week（week为星期一或星期二），第二节必在week+1到星期四之间
                                if (time == 2) {
                                    startWeek = week + 1;
                                    overWeek = 3;
                                } else if (time == 3) {
//                                     第二节在week，第三节必在week+1到星期五之间
                                    startWeek = week + 1;
                                    overWeek = 4;
                                }
                            }
                            break;
                        }
//                      如果overWeek的第四节也冲突，报错
                        else if (timeEntity.getTimeId() == 4 * (overWeek + 1)) {
                            String Error = courseplanEntity.getCourseByCourseId().getCourseName() + " "
                                    + courseplanEntity.getTeachClassByRcId().getRcName() + "\\n"
                                    + courseplanEntity.getStartWeek() + "-" + courseplanEntity.getOverWeek() + "周"
                                    + courseplanEntity.getTeachClassByRcId().getRoomByRId().getrName() + "\\n"
                                    + courseplanEntity.getTeacherByTId().gettName() + "\\n"
                                    + "安排具体时间时因为"+AbstractBaseController.Error+"冲突而出错!!!" +
                                    "建议解决方法:\\n"
                                    +"1.尝试改变选有" + courseplanEntity.getTeachClassByRcId().getRcName() +"的课程的老师的教学时间"+"\\n"
                                    +"2.尝试增加容量为"+courseplanEntity.getTeachClassByRcId().getRoomByRId().getCapacity()+"个班的教室"+"\\n";
                            throw new ArrangeCourseException(Error);
                        }
                    }
//                    已排好就跳出准备排下一节课
                    if (isCread) {
                        break;
                    }
                }
                if (!isCread) {
//                        报错
                }
            }
        }
        return courseplanEntityList;

    }
    /**
     * 判断该具体时间是否可以分配给第二阶段的教学计划
     * 思想：教室，老师，自然班这三个临界资源不能同时出现
     * 需要判断的具体时间 @param timeEntity
     * 需要判断的相同教学班相同课程的第二阶段的教学计划@param courseplanEntities
     * 所有排好的完整阶段的教学计划 @param courseplanEntityList
     *
     * @return
     */
    private boolean isConflict(TimeEntity timeEntity, List<CourseplanEntity> courseplanEntities, List<CourseplanEntity> courseplanEntityList) {
//       取出教学班（取第一个教学计划的教学班，因为都一样）
        TeachClassEntity teachClassEntity = courseplanEntities.get(0).getTeachClassByRcId();
//        需要判断的教室
        RoomEntity roomEntity = teachClassEntity.getRoomByRId();
//        需要判断的自然班
        List<ClazzEntity> clazzEntityList = new ArrayList<>();
        clazzEntityList.add(teachClassEntity.getClazzByOneId());
        if (teachClassEntity.getClazzByTwoId() != null) {
            clazzEntityList.add(teachClassEntity.getClazzByTwoId());
        }
        if (teachClassEntity.getClazzByThreeId() != null) {
            clazzEntityList.add(teachClassEntity.getClazzByThreeId());
        }
        /*相同教学班相同课程不同老师的教学计划可能有多个，依次进行判断*/
        for (CourseplanEntity courseplanEntity : courseplanEntities) {
            int startWeek = courseplanEntity.getStartWeek();
            int overWeek = courseplanEntity.getOverWeek();
//            需要判断的老师
            TeacherEntity teacherEntity = courseplanEntity.getTeacherByTId();
            /*正式开始判断*/
            for (CourseplanEntity courseplanEntity1 : courseplanEntityList) {
//                先判断改教学计划是否有需要判断的临界资源
                if (isHave(teacherEntity, clazzEntityList, roomEntity, courseplanEntity1)) {

                    int courseStartWeek = courseplanEntity1.getStartWeek();
                    int courseOverWeek = courseplanEntity1.getOverWeek();
//                  有交错周
                    if (!(startWeek > courseOverWeek || overWeek < courseStartWeek)) {
//                           具体时间也相等可以判断该具体时间冲突，不能排
                        if (courseplanEntity1.getTimeByTimeId().equals(timeEntity)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * 判断教学计划是否有老师，自然班，教室这三个临界资源
     *
     * @param teacherEntity
     * @param clazzEntityList
     * @param roomEntity
     * @param courseplanEntity
     * @return
     */
    private boolean isHave(TeacherEntity teacherEntity, List<ClazzEntity> clazzEntityList, RoomEntity roomEntity, CourseplanEntity courseplanEntity) {
        TeachClassEntity teachClassEntity = courseplanEntity.getTeachClassByRcId();
        if (courseplanEntity.getTeacherByTId().equals(teacherEntity)) {
//            便于输出排错信息,静态变量，位置写的不是太好，欢迎修改
            AbstractBaseController.Error = teacherEntity.gettName();
            return true;
        } else if (teachClassEntity.getRoomByRId().equals(roomEntity)) {
            AbstractBaseController.Error = roomEntity.getrName();
            return true;
        }
        for (ClazzEntity clazzEntity : clazzEntityList) {
            if (clazzEntity.equals(teachClassEntity.getClazzByOneId()) || clazzEntity.equals(teachClassEntity.getClazzByTwoId()) || clazzEntity.equals(teachClassEntity.getClazzByThreeId())) {
                AbstractBaseController.Error = clazzEntity.getClassName();
                return true;
            }
        }
        return false;
    }

    /**
     * 分老师，分周，生成第二阶段的教学计划（由教学班，课程，老师，开始结束周决定）
     *
     * @param courseplanEntityListOne
     * @return
     */
    private List<List> separateTeacher(List<CourseplanEntity> courseplanEntityListOne) throws ArrangeCourseException {
//        用于存放第二阶段教学计划(其教学班和课程相同，老师不同)
        List<List> courseplanEntities = new ArrayList<>();
//        依次取出第一阶段的教学计划
        for (CourseplanEntity courseplanEntity : courseplanEntityListOne) {
//        用于存放由一个第一阶段教学计划扩充的的可能多个的第二阶段教学计划（不成熟的，还要扩充的）
            List<CourseplanEntity> courseplanEntityList = new ArrayList<>();
//            找到课程
            CourseEntity courseEntity = courseplanEntity.getCourseByCourseId();
//            得到该课程课时
            int courseWeek = courseEntity.getWeek();
//            老师上课时间(周)
            int teacherStart;
            int teacherOver;
//            老师工作量
            int workLoad;
//            单个课程没分配完时的的开始周
            int flogWeek = 0;
//            通过课程找到该课程以开始时间排序的授课表,
            List<TeachCourseEntity> teachCourseEntityList = teachCourseDao.findByCourseByCourseIdOrderByStartWeek(courseEntity);
//           所有老师的名字 便于报错
            String teachers = null;
/*分配老师和其开始结束时间，得到第二阶段教学计划*/
//            递归算法，也可以将下面写出一个递归函数体,其中的冗余代码也可以改进
            for (TeachCourseEntity teachCourseEntity : teachCourseEntityList) {
//           记录该课所有老师的名字 便于报错
                if (StringUtils.isEmpty(teachers)) {
                    teachers = teachCourseEntity.getTeacherByTId().gettName();
                } else {
                    teachers = teachers + "、" + teachCourseEntity.getTeacherByTId().gettName();
                }
//                老师上课时间(周)
                if (flogWeek == 0) {
//                    如果排完开始周从本个老师的开始周开始
                    teacherStart = teachCourseEntity.getStartWeek();
                } else {
//                   如果没排完且是因为teacherWeek不够则从上个老师的结束周的下一周开始              
//                   或者如果没排完且是因为老师工作量workLoad不够则从上个老师的开始周加上没排前的剩余工作量
//                   即返回过来的时间开始
                    teacherStart = flogWeek;
                }
                teacherOver = teachCourseEntity.getOverWeek();
//                老师工作量（周）
                workLoad = teachCourseEntity.getWorkLoad();
//               老师教一个教学班的最多周数
                int teacherWeek = teacherOver - teacherStart + 1;
//存放三个比较元素teacherWeek && courseWeek && workLoad
//                courseWeek必须放在最前面，为了相等时它在前面
                int[] compare = {courseWeek, teacherWeek, workLoad};
//                从小到大排序
                Arrays.sort(compare);
//                该老师如果工作量没完成
                if (workLoad > 0) {
//                    选中的该课老师（从第一个开始选）的teacherWeek比课程时间多或相等,并且该老师工作量大于或等于课程时间时,只分配一个老师就可以了
//                    即courseWeek最小
//                    递归的出口
                    if (compare[0] == courseWeek) {
                        CourseplanEntity courseplanEntity1 = new CourseplanEntity();
                        try {
                            BeanUtils.copyProperties(courseplanEntity1, courseplanEntity);
//                        分配老师
                            courseplanEntity1.setTeacherByTId(teachCourseEntity.getTeacherByTId());
//                        分配开始结束周
                            courseplanEntity1.setStartWeek(teacherStart);
                            courseplanEntity1.setOverWeek(teacherStart + courseWeek - 1);
//                        动态更改该老师剩余工作量
                            workLoad -= courseWeek;
                            teachCourseEntity.setWorkLoad(workLoad);
//                            teachCourseDao.save(teachCourseEntity);
//                            存入第二阶段教学计划（以老师，开始结束时间，课程，教学班共同决定）
                            courseplanEntityList.add(courseplanEntity1);
//                            跳出循环
                            break;
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        } catch (InvocationTargetException e) {
                            e.printStackTrace();
                        }
                    }
//                    下面两个if是递归的条件
//                    如果是老师教一个教学班的最多周数不够，需要分配两个或以上老师
                    else if (compare[0] == teacherWeek) {
//                        先排一部分
                        CourseplanEntity courseplanEntity1 = new CourseplanEntity();
                        try {
                            BeanUtils.copyProperties(courseplanEntity1, courseplanEntity);
//                        分配老师
                            courseplanEntity1.setTeacherByTId(teachCourseEntity.getTeacherByTId());
//                        分配开始结束周
                            courseplanEntity1.setStartWeek(teacherStart);
                            courseplanEntity1.setOverWeek(teacherOver);
//                        动态更改该老师剩余工作量
                            workLoad -= teacherWeek;
                            teachCourseEntity.setWorkLoad(workLoad);
//                            更改课程课时
                            courseWeek -= teacherWeek;
//                            如果遍历了该课程的所有授课表但还是没有排完课程，报错
                            if (teachCourseEntity.equals(teachCourseEntityList.get(teachCourseEntityList.size() - 1)) && courseWeek > 0) {
                                String Error = "为教学班分老师时出错:教授" + courseEntity.getCourseName() + "的老师时间不够！ " +
                                        "建议解决方法:  " +
                                        "1.延长该课老师" + teachers + "的教学时间  " +
                                        "2.新增该课老师";
                                throw new ArrangeCourseException(Error);
                            }
//                           更改下次开始周
                            flogWeek = teacherOver + 1;
//                            存入第二阶段教学计划（以老师，开始结束时间，课程，教学班共同决定）
                            courseplanEntityList.add(courseplanEntity1);
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        } catch (InvocationTargetException e) {
                            e.printStackTrace();
                        }
                    }
                    /*如果是老师的工作量不够，需要分配两个或以上老师*/
                    else if (compare[0] == workLoad) {
//                        先排一部分
                        CourseplanEntity courseplanEntity1 = new CourseplanEntity();
                        try {
                            BeanUtils.copyProperties(courseplanEntity1, courseplanEntity);
//                        分配老师
                            courseplanEntity1.setTeacherByTId(teachCourseEntity.getTeacherByTId());
//                        分配开始结束周
                            courseplanEntity1.setStartWeek(teacherStart);
                            courseplanEntity1.setOverWeek(teacherStart + workLoad - 1);
//                           更改下次开始周
                            flogWeek = teacherStart + workLoad;
//                            更改课程课时
                            courseWeek -= workLoad;
//                        动态更改该老师剩余工作量
                            workLoad -= workLoad;
//                            如果遍历了该课程的所有授课表但还是没有排完课程，报错
                            if (teachCourseEntity.equals(teachCourseEntityList.get(teachCourseEntityList.size() - 1)) && courseWeek > 0) {
                                String Error = "为教学班分老师时出错:教授" + courseEntity.getCourseName() + "的老师时间不够或太过集中！  " +
                                        "建议解决方法:" +
                                        "1.将该课老师的教学周错开  " +
                                        "2.延长该课老师" + teachers + "的教学时间  " +
                                        "3.新增该课老师";
                                throw new ArrangeCourseException(Error);
                            }
                            teachCourseEntity.setWorkLoad(workLoad);
//                            存入第二阶段教学计划（以老师，开始结束时间，课程，教学班共同决定）
                            courseplanEntityList.add(courseplanEntity1);
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        } catch (InvocationTargetException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
            if (courseWeek > 0) {

            }
            courseplanEntities.add(courseplanEntityList);
        }
        return courseplanEntities;
    }

    /**
     * 给老师分工作量（对授课表中工作量属性的操作）
     * 第一阶段教学计划列表@param courseplanEntityList
     */
    private List<TeachCourseEntity> separateWorkLoad(List<CourseplanEntity> courseplanEntityList) throws ArrangeCourseException {
/**/
//      存放已经分配工作量的授课表
        List<TeachCourseEntity> teachCourseEntities = new ArrayList<>();
//      找到所有的课程
        List<CourseEntity> courseEntityList = courseDao.findAll();
        for (CourseEntity courseEntity : courseEntityList) {
//            该班教学需要的时间(周)
            int allWeek = 0;
//            该课的教学班个数
            int classNum = 0;
//            算出有该课的教学班个数
            for (CourseplanEntity courseplanEntity : courseplanEntityList) {
                if (courseplanEntity.getCourseByCourseId().equals(courseEntity)) {
                    classNum++;
                }
            }
//           算出该班教学需要的时间(周)
            allWeek = classNum * (courseEntity.getWeek());
           /*算出教授该课的老师时间*/
//            找到该课的授课表
            List<TeachCourseEntity> teachCourseEntityList = teachCourseDao.findByCourseByCourseIdOrderByStartWeek(courseEntity);
//          计算老师总时间
            int allTeacherWeek = 0;
            for (TeachCourseEntity teachCourseEntity : teachCourseEntityList) {
//                加上每一个老师的时间
                allTeacherWeek += teachCourseEntity.getOverWeek() - teachCourseEntity.getStartWeek() + 1;
            }
/*设置老师的工作量*/
//            每个老师平均每周教的教学班个数
            if (allTeacherWeek == 0) {
                String Error = "给老师分工作量出现错误:没有专业选择课程<<" + courseEntity.getCourseName() + ">>;或者有班级选却没有老师教授" +
                        "   建议解决方案：检查<<" + courseEntity.getCourseName() + ">>是否没有专业选或者增加老师选择该课";
                throw new ArrangeCourseException(Error);
            }
            int average = (allWeek - 1) / allTeacherWeek + 1;
//            给老师分配工作量
            for (TeachCourseEntity teachCourseEntity : teachCourseEntityList) {
//                单个老师时间
                int teacherWeek = teachCourseEntity.getOverWeek() - teachCourseEntity.getStartWeek() + 1;
                int workLoad = teacherWeek * average;
//               设置工作量
                teachCourseEntity.setWorkLoad(workLoad);
//                存入返回的授课列表
                teachCourseEntities.add(teachCourseEntity);
//                写入数据库
                teachCourseDao.save(teachCourseEntity);
            }
        }
        return teachCourseEntities;
    }


    private List<CourseplanEntity> separateStartOverTime() {
        return null;
    }


    /**
     * 分派课程
     *
     * @return
     */
    private List<CourseplanEntity> separateCourse(List<List> teachClassEntityList) {
//        用于存放第一阶段教学计划（不成熟的，还要扩充的）
        List<CourseplanEntity> courseplanEntityList = new ArrayList<>();
//            第一个为三个自然班的教学班的list
        int capacity = 3;
        for (List<TeachClassEntity> teachClassEntities : teachClassEntityList) {
//            依次取出容量为三双单班的教学班的list
            for (TeachClassEntity teachClassEntity : teachClassEntities) {
//             找到该教学班的所有课程
//             先得到班级,第一个就可以了，因为一个教学班的课都相同
                ClazzEntity clazzEntity = teachClassEntity.getClazzByOneId();
//             再得到选课
                List<SelectCourseEntity> selectCourseEntityList = selectCourseDao.findByClazzByClassId(clazzEntity);
//             最后得到该班级选的课，注意如果是单班教学班只取单班课程，剩下的课为该班所在的多班教学班的课
                List<CourseEntity> courseEntityList = new ArrayList<>();
                for (SelectCourseEntity selectCourseEntity : selectCourseEntityList) {
//                    得到单个课程
                    CourseEntity courseEntity = selectCourseEntity.getCourseByCourseId();
//                    如果是单班的教学班就只要单班课程
                    if (capacity == 1 && courseEntity.getIsSingle() == 1) {
                        courseEntityList.add(courseEntity);
                    }
//                 否则不要单班课程
                    else if (capacity != 1 && courseEntity.getIsSingle() != 1) {
                        courseEntityList.add(courseEntity);
                    }
                }
//               每门课和一个教学班共同对应一个教学计划第一阶段（教学班和课）
                for (CourseEntity courseEntity : courseEntityList) {
                    CourseplanEntity courseplanEntity = new CourseplanEntity();
                    courseplanEntity.setCourseByCourseId(courseEntity);
                    courseplanEntity.setTeachClassByRcId(teachClassEntity);
                    courseplanEntityList.add(courseplanEntity);
                }
            }
            capacity--;
        }
        return courseplanEntityList;
    }

}
