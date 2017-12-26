package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "room", schema = "", catalog = "eam")
public class RoomEntity {
    private Integer rId;
    private String rName;
    private Integer capacity;

    @Id
    @Column(name = "R_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getrId() {
        return rId;
    }

    public void setrId(Integer rId) {
        this.rId = rId;
    }

    @Basic
    @Column(name = "R_Name", nullable = true, insertable = true, updatable = true, length = 255)
    public String getrName() {
        return rName;
    }

    public void setrName(String rName) {
        this.rName = rName;
    }

    @Basic
    @Column(name = "Capacity", nullable = true, insertable = true, updatable = true)
    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RoomEntity that = (RoomEntity) o;

        if (rId != that.rId) return false;
        if (rName != null ? !rName.equals(that.rName) : that.rName != null) return false;
        if (capacity != null ? !capacity.equals(that.capacity) : that.capacity != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = rId;
        result = 31 * result + (rName != null ? rName.hashCode() : 0);
        result = 31 * result + (capacity != null ? capacity.hashCode() : 0);
        return result;
    }
}
