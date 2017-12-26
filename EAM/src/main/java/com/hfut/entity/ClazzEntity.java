package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "class", schema = "", catalog = "eam")
public class ClazzEntity {
    private Integer classId;
    private String className;
    private Integer grade;
    private MajorEntity majorByMId;

    @Id
    @Column(name = "Class_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    @Basic
    @Column(name = "Class_Name", nullable = false, insertable = true, updatable = true, length = 255)
    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    @Basic
    @Column(name = "Grade", nullable = false, insertable = true, updatable = true)
    public Integer getGrade() {
        return grade;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ClazzEntity that = (ClazzEntity) o;

        if (classId != that.classId) return false;
        if (grade != that.grade) return false;
        if (className != null ? !className.equals(that.className) : that.className != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = classId;
        result = 31 * result + (className != null ? className.hashCode() : 0);
        result = 31 * result + grade;
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "M_ID", referencedColumnName = "M_ID", nullable = false)
    public MajorEntity getMajorByMId() {
        return majorByMId;
    }

    public void setMajorByMId(MajorEntity majorByMId) {
        this.majorByMId = majorByMId;
    }
}
