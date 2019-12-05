package com.nftbay.common.trade;

public enum EnumTradeState {

    IDLE("판매가능"),
    SELLING("판매중"),
    DONE("판매완료"),
    CANCEL("판매취소"),
    ;

    private final String desc;

    EnumTradeState(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
