package com.nftbay.common.nodeos.models;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
@Builder
public class EosTokenTransfer {

    private String contract;

    private String actionName;

}
