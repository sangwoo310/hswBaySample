package com.nftbay.common.notice;

public enum EnumLang {

    KOKR("ko-KR"),
    ENUS("en-US")
    ;

    private final String desc;

    EnumLang(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
