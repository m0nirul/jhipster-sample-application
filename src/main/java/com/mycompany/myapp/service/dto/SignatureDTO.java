package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.enumeration.ValidationStatus;
import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

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

    private SignatureValidationDTO signatureValidation;

    private UserDTO owner;

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

    public SignatureValidationDTO getSignatureValidation() {
        return signatureValidation;
    }

    public void setSignatureValidation(SignatureValidationDTO signatureValidation) {
        this.signatureValidation = signatureValidation;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SignatureDTO)) {
            return false;
        }

        SignatureDTO signatureDTO = (SignatureDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, signatureDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
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
            ", signatureValidation=" + getSignatureValidation() +
            ", owner='" + getOwner() + "'" +
            "}";
    }
}
