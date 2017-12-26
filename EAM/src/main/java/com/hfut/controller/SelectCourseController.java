package com.hfut.controller;

import com.hfut.biz.ClazzManager;
import com.hfut.biz.SelectCourseManager;
import com.hfut.entity.SelectCourseEntity;
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
@RequestMapping(value = "/selectCourse")
public class SelectCourseController extends AbstractBaseController{
    @Autowired
    private SelectCourseManager selectCourseManager;
    @Autowired
    private ClazzManager clazzManager;
    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public String list(String id, Model model) {
        List<List>list=selectCourseManager.list();
        model.addAttribute(RESULT,list);
        return "selectCourse_manager";
    }

    @RequestMapping(value = "click/list" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<SelectCourseEntity>> ClickList(String id, Model model) {
        List<SelectCourseEntity>list=selectCourseManager.list(id);
        Map<String,List<SelectCourseEntity>> map=new HashMap<>();
        map.put(RESULT, list);
        return map;
    }

    @RequestMapping(value = "/Ztree" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<ZTreeNode>> getZtree(String id, Model model) {
        List<ZTreeNode> list=clazzManager.getManagerMajorTree(id);
        Map<String,List<ZTreeNode>> map=new HashMap<>();
        map.put(RESULT, list);
        return map;
    }


    @RequestMapping(value = "/add" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> addselectCourse(SelectCourseEntity selectCourseEntity, Model model) {
        selectCourseManager.save(selectCourseEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteselectCourse(Integer tId, Model model) {
        selectCourseManager.delete(tId);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping("/batch_delete")
    @ResponseBody
    public Map<String,String> deleteAllselectCourse(String ids,Model model) {
        selectCourseManager.deleteSomeSelectCourse(ids);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateselectCourse(SelectCourseEntity selectCourseEntity, Model model) {
        selectCourseManager.save(selectCourseEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
//    @RequestMapping(value = "/find",method = RequestMethod.POST)
//    public String findselectCourse(selectCourseEntity selectCourseEntity, Model model) {
//        selectCourseManager.findOne(selectCourseEntity.gettId());
//        model.addAttribute(RESULT,"success");
//        return "";
//    }
}
