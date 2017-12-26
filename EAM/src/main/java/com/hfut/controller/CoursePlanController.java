package com.hfut.controller;

import com.hfut.biz.CoursePlanManager;
import com.hfut.entity.ZTreeNode;
import com.hfut.exception.ArrangeCourseException;
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
@RequestMapping(value = "/coursePlan")
public class CoursePlanController extends AbstractBaseController {
    @Autowired
    private CoursePlanManager coursePlanManager;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String list(Model model) {
        return "main";
    }

    @RequestMapping(value = "arrange/course", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> ClickList() {
        Map<String, String> map = new HashMap<>();
        try {
            coursePlanManager.creat();
            map.put(RESULT, "排课完成");
            return map;
        } catch (ArrangeCourseException e) {
            map.put(RESULT, e.getError());
            return map;
        }
    }

    @RequestMapping(value = "clear", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> clear() {
        coursePlanManager.clear();
        Map<String, String> map = new HashMap<>();
        map.put(RESULT, "已清空教学班及所有排课计划");
        return map;
    }

    @RequestMapping(value = "class/list", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String[]> ClickClassList(String id, Model model) {
        String[] week = coursePlanManager.coursePlanByClass(id);
        Map<String, String[]> map = new HashMap<>();
        map.put(RESULT, week);
        return map;
    }

    @RequestMapping(value = "teacher/list", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String[]> ClickTeacherList(String id, Model model) {
        String[] week = coursePlanManager.coursePlanByTeacher(id);
        Map<String, String[]> map = new HashMap<>();
        map.put(RESULT, week);
        return map;
    }

    @RequestMapping(value = "room/list", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String[]> ClickRoomList(String id, Model model) {
        String[] week = coursePlanManager.coursePlanByRoom(id);
        Map<String, String[]> map = new HashMap<>();
        map.put(RESULT, week);
        return map;
    }

    @RequestMapping(value = "class/Ztree", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, List<ZTreeNode>> getClassZtree(String id, Model model) {
        List<ZTreeNode> list = coursePlanManager.showClassTree(id);
        Map<String, List<ZTreeNode>> map = new HashMap<>();
        map.put(RESULT, list);
        return map;
    }

    @RequestMapping(value = "teacher/Ztree", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, List<ZTreeNode>> getTeacherZtree(String id, Model model) {
        List<ZTreeNode> list = coursePlanManager.showTeacherTree(id);
        Map<String, List<ZTreeNode>> map = new HashMap<>();
        map.put(RESULT, list);
        return map;
    }

    @RequestMapping(value = "room/Ztree", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, List<ZTreeNode>> getRoomZtree(String id, Model model) {
        List<ZTreeNode> list = coursePlanManager.showRoomTree(id);
        Map<String, List<ZTreeNode>> map = new HashMap<>();
        map.put(RESULT, list);
        return map;
    }
}
