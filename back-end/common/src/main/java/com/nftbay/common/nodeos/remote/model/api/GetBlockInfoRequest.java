package com.nftbay.common.nodeos.remote.model.api;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetBlockInfoRequest {

    @SerializedName("block_num_or_id")
    @Expose
    private String blockNumOrId;
}
