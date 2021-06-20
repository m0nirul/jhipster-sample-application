package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.ValidationStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SignatureValidation.
 */
@Entity
@Table(name = "signature_validation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SignatureValidation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "otp")
    private String otp;

    @Column(name = "createdtime")
    private ZonedDateTime createdtime;

    @Column(name = "valid_till")
    private ZonedDateTime validTill;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ValidationStatus status;

    @JsonIgnoreProperties(value = { "signatureValidation", "owner" }, allowSetters = true)
    @OneToOne(mappedBy = "signatureValidation")
    private Signature signature;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SignatureValidation id(Long id) {
        this.id = id;
        return this;
    }

    public String getOtp() {
        return this.otp;
    }

    public SignatureValidation otp(String otp) {
        this.otp = otp;
        return this;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public ZonedDateTime getCreatedtime() {
        return this.createdtime;
    }

    public SignatureValidation createdtime(ZonedDateTime createdtime) {
        this.createdtime = createdtime;
        return this;
    }

    public void setCreatedtime(ZonedDateTime createdtime) {
        this.createdtime = createdtime;
    }

    public ZonedDateTime getValidTill() {
        return this.validTill;
    }

    public SignatureValidation validTill(ZonedDateTime validTill) {
        this.validTill = validTill;
        return this;
    }

    public void setValidTill(ZonedDateTime validTill) {
        this.validTill = validTill;
    }

    public ValidationStatus getStatus() {
        return this.status;
    }

    public SignatureValidation status(ValidationStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    public Signature getSignature() {
        return this.signature;
    }

    public SignatureValidation signature(Signature signature) {
        this.setSignature(signature);
        return this;
    }

    public void setSignature(Signature signature) {
        if (this.signature != null) {
            this.signature.setSignatureValidation(null);
        }
        if (signature != null) {
            signature.setSignatureValidation(this);
        }
        this.signature = signature;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SignatureValidation)) {
            return false;
        }
        return id != null && id.equals(((SignatureValidation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SignatureValidation{" +
            "id=" + getId() +
            ", otp='" + getOtp() + "'" +
            ", createdtime='" + getCreatedtime() + "'" +
            ", validTill='" + getValidTill() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
