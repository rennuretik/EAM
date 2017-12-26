package com.hfut.controller;

import com.hfut.dao.UsersDao;
import com.hfut.entity.UsersEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by chenjia on 2017/3/5.
 */
@Controller
@EnableAutoConfiguration
public class LoginController {
    @Autowired
    private UsersDao userDao;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "login";
    }

    @RequestMapping(value = "/login")
    public String login(Model model, UsersEntity usersEntity) {
        UsersEntity usersEntity1 = userDao.findByUserName(usersEntity.getUserName()).get(0);
        if (usersEntity1 == null || !(usersEntity.getUserPass().equals(usersEntity1.getUserPass()))) {
            return "login";
        }
//        List<LoginEntity> userList=loginDao.findByUserName("admin");
//        for (LoginEntity loginEntity:userList){
//            System.out.println("”√ªß√˚£∫"+loginEntity.getUserName()+"\r\n"+"√‹¬Î£∫"+loginEntity.getPassWord());
//        }
//        LoginEntity loginEntity =new LoginEntity();
//        loginEntity.setPassWord("111");
//        loginEntity.setUserName("cj");
//        loginEntity.setlId("2");
//        loginDao.save(loginEntity);
        return "main";
    }
    @RequestMapping(value = "/eam/main")
    public String eam_main(Model model, UsersEntity usersEntity) {
        return "main";
    }
    @RequestMapping(value = "/eam/manager")
    public String eam_manager(Model model, UsersEntity usersEntity) {
        return "eam_manager";
    }
}