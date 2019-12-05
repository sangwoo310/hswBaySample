package com.nftbay.common.nodeos.remote.model.chain;

import com.nftbay.common.nodeos.remote.model.types.TypeAccountName;
import com.nftbay.common.nodeos.remote.model.types.TypeScopeName;
import com.google.gson.annotations.Expose;


/**
 * Created by swapnibble on 2018-03-20.
 */

public class DataAccessInfo {
    //public enum Type { read, write };

    @Expose
    private String type; // access type

    @Expose
    private TypeAccountName code;

    @Expose
    private TypeScopeName scope;

    @Expose
    private long sequence; // uint64_t
}
