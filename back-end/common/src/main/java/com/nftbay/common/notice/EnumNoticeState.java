package com.nftbay.common.notice;

public enum EnumNoticeState {

    SHOW("노출중"),
    STOP("노출중지")
    ;

    private final String desc;

    EnumNoticeState(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
