package com.hfut.exception;

/**
 * Created by chenjia on 2017/3/30.
 */
public class ArrangeCourseException extends Exception {
    private  String Error;

    public ArrangeCourseException(String Error) {
        this.Error=Error;
        System.out.println("�ſγ��ִ���"+Error);
    }
    public String getError() {
        return Error;
    }
}
