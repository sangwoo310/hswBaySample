package com.nftbay.common.blockstate.model;

import lombok.*;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "block_index_state")
public class BlockIndexStateModel {

    @Id
    private Integer id;

    @Column(name = "block_num")
    private Long blockNum;

    @Column(name = "block_hash")
    private String blockHash;
}
