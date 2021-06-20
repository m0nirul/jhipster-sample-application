package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.enumeration.ValidationStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.SignatureValidation} entity.
 */
public class SignatureValidationDTO implements Serializable {

    private Long id;

    private String otp;

    private ZonedDateTime createdtime;

    private ZonedDateTime validTill;

    private ValidationStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public ZonedDateTime getCreatedtime() {
        return createdtime;
    }

    public void setCreatedtime(ZonedDateTime createdtime) {
        this.createdtime = createdtime;
    }

    public ZonedDateTime getValidTill() {
        return validTill;
    }

    public void setValidTill(ZonedDateTime validTill) {
        this.validTill = validTill;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SignatureValidationDTO)) {
            return false;
        }

        SignatureValidationDTO signatureValidationDTO = (SignatureValidationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, signatureValidationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SignatureValidationDTO{" +
            "id=" + getId() +
            ", otp='" + getOtp() + "'" +
            ", createdtime='" + getCreatedtime() + "'" +
            ", validTill='" + getValidTill() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
