package com.nftbay.common.support;

import eu.bittrade.crypto.core.ECKey;
import eu.bittrade.libs.steemj.base.models.PublicKey;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class GrapheneUtilsTest {

    @Test
    public void test() {
        GrapheneUtils grapheneUtils = new GrapheneUtils();

        ECKey privKey = grapheneUtils.GrapheneWifToPrivateKey("5JtJqxYHbtUASDxnkPwTeMRmX121WxHJxGSQpc3xjMXtAP9zikf");
        String base64Sig = grapheneUtils.SignEosMessage("I am alive", privKey);
        String pubKeyAddress = grapheneUtils.getAddressFromPublicKey("EOS", privKey);
        PublicKey pubKeyObj = new PublicKey(pubKeyAddress);
        assertTrue(grapheneUtils.VerifyEosMessage("I am alive", base64Sig, pubKeyObj));

        // sign from eccjs
        assertTrue(grapheneUtils.VerifyEosMessage("I am alive", "SIG_K1_K16GYmuz9BiGhKhe2pZRfQYdSbdgAVYxY1B4peWQ196cQgmwsRGzwisKeebSs7kDUvDBbENUkcCxHMHksoKLWDqxkeYY3V", pubKeyObj));
    }
}