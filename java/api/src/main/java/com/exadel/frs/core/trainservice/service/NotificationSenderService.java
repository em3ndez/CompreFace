package com.exadel.frs.core.trainservice.service;

import com.exadel.frs.core.trainservice.dto.CacheActionDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.impossibl.postgres.api.jdbc.PGConnection;
import com.impossibl.postgres.jdbc.PGDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.sql.Statement;


@Service("notificationSenderService")
@Slf4j
@RequiredArgsConstructor
public class NotificationSenderService {
    @Qualifier("dsPgNot")
    private final PGDataSource pgNotificationDatasource;
    private PGConnection connection;


    public void notifyCacheChange(CacheActionDto cacheActionDto) {
        try {
            connection = (PGConnection) pgNotificationDatasource.getConnection();
            Statement statement = connection.createStatement();

            try {
                ObjectMapper objectMapper = new ObjectMapper();
                String actionString = String.format("NOTIFY face_collection_update_msg, '%s'",
                        objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(cacheActionDto));
                statement.execute(actionString);
            } catch (JsonProcessingException e) {
                log.error(e.getMessage());
            }

            statement.close();
        } catch (SQLException e) {
            log.error(e.getMessage());
        }
    }
}
