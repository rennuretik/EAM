package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "teach_course", schema = "", catalog = "eam")
public class TeachCourseEntity {
    private Integer tcId;
    private Integer startWeek;
    private Integer overWeek;
    private CourseEntity courseByCourseId;
    private TeacherEntity teacherByTId;
    private Integer WorkLoad;


    @Id
    @Column(name = "TC_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getTcId() {
        return tcId;
    }

    public void setTcId(Integer tcId) {
        this.tcId = tcId;
    }

    @Basic
    @Column(name = "Work_Load", nullable = true, insertable = true, updatable = true)
    public Integer getWorkLoad() {
        return WorkLoad;
    }

    public void setWorkLoad(Integer workLoad) {
        WorkLoad = workLoad;
    }
    @Basic
    @Column(name = "Start_Week", nullable = true, insertable = true, updatable = true)
    public Integer getStartWeek() {
        return startWeek;
    }

    public void setStartWeek(Integer startWeek) {
        this.startWeek = startWeek;
    }

    @Basic
    @Column(name = "Over_Week", nullable = true, insertable = true, updatable = true)
    public Integer getOverWeek() {
        return overWeek;
    }

    public void setOverWeek(Integer overWeek) {
        this.overWeek = overWeek;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TeachCourseEntity that = (TeachCourseEntity) o;

        if (tcId != that.tcId) return false;
        if (startWeek != null ? !startWeek.equals(that.startWeek) : that.startWeek != null) return false;
        if (overWeek != null ? !overWeek.equals(that.overWeek) : that.overWeek != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = tcId;
        result = 31 * result + (startWeek != null ? startWeek.hashCode() : 0);
        result = 31 * result + (overWeek != null ? overWeek.hashCode() : 0);
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "Course_ID", referencedColumnName = "Course_ID")
    public CourseEntity getCourseByCourseId() {
        return courseByCourseId;
    }

    public void setCourseByCourseId(CourseEntity courseByCourseId) {
        this.courseByCourseId = courseByCourseId;
    }

    @ManyToOne
    @JoinColumn(name = "T_ID", referencedColumnName = "T_ID")
    public TeacherEntity getTeacherByTId() {
        return teacherByTId;
    }

    public void setTeacherByTId(TeacherEntity teacherByTId) {
        this.teacherByTId = teacherByTId;
    }
}
