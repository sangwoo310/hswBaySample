package com.nftbay.api.handler.response;

import com.nftbay.common.blockstate.BlockState;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlockStateResponse {

    private BlockState serverState;
    private BlockState eosState;
}
