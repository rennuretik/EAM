package com.hfut.controller;

import com.hfut.biz.MajorManager;
import com.hfut.entity.MajorEntity;
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
@RequestMapping(value = "/major")
public class MajorController extends AbstractBaseController{
    @Autowired
    private MajorManager majorManager;

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public String list(String id, Model model) {
        List<List>list=majorManager.list(id);
        model.addAttribute(RESULT,list);
        return "major_manager";
    }

    @RequestMapping(value = "click/list" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<List>> ClickList(String id, Model model) {
        List<List>list=majorManager.list(id);
        Map<String,List<List>> map=new HashMap<>();
        map.put(RESULT, list);
        return map;
    }

    @RequestMapping(value = "/Ztree" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<ZTreeNode>> getZtree(String id, Model model) {
        List<ZTreeNode> list=majorManager.getManagerMajorTree(id);
        Map<String,List<ZTreeNode>> map=new HashMap<>();
        map.put(RESULT, list);
        return map;
    }


    @RequestMapping(value = "/add" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> addMajor(MajorEntity majorEntity, Model model) {
        majorManager.save(majorEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteMajor(Integer tId, Model model) {
        majorManager.delete(tId);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping("/batch_delete")
    @ResponseBody
    public Map<String,String> deleteSomeMajor(String ids,Model model) {
        majorManager.deleteSomeMajor(ids);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateMajor(MajorEntity majorEntity, Model model) {
        majorManager.save(majorEntity);
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
