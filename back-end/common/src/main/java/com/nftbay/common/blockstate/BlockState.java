package com.nftbay.common.blockstate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BlockState {

    private String name;
    private Long blockIndex;
}
