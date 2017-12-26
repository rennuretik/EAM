package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "teacher", schema = "", catalog = "eam")
public class TeacherEntity {
    private Integer tId;
    private String tName;
    private String tSex;
    private String tAge;
    private String tDuty;
    private Byte isLocal;
    private FacultyEntity facultyByFId;

    @Id
    @Column(name = "T_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer gettId() {
        return tId;
    }

    public void settId(Integer tId) {
        this.tId = tId;
    }

    @Basic
    @Column(name = "T_Name", nullable = true, insertable = true, updatable = true, length = 255)
    public String gettName() {
        return tName;
    }

    public void settName(String tName) {
        this.tName = tName;
    }

    @Basic
    @Column(name = "T_Sex", nullable = true, insertable = true, updatable = true, length = 255)
    public String gettSex() {
        return tSex;
    }

    public void settSex(String tSex) {
        this.tSex = tSex;
    }

    @Basic
    @Column(name = "T_Age", nullable = true, insertable = true, updatable = true, length = 255)
    public String gettAge() {
        return tAge;
    }

    public void settAge(String tAge) {
        this.tAge = tAge;
    }

    @Basic
    @Column(name = "T_Duty", nullable = true, insertable = true, updatable = true, length = 255)
    public String gettDuty() {
        return tDuty;
    }

    public void settDuty(String tDuty) {
        this.tDuty = tDuty;
    }

    @Basic
    @Column(name = "Is_Local", nullable = true, insertable = true, updatable = true)
    public Byte getIsLocal() {
        return isLocal;
    }

    public void setIsLocal(Byte isLocal) {
        this.isLocal = isLocal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TeacherEntity that = (TeacherEntity) o;

        if (tId != that.tId) return false;
        if (tName != null ? !tName.equals(that.tName) : that.tName != null) return false;
        if (tSex != null ? !tSex.equals(that.tSex) : that.tSex != null) return false;
        if (tAge != null ? !tAge.equals(that.tAge) : that.tAge != null) return false;
        if (tDuty != null ? !tDuty.equals(that.tDuty) : that.tDuty != null) return false;
        if (isLocal != null ? !isLocal.equals(that.isLocal) : that.isLocal != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = tId;
        result = 31 * result + (tName != null ? tName.hashCode() : 0);
        result = 31 * result + (tSex != null ? tSex.hashCode() : 0);
        result = 31 * result + (tAge != null ? tAge.hashCode() : 0);
        result = 31 * result + (tDuty != null ? tDuty.hashCode() : 0);
        result = 31 * result + (isLocal != null ? isLocal.hashCode() : 0);
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
