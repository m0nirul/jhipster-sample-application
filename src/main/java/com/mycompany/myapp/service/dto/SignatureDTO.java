package com.mycompany.myapp.service.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import com.mycompany.myapp.domain.enumeration.ValidationStatus;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Signature} entity.
 */
public class SignatureDTO implements Serializable {
    
    private Long id;

    @NotNull
    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")
    private String email;

    @NotNull
    private String name;

    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")
    private String replyEmail;

    private String replyName;

    private ValidationStatus status;


    private Long signatureValidationId;

    private String ownerId;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getReplyEmail() {
        return replyEmail;
    }

    public void setReplyEmail(String replyEmail) {
        this.replyEmail = replyEmail;
    }

    public String getReplyName() {
        return replyName;
    }

    public void setReplyName(String replyName) {
        this.replyName = replyName;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    public Long getSignatureValidationId() {
        return signatureValidationId;
    }

    public void setSignatureValidationId(Long signatureValidationId) {
        this.signatureValidationId = signatureValidationId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String userId) {
        this.ownerId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SignatureDTO)) {
            return false;
        }

        return id != null && id.equals(((SignatureDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SignatureDTO{" +
            "id=" + getId() +
            ", email='" + getEmail() + "'" +
            ", name='" + getName() + "'" +
            ", replyEmail='" + getReplyEmail() + "'" +
            ", replyName='" + getReplyName() + "'" +
            ", status='" + getStatus() + "'" +
            ", signatureValidationId=" + getSignatureValidationId() +
            ", ownerId='" + getOwnerId() + "'" +
            "}";
    }
}
