package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "student", schema = "", catalog = "eam")
public class StudentEntity {
    private Integer sId;
    private String sMum;
    private String sName;
    private String sAge;
    private String sSex;
    private ClazzEntity clazzByCId;

    @Id
    @Column(name = "S_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getsId() {
        return sId;
    }

    public void setsId(Integer sId) {
        this.sId = sId;
    }

    @Basic
    @Column(name = "S_Mum", nullable = true, insertable = true, updatable = true, length = 255)
    public String getsMum() {
        return sMum;
    }

    public void setsMum(String sMum) {
        this.sMum = sMum;
    }

    @Basic
    @Column(name = "S_Name", nullable = true, insertable = true, updatable = true, length = 255)
    public String getsName() {
        return sName;
    }

    public void setsName(String sName) {
        this.sName = sName;
    }

    @Basic
    @Column(name = "S_Age", nullable = true, insertable = true, updatable = true, length = 255)
    public String getsAge() {
        return sAge;
    }

    public void setsAge(String sAge) {
        this.sAge = sAge;
    }

    @Basic
    @Column(name = "S_Sex", nullable = true, insertable = true, updatable = true, length = 255)
    public String getsSex() {
        return sSex;
    }

    public void setsSex(String sSex) {
        this.sSex = sSex;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        StudentEntity that = (StudentEntity) o;

        if (sId != that.sId) return false;
        if (sMum != null ? !sMum.equals(that.sMum) : that.sMum != null) return false;
        if (sName != null ? !sName.equals(that.sName) : that.sName != null) return false;
        if (sAge != null ? !sAge.equals(that.sAge) : that.sAge != null) return false;
        if (sSex != null ? !sSex.equals(that.sSex) : that.sSex != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = sId;
        result = 31 * result + (sMum != null ? sMum.hashCode() : 0);
        result = 31 * result + (sName != null ? sName.hashCode() : 0);
        result = 31 * result + (sAge != null ? sAge.hashCode() : 0);
        result = 31 * result + (sSex != null ? sSex.hashCode() : 0);
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "C_ID", referencedColumnName = "Class_ID")
    public ClazzEntity getClazzByCId() {
        return clazzByCId;
    }

    public void setClazzByCId(ClazzEntity clazzByCId) {
        this.clazzByCId = clazzByCId;
    }
}
