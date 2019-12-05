package com.nftbay.common.notice.repositories;

import com.nftbay.common.notice.EnumLang;
import com.nftbay.common.notice.EnumNoticeState;
import com.nftbay.common.notice.EnumNoticeType;
import com.nftbay.common.notice.model.NoticeModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NoticeRepository extends CrudRepository<NoticeModel, Integer> {

    Page<NoticeModel> findByTypeInAndLangAndStateInAndDeletedIsNullOrderByIdDesc(List<EnumNoticeType> type,
            EnumLang lang, List<EnumNoticeState> state, Pageable pageable);

    Page<NoticeModel> findByStateInAndLangAndDeletedIsNullOrderByIdDesc(List<EnumNoticeState> state, EnumLang lang, Pageable pageable);
}
