package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Link.
 */
@Entity
@Table(name = "link")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Link implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "zoned_start_time")
    private ZonedDateTime zonedStartTime;

    @Column(name = "zoned_date_time")
    private ZonedDateTime zonedDateTime;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Link id(Long id) {
        this.id = id;
        return this;
    }

    public ZonedDateTime getZonedStartTime() {
        return this.zonedStartTime;
    }

    public Link zonedStartTime(ZonedDateTime zonedStartTime) {
        this.zonedStartTime = zonedStartTime;
        return this;
    }

    public void setZonedStartTime(ZonedDateTime zonedStartTime) {
        this.zonedStartTime = zonedStartTime;
    }

    public ZonedDateTime getZonedDateTime() {
        return this.zonedDateTime;
    }

    public Link zonedDateTime(ZonedDateTime zonedDateTime) {
        this.zonedDateTime = zonedDateTime;
        return this;
    }

    public void setZonedDateTime(ZonedDateTime zonedDateTime) {
        this.zonedDateTime = zonedDateTime;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Link)) {
            return false;
        }
        return id != null && id.equals(((Link) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Link{" +
            "id=" + getId() +
            ", zonedStartTime='" + getZonedStartTime() + "'" +
            ", zonedDateTime='" + getZonedDateTime() + "'" +
            "}";
    }
}
