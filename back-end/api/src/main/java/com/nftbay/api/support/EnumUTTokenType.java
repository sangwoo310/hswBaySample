package com.nftbay.api.support;

public enum EnumUTTokenType {

    // unlimited tower token type

    SERVANT("서벤트"),
    MONSTER("몬스터"),
    ITEM("아이템"),
    ;

    private final String desc;

    EnumUTTokenType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
