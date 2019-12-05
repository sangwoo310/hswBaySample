package com.nftbay.common.bidding;

public enum EnumBiddingType {

    BID("입찰"),
    BUYITNOW("즉시구매"),
    ;

    private final String desc;

    EnumBiddingType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
