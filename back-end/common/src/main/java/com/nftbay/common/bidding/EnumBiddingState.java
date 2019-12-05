package com.nftbay.common.bidding;

public enum EnumBiddingState {

    BIDDING("입찰"),
    MISCARRY("유찰"),
    WINNING("낙찰"),
    ;

    private final String desc;

    EnumBiddingState(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
