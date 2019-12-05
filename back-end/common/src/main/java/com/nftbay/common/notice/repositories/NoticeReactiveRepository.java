package com.nftbay.common.notice.repositories;

import com.nftbay.common.notice.EnumLang;
import com.nftbay.common.notice.EnumNoticeState;
import com.nftbay.common.notice.EnumNoticeType;
import com.nftbay.common.notice.model.NoticeModel;
import com.nftbay.common.support.ReactiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
public class NoticeReactiveRepository extends ReactiveRepository {

    private NoticeRepository noticeRepository;

    @Autowired
    public NoticeReactiveRepository(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public Mono<Page<NoticeModel>> getAllNotices(EnumNoticeState state, EnumLang lang, Pageable pageable) {
        var defer = Mono.fromCallable(() -> noticeRepository.findByStateInAndLangAndDeletedIsNullOrderByIdDesc(Arrays.asList(state), lang,
            pageable));

        return defer.subscribeOn(jdbcScheduler);
    }

    public Mono<Page<NoticeModel>> getNotice(List<EnumNoticeType> typeList, EnumNoticeState state, EnumLang lang, Pageable pageable) {
        var defer = Mono.fromCallable(() -> noticeRepository.findByTypeInAndLangAndStateInAndDeletedIsNullOrderByIdDesc(typeList,
            lang, Arrays.asList(state), pageable));

        return defer.subscribeOn(jdbcScheduler);
    }

    public Mono<Page<NoticeModel>> getAllNotice(EnumLang lang, Pageable pageable) {
        var defer = Mono.fromCallable(() -> noticeRepository.findByTypeInAndLangAndStateInAndDeletedIsNullOrderByIdDesc(Arrays.asList(EnumNoticeType.EVENT, EnumNoticeType.ANNOUNCEMENT),
                lang, Arrays.asList(EnumNoticeState.SHOW, EnumNoticeState.STOP), pageable));

        return defer.subscribeOn(jdbcScheduler);
    }
}
