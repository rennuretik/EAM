package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "select_course", schema = "", catalog = "eam")
public class SelectCourseEntity {
    private Integer ccId;
    private CourseEntity courseByCourseId;
    private ClazzEntity clazzByClassId;

    @Id
    @Column(name = "CC_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getCcId() {
        return ccId;
    }

    public void setCcId(Integer ccId) {
        this.ccId = ccId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SelectCourseEntity that = (SelectCourseEntity) o;

        if (ccId != that.ccId) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return ccId;
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
    @JoinColumn(name = "Class_ID", referencedColumnName = "Class_ID")
    public ClazzEntity getClazzByClassId() {
        return clazzByClassId;
    }

    public void setClazzByClassId(ClazzEntity clazzByClassId) {
        this.clazzByClassId = clazzByClassId;
    }
}
