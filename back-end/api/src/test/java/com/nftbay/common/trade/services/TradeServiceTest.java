package com.nftbay.common.trade.services;

import com.nftbay.common.bidding.repositories.BiddingHistoryReactiveRepository;
import com.nftbay.common.nodeos.NodeosClient;
import com.nftbay.common.trade.repositories.TradeReactiveRepository;
import com.nftbay.common.support.GrapheneUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class TradeServiceTest {

    private TradeService tradeService;

    @Mock
    private NodeosClient nodeosClient;

    @Mock
    private TradeReactiveRepository tradeReactiveRepository;

    @Mock
    BiddingHistoryReactiveRepository biddingHistoryReactiveRepository;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        tradeService = new TradeService(new GrapheneUtils(), nodeosClient, tradeReactiveRepository,
                biddingHistoryReactiveRepository);
    }

    @Test
    public void test_my_order_success() {
        //orderService.getMyTrades("")

        //SIG_K1_KYpy5z6fsv9Te9x1XSxZuHrh174ubWe9zNdf3E69b91q2eobEKxq54e1u6sHzTJoY3N97sVA5h24sn7GTfj3EHQk7C7aag
        //EOS63xaWw2Wy1LfiLanRcZDf4JSP4UFTBAXkCGJb86jAdJwju5cvr
        //faceostest12
        //3123123213
    }


}
