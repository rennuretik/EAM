package com.hfut.controller;

import com.hfut.biz.ClazzManager;
import com.hfut.entity.ClazzEntity;
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
@RequestMapping(value = "/clazz")
public class ClazzController extends AbstractBaseController{
    @Autowired
    private ClazzManager clazzManager;

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public String list(String id, Model model) {
        List<List>list=clazzManager.list(id);
        model.addAttribute(RESULT,list);
        return "clazz_manager";
    }
    @RequestMapping(value = "click/list" ,method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<List>> ClickList(String id, Model model) {
        List<List>list=clazzManager.list(id);
        Map<String,List<List>> map=new HashMap<>();
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
    public Map<String,String> addclazz(ClazzEntity clazzEntity, Model model) {
        clazzManager.save(clazzEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteclazz(Integer tId, Model model) {
        clazzManager.delete(tId);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping("/batch_delete")
    @ResponseBody
    public Map<String,String> deleteAllclazz(String ids,Model model) {
        clazzManager.deleteSomeClazz(ids);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> updateclazz(ClazzEntity clazzEntity, Model model) {
        clazzManager.save(clazzEntity);
        Map<String,String> map=new HashMap<>();
        map.put(RESULT, "success");
        return map;
    }
//    @RequestMapping(value = "/find",method = RequestMethod.POST)
//    public String findclazz(clazzEntity clazzEntity, Model model) {
//        clazzManager.findOne(clazzEntity.gettId());
//        model.addAttribute(RESULT,"success");
//        return "";
//    }
}
