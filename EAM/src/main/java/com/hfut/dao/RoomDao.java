package com.hfut.dao;

import com.hfut.entity.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface RoomDao extends JpaRepository<RoomEntity,Integer> {
        public List<RoomEntity> findByCapacity(Integer capacity);
}
