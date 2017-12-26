package com.hfut.biz.impl;

import com.hfut.biz.RoomManager;
import com.hfut.dao.RoomDao;
import com.hfut.entity.RoomEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chenjia on 2017/3/12.
 */
@Component
@Transactional
public class RoomManagerImpl implements RoomManager {
    @Autowired
    private RoomDao roomDao;

    @Override
    public List<List> list() {
        List<RoomEntity> roomEntityList=roomDao.findAll();
        List<List>list=new ArrayList<List>();
        list.add(roomEntityList);
        return list;
    }

    @Override
    public boolean save(RoomEntity roomEntity) {
        roomDao.save(roomEntity);
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        roomDao.delete(id);
        return true;
    }

    @Override
    public boolean deleteSomeRoom(String ids) {
        String[] allId=ids.split(",");
        for (String id:allId){
            roomDao.delete(Integer.valueOf(id));
        }
        return true;
    }
}
