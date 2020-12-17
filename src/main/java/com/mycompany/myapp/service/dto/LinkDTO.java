package com.mycompany.myapp.service.dto;

import java.time.ZonedDateTime;
import java.io.Serializable;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Link} entity.
 */
public class LinkDTO implements Serializable {
    
    private Long id;

    private ZonedDateTime zonedStartTime;

    private ZonedDateTime zonedDateTime;

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getZonedStartTime() {
        return zonedStartTime;
    }

    public void setZonedStartTime(ZonedDateTime zonedStartTime) {
        this.zonedStartTime = zonedStartTime;
    }

    public ZonedDateTime getZonedDateTime() {
        return zonedDateTime;
    }

    public void setZonedDateTime(ZonedDateTime zonedDateTime) {
        this.zonedDateTime = zonedDateTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LinkDTO)) {
            return false;
        }

        return id != null && id.equals(((LinkDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LinkDTO{" +
            "id=" + getId() +
            ", zonedStartTime='" + getZonedStartTime() + "'" +
            ", zonedDateTime='" + getZonedDateTime() + "'" +
            "}";
    }
}
