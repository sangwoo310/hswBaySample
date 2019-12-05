package com.nftbay.api.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.server.ServerRequest;

import java.util.Arrays;
import java.util.Collections;

public class PageUtils {

    public static Pageable parsePageable(ServerRequest request) {
        String page = request.queryParam("page").orElse("1");
        String size = request.queryParam("perPage").orElse("10");
        String order = request.queryParam("sort").orElse(null);

        Sort sort = null;
        if (!StringUtils.isEmpty(order)) {
            String[] tmp = order.split(" ");

            if (tmp.length == 2) {
                if (tmp[1].equalsIgnoreCase("asc") || tmp[1].equalsIgnoreCase("desc")) {
                    sort = new Sort(Sort.Direction.fromString(tmp[1]),
                        Collections.singletonList(tmp[0]));
                }
            }
        }

        if (sort == null) {
            return PageRequest.of(Integer.parseInt(page) - 1, Integer.parseInt(size));
        } else {
            return PageRequest.of(Integer.parseInt(page) - 1, Integer.parseInt(size), sort);
        }
    }
}
