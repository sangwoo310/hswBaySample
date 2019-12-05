package com.nftbay.common.gamedata.model;

import com.nftbay.common.nft.models.NFTUTServantModel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "ut_servant")
@PrimaryKeyJoinColumn(name="id")
public class UTServantModel extends GameInfoModel {

    @Id
    private Long id;

    private String job;

    @Column(name = "job_icon_url")
    private String jobIconUrl;
}
