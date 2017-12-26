package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "course", schema = "", catalog = "eam")
public class CourseEntity {
    private Integer courseId;
    private String courseName;
    private Integer week;
    private Integer quarter;
    @Basic
    @Column(name = "Quarter", nullable = false, insertable = true, updatable = true, length = 255)
    public Integer getQuarater() {
        return quarter;
    }

    public void setQuarater(Integer quarater) {
        this.quarter = quarater;
    }

    private Integer isSingle;
    private FacultyEntity facultyByFId;

    @Id
    @Column(name = "Course_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    @Basic
    @Column(name = "Course_Name", nullable = false, insertable = true, updatable = true, length = 255)
    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    @Basic
    @Column(name = "week", nullable = false, insertable = true, updatable = true)
    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    @Basic
    @Column(name = "Is_Single", nullable = false, insertable = true, updatable = true)
    public Integer getIsSingle() {
        return isSingle;
    }

    public void setIsSingle(Integer isSingle) {
        this.isSingle = isSingle;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CourseEntity that = (CourseEntity) o;

        if (courseId != that.courseId) return false;
        if (week != that.week) return false;
        if (courseName != null ? !courseName.equals(that.courseName) : that.courseName != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = courseId;
        result = 31 * result + (courseName != null ? courseName.hashCode() : 0);
        result = 31 * result + week;
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
