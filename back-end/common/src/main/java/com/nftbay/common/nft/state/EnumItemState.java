package com.nftbay.common.nft.state;

public enum EnumItemState {

    TEST("test")
    ;

    private final String desc;

    EnumItemState(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
