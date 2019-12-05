package com.nftbay.api.handler;

import com.nftbay.api.support.PageModel;
import com.nftbay.api.utils.PageUtils;
import com.nftbay.common.notice.EnumLang;
import com.nftbay.common.notice.EnumNoticeState;
import com.nftbay.common.notice.EnumNoticeType;
import com.nftbay.common.notice.model.NoticeModel;
import com.nftbay.common.notice.repositories.NoticeReactiveRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.Collections;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.BodyInserters.fromObject;
import static org.springframework.web.reactive.function.server.ServerResponse.notFound;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

@Slf4j
@Component
public class NoticeHandler {

    private NoticeReactiveRepository noticeReactiveRepository;

    @Autowired
    public NoticeHandler(NoticeReactiveRepository noticeReactiveRepository) {
        this.noticeReactiveRepository = noticeReactiveRepository;
    }

    public Mono<ServerResponse> getNotice(ServerRequest request) {
        String type = request.queryParam("type").orElse(null);
        String lang = request.queryParam("lang").orElse(null);

        if (StringUtils.isEmpty(lang)) {
            lang = EnumLang.ENUS.name();
        }

        lang = lang.replace("-", "");

        EnumLang enumLang = EnumLang.ENUS;

        log.error("1, " + lang);

        try {
            enumLang = EnumLang.valueOf(lang.toUpperCase());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        Mono<Page<NoticeModel>> mono;
        log.error("2, " + enumLang.getDesc());

        if (!StringUtils.isEmpty(type)) {
            EnumNoticeType noticeType = EnumNoticeType.valueOf(type.toUpperCase());
            mono = noticeReactiveRepository.getNotice(Collections.singletonList(noticeType), EnumNoticeState.SHOW, enumLang,
                PageUtils.parsePageable(request));
        } else {
            mono = noticeReactiveRepository.getAllNotices(EnumNoticeState.SHOW, enumLang, PageUtils.parsePageable(request));
        }

        return mono.flatMap(page -> ok().contentType(APPLICATION_JSON)
            .body(fromObject(PageModel.of(page)))
            .switchIfEmpty(notFound().build()));
    }
}
