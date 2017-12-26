package com.hfut.controller;

import com.hfut.biz.FacultyManager;
import com.hfut.entity.FacultyEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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
@Controller
@RequestMapping(value = "/faculty")
public class FacultyController extends AbstractBaseController{
    @Autowired
    private FacultyManager facultyManager;

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public String list(FacultyEntity facultyEntity, Model model) {
        List<List>list=facultyManager.list();
        model.addAttribute(RESULT,list);
        return "faculty_manager";
    }

    @RequestMapping(value = "/add" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> addTeacher(FacultyEntity facultyEntity, Model model) {
        facultyManager.save(facultyEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteTeacher(Integer tId, Model model) {
        facultyManager.delete(tId);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping("/batch_delete")
    @ResponseBody
    public Map<String,String> deleteAllTeacher(String ids,Model model) {
        facultyManager.deleteSomeFaculty(ids);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateTeacher(FacultyEntity facultyEntity, Model model) {
        facultyManager.save(facultyEntity);
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
