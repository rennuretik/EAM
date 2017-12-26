package com.hfut.dao;

import com.hfut.entity.ClazzEntity;
import com.hfut.entity.RoomEntity;
import com.hfut.entity.TeachClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface TeachClassDao extends JpaRepository<TeachClassEntity, Integer> {
    public List<TeachClassEntity> findByClazzByOneId(ClazzEntity clazzEntity);

    public List<TeachClassEntity> findByClazzByTwoId(ClazzEntity clazzEntity);

    public List<TeachClassEntity> findByClazzByThreeId(ClazzEntity clazzEntity);

    public List<TeachClassEntity> findByRoomByRId(RoomEntity roomEntity);
}
