package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "courseplan", schema = "", catalog = "eam")
public class CourseplanEntity {
    private int csId;
    private Integer startWeek;
    private Integer overWeek;
    private TimeEntity timeByTimeId;
    private CourseEntity courseByCourseId;
    private TeachClassEntity teachClassByRcId;
    private TeacherEntity teacherByTId;

    @Id
    @Column(name = "CS_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getCsId() {
        return csId;
    }

    public void setCsId(Integer csId) {
        this.csId = csId;
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

        CourseplanEntity that = (CourseplanEntity) o;

        if (csId != that.csId) return false;
        if (startWeek != null ? !startWeek.equals(that.startWeek) : that.startWeek != null) return false;
        if (overWeek != null ? !overWeek.equals(that.overWeek) : that.overWeek != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = csId;
        result = 31 * result + (startWeek != null ? startWeek.hashCode() : 0);
        result = 31 * result + (overWeek != null ? overWeek.hashCode() : 0);
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "Time_ID", referencedColumnName = "Time_ID")
    public TimeEntity getTimeByTimeId() {
        return timeByTimeId;
    }

    public void setTimeByTimeId(TimeEntity timeByTimeId) {
        this.timeByTimeId = timeByTimeId;
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
    @JoinColumn(name = "RC_ID", referencedColumnName = "RC_ID")
    public TeachClassEntity getTeachClassByRcId() {
        return teachClassByRcId;
    }

    public void setTeachClassByRcId(TeachClassEntity teachClassByRcId) {
        this.teachClassByRcId = teachClassByRcId;
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
