package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "time", schema = "", catalog = "eam")
public class TimeEntity {
    private Integer timeId;
    private String week;
    private String quarter;

    @Id
    @Column(name = "Time_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getTimeId() {
        return timeId;
    }

    public void setTimeId(Integer timeId) {
        this.timeId = timeId;
    }

    @Basic
    @Column(name = "Week", nullable = true, insertable = true, updatable = true, length = 255)
    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    @Basic
    @Column(name = "Quarter", nullable = true, insertable = true, updatable = true, length = 255)
    public String getQuarter() {
        return quarter;
    }

    public void setQuarter(String quarter) {
        this.quarter = quarter;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TimeEntity that = (TimeEntity) o;

        if (timeId != that.timeId) return false;
        if (week != null ? !week.equals(that.week) : that.week != null) return false;
        if (quarter != null ? !quarter.equals(that.quarter) : that.quarter != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = timeId;
        result = 31 * result + (week != null ? week.hashCode() : 0);
        result = 31 * result + (quarter != null ? quarter.hashCode() : 0);
        return result;
    }
}
