package com.hfut.biz;

import com.hfut.entity.RoomEntity;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface RoomManager {
    List<List> list();
    boolean save(RoomEntity roomEntity);
    boolean delete(Integer id);
    boolean deleteSomeRoom(String ids);
}
