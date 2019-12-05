package com.nftbay.common.notice;

public enum EnumNoticeType {

    ANNOUNCEMENT("공지사항"),
    EVENT("이벤트")
    ;

    private final String desc;

    EnumNoticeType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
