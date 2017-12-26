package com.hfut.controller;

import com.hfut.biz.TeachCourseManager;
import com.hfut.entity.TeachCourseEntity;
import com.hfut.entity.ZTreeNode;
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
@RequestMapping(value = "/teachCourse")
public class TeachCourseController extends AbstractBaseController{
    @Autowired
    private TeachCourseManager teachCourseManager;

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public String list(String id, Model model) {
        List<List>list=teachCourseManager.list();
        model.addAttribute(RESULT,list);
        return "teachCourse_manager";
    }


    @RequestMapping(value = "click/list" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<TeachCourseEntity>> ClickList(String id, Model model) {
        List<TeachCourseEntity>list=teachCourseManager.list(id);
        Map<String,List<TeachCourseEntity>> map=new HashMap<>();
        map.put(RESULT, list);
        return map;
    }

    @RequestMapping(value = "/Ztree" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<ZTreeNode>> getZtree(String id, Model model) {
        List<ZTreeNode> list=teachCourseManager.showTeacherTree(id);
        Map<String,List<ZTreeNode>> map=new HashMap<>();
        map.put(RESULT, list);
        return map;
    }   
    
    
    @RequestMapping(value = "/add" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> addTeachCourse(TeachCourseEntity teachCourseEntity, Model model) {
        teachCourseManager.save(teachCourseEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteteachCourse(Integer tId, Model model) {
        teachCourseManager.delete(tId);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping("/batch_delete")
    @ResponseBody
    public Map<String,String> deleteAllTeachCourse(String ids,Model model) {
        teachCourseManager.deleteSomeTeachCourse(ids);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateteachCourse(TeachCourseEntity teachCourseEntity, Model model) {
        teachCourseManager.save(teachCourseEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
//    @RequestMapping(value = "/find",method = RequestMethod.POST)
//    public String findteachCourse(teachCourseEntity teachCourseEntity, Model model) {
//        teachCourseManager.findOne(teachCourseEntity.gettId());
//        model.addAttribute(RESULT,"success");
//        return "";
//    }
}
