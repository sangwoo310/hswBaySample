package com.nftbay.common.nft.state;

public enum EnumMonsterState {

    TEST("test")
    ;

    private final String desc;

    EnumMonsterState(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
