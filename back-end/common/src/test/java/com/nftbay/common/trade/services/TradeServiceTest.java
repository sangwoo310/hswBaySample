package com.nftbay.common.trade.services;

import org.junit.Before;
import org.junit.Test;

import java.util.Calendar;

public class TradeServiceTest {

    TradeService tradeService;

    @Before
    public void setUp() {
        tradeService = new TradeService(null, null, null, null);
    }

    @Test
    public void date_test() {
        Calendar calendar = tradeService.getInitDay();
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        calendar.add(Calendar.DAY_OF_MONTH, -7);

        System.out.println(calendar.getTime());
    }

}
