package com.hfut.biz;

import com.hfut.entity.ClazzEntity;
import com.hfut.entity.ZTreeNode;

import java.util.List;

/**
 * Created by chenjia on 2017/3/11.
 */
public interface ClazzManager {
    List<List> list(String id);
    List<ZTreeNode> getManagerMajorTree(String id);
    boolean save(ClazzEntity clazzEntity);
    boolean delete(Integer id);
    boolean deleteSomeClazz(String ids);
}
