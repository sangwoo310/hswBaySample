package com.nftbay.common.trade;

public enum EnumNftType {

    UTI("언리미트타워아이템"),
    UTM("언리미트타워몬스터"),
    UTS("언리미트타워서번트"),
    ;

    private final String desc;

    EnumNftType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
