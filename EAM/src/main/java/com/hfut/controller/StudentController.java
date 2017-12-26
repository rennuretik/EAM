package com.hfut.controller;

import com.hfut.biz.TeacherManager;
import com.hfut.entity.TeacherEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by chenjia on 2017/3/11.
 */
//@Controller
//@RequestMapping(value = "/teacher")
public class StudentController extends AbstractBaseController{
    @Autowired
    private TeacherManager teacherManager;

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public String list(String id, Model model) {
        List<List>list=teacherManager.list( id);
        model.addAttribute(RESULT,list);
        return "teacher_manager";
    }

    @RequestMapping(value = "/add" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> addTeacher(TeacherEntity teacherEntity, Model model) {
        teacherManager.save(teacherEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteTeacher(Integer tId, Model model) {
        teacherManager.delete(tId);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping("/batch_delete")
    @ResponseBody
    public Map<String,String> deleteAllTeacher(String ids,Model model) {
        teacherManager.deleteSomeTeacher(ids);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateTeacher(TeacherEntity teacherEntity, Model model) {
        teacherManager.save(teacherEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
//    @RequestMapping(value = "/find",method = RequestMethod.POST)
//    public String findTeacher(TeacherEntity teacherEntity, Model model) {
//        teacherManager.findOne(teacherEntity.gettId());
//        model.addAttribute(RESULT,"success");
//        return "";
//    }
}
