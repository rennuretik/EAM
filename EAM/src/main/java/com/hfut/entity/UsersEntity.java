package com.hfut.entity;

import javax.persistence.*;

/**
 * Created by chenjia on 2017/3/11.
 */
@Entity
@Table(name = "users", schema = "", catalog = "eam")
public class UsersEntity {
    private String userName;
    private String userPass;
    private Integer uId;
    private Byte isAdmin;

    @Basic
    @Column(name = "user_name", nullable = false, insertable = true, updatable = true, length = 255)
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Basic
    @Column(name = "user_pass", nullable = false, insertable = true, updatable = true, length = 255)
    public String getUserPass() {
        return userPass;
    }

    public void setUserPass(String userPass) {
        this.userPass = userPass;
    }

    @Id
    @Column(name = "U_ID", nullable = false, insertable = true, updatable = true)
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getuId() {
        return uId;
    }

    public void setuId(Integer uId) {
        this.uId = uId;
    }

    @Basic
    @Column(name = "Is_Admin", nullable = true, insertable = true, updatable = true)
    public Byte getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Byte isAdmin) {
        this.isAdmin = isAdmin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UsersEntity that = (UsersEntity) o;

        if (uId != that.uId) return false;
        if (userName != null ? !userName.equals(that.userName) : that.userName != null) return false;
        if (userPass != null ? !userPass.equals(that.userPass) : that.userPass != null) return false;
        if (isAdmin != null ? !isAdmin.equals(that.isAdmin) : that.isAdmin != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = userName != null ? userName.hashCode() : 0;
        result = 31 * result + (userPass != null ? userPass.hashCode() : 0);
        result = 31 * result + uId;
        result = 31 * result + (isAdmin != null ? isAdmin.hashCode() : 0);
        return result;
    }
}
