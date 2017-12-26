package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "faculty", schema = "", catalog = "eam")
public class FacultyEntity {
    private Integer fId;
    private String fName;

    @Id
    @Column(name = "F_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getfId() {
        return fId;
    }

    public void setfId(Integer fId) {
        this.fId = fId;
    }

    @Basic
    @Column(name = "F_Name", nullable = true, insertable = true, updatable = true, length = 255)
    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        FacultyEntity that = (FacultyEntity) o;

        if (fId != that.fId) return false;
        if (fName != null ? !fName.equals(that.fName) : that.fName != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = fId;
        result = 31 * result + (fName != null ? fName.hashCode() : 0);
        return result;
    }
}
