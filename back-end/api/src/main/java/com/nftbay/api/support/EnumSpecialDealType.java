package com.nftbay.api.support;

public enum EnumSpecialDealType {

    TODAY("오늘"),
    WEEK("이번주"),
    MONTH("이번달"),
    ;

    private final String desc;

    EnumSpecialDealType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
