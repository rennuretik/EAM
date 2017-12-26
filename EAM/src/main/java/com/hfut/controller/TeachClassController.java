package com.hfut.controller;

import com.hfut.biz.TeachClassManager;
import com.hfut.entity.TeachClassEntity;
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
@RequestMapping(value = "/teachClass")
public class TeachClassController extends AbstractBaseController{
    @Autowired
    private TeachClassManager teachClassManager;

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public String list(String id, Model model) {
        List<TeachClassEntity>list=teachClassManager.list();
        model.addAttribute(RESULT,list);
        return "teachClass_manager";
    }

    @RequestMapping(value = "/add" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> addteachClass(TeachClassEntity teachClassEntity, Model model) {
        teachClassManager.save(teachClassEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteteachClass(Integer tId, Model model) {
        teachClassManager.delete(tId);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping("/batch_delete")
    @ResponseBody
    public Map<String,String> deleteAllteachClass(String ids,Model model) {
        teachClassManager.deleteSomeTeachClass(ids);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateteachClass(TeachClassEntity teachClassEntity, Model model) {
        teachClassManager.save(teachClassEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
//    @RequestMapping(value = "/find",method = RequestMethod.POST)
//    public String findteachClass(teachClassEntity teachClassEntity, Model model) {
//        teachClassManager.findOne(teachClassEntity.gettId());
//        model.addAttribute(RESULT,"success");
//        return "";
//    }
}
