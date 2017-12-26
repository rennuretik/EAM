package com.hfut.controller;

import com.hfut.biz.CourseManager;
import com.hfut.entity.CourseEntity;
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
@RequestMapping(value = "/course")
public class CourseController extends AbstractBaseController{
    @Autowired
    private CourseManager courseManager;

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public String list(String id, Model model) {
        List<List>list=courseManager.list(id);
        model.addAttribute(RESULT,list);
        return "course_manager";
    }


    @RequestMapping(value = "click/list" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<List>> ClickList(String id, Model model) {
        List<List>list=courseManager.list(id);
        Map<String,List<List>> map=new HashMap<>();
        map.put(RESULT, list);
        return map;
    }

    @RequestMapping(value = "/Ztree" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<ZTreeNode>> getZtree(String id, Model model) {
        List<ZTreeNode> list=courseManager.getManagerCourseTree(id);
        Map<String,List<ZTreeNode>> map=new HashMap<>();
        map.put(RESULT, list);
        return map;
    } 
    
    @RequestMapping(value = "/add" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> addCourse(CourseEntity courseEntity, Model model) {
        courseManager.save(courseEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteCourse(Integer tId, Model model) {
        courseManager.delete(tId);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping("/batch_delete")
    @ResponseBody
    public Map<String,String> deleteSomecourse(String ids,Model model) {
        courseManager.deleteSomeCourse(ids);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updatecourse(CourseEntity courseEntity, Model model) {
        courseManager.save(courseEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
//    @RequestMapping(value = "/find",method = RequestMethod.POST)
//    public String findcourse(courseEntity courseEntity, Model model) {
//        courseManager.findOne(courseEntity.gettId());
//        model.addAttribute(RESULT,"success");
//        return "";
//    }
}
