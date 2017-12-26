package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "teach_class", schema = "", catalog = "eam")
public class TeachClassEntity {
    private Integer rcId;
    private String rcName;
    private ClazzEntity clazzByOneId;
    private RoomEntity roomByRId;
    private ClazzEntity clazzByThreeId;
    private ClazzEntity clazzByTwoId;

    @Id
    @Column(name = "RC_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getRcId() {
        return rcId;
    }

    public void setRcId(Integer rcId) {
        this.rcId = rcId;
    }

    @Basic
    @Column(name = "RC_Name", nullable = true, insertable = true, updatable = true, length = 255)
    public String getRcName() {
        return rcName;
    }

    public void setRcName(String rcName) {
        this.rcName = rcName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TeachClassEntity that = (TeachClassEntity) o;

        if (rcId != that.rcId) return false;
        if (rcName != null ? !rcName.equals(that.rcName) : that.rcName != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = rcId;
        result = 31 * result + (rcName != null ? rcName.hashCode() : 0);
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "One_ID", referencedColumnName = "Class_ID")
    public ClazzEntity getClazzByOneId() {
        return clazzByOneId;
    }

    public void setClazzByOneId(ClazzEntity clazzByOneId) {
        this.clazzByOneId = clazzByOneId;
    }

    @ManyToOne
    @JoinColumn(name = "R_ID", referencedColumnName = "R_ID")
    public RoomEntity getRoomByRId() {
        return roomByRId;
    }

    public void setRoomByRId(RoomEntity roomByRId) {
        this.roomByRId = roomByRId;
    }

    @ManyToOne
    @JoinColumn(name = "Three_ID", referencedColumnName = "Class_ID")
    public ClazzEntity getClazzByThreeId() {
        return clazzByThreeId;
    }

    public void setClazzByThreeId(ClazzEntity clazzByThreeId) {
        this.clazzByThreeId = clazzByThreeId;
    }

    @ManyToOne
    @JoinColumn(name = "Two_ID", referencedColumnName = "Class_ID")
    public ClazzEntity getClazzByTwoId() {
        return clazzByTwoId;
    }

    public void setClazzByTwoId(ClazzEntity clazzByTwoId) {
        this.clazzByTwoId = clazzByTwoId;
    }
}
