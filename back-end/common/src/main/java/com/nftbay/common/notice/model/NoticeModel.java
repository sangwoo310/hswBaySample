package com.nftbay.common.notice.model;

import com.nftbay.common.notice.EnumLang;
import com.nftbay.common.notice.EnumNoticeState;
import com.nftbay.common.notice.EnumNoticeType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "notice")
public class NoticeModel {

    @Id
    @GeneratedValue
    private Integer id;

    private String title;

    private String content;

    @Enumerated(EnumType.STRING)
    private EnumNoticeType type;

    @Enumerated(EnumType.STRING)
    private EnumNoticeState state;

    @Enumerated(EnumType.STRING)
    private EnumLang lang;

    private Date created;

    private Date updated;

    private Date deleted;

    @Transient
    public Integer getKey() {
        return id;
    }
}
