package com.nftbay.common.nft.state;

public enum EnumServantState {

    TEST("test")
    ;

    private final String desc;

    EnumServantState(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
