package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "major", schema = "", catalog = "eam")
public class MajorEntity {
    private Integer mId;
    private String mName;
    private FacultyEntity facultyByFId;

    @Id
    @Column(name = "M_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getmId() {
        return mId;
    }

    public void setmId(Integer mId) {
        this.mId = mId;
    }

    @Basic
    @Column(name = "M_Name", nullable = true, insertable = true, updatable = true, length = 255)
    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MajorEntity that = (MajorEntity) o;

        if (mId != that.mId) return false;
        if (mName != null ? !mName.equals(that.mName) : that.mName != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = mId;
        result = 31 * result + (mName != null ? mName.hashCode() : 0);
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "F_ID", referencedColumnName = "F_ID")
    public FacultyEntity getFacultyByFId() {
        return facultyByFId;
    }

    public void setFacultyByFId(FacultyEntity facultyByFId) {
        this.facultyByFId = facultyByFId;
    }
}
