package com.hfut.dao;

import com.hfut.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by chenjia on 2017/3/10.
 */
public interface UsersDao extends JpaRepository<UsersEntity,Integer> {
    public List<UsersEntity> findByUserName(String name);
}
