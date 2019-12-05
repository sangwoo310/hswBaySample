package com.nftbay.common.support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import reactor.core.scheduler.Scheduler;

public abstract class ReactiveRepository {

    @Autowired
    @Qualifier("jdbcScheduler")
    protected Scheduler jdbcScheduler;
}
