package com.hfut.biz;

import com.hfut.entity.MajorEntity;
import com.hfut.entity.ZTreeNode;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface MajorManager {
    List<List> list(String id);
    List<ZTreeNode> getManagerMajorTree(String id);
    boolean save(MajorEntity majorEntity);
    boolean delete(Integer id);
    boolean deleteSomeMajor(String ids);
}
