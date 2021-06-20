package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.ValidationStatus;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Signature.
 */
@Entity
@Table(name = "signature")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Signature implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @NotNull
    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")
    @Column(name = "reply_email")
    private String replyEmail;

    @Column(name = "reply_name")
    private String replyName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ValidationStatus status;

    @JsonIgnoreProperties(value = { "signature" }, allowSetters = true)
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private SignatureValidation signatureValidation;

    @ManyToOne
    private User owner;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Signature id(Long id) {
        this.id = id;
        return this;
    }

    public String getEmail() {
        return this.email;
    }

    public Signature email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return this.name;
    }

    public Signature name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getReplyEmail() {
        return this.replyEmail;
    }

    public Signature replyEmail(String replyEmail) {
        this.replyEmail = replyEmail;
        return this;
    }

    public void setReplyEmail(String replyEmail) {
        this.replyEmail = replyEmail;
    }

    public String getReplyName() {
        return this.replyName;
    }

    public Signature replyName(String replyName) {
        this.replyName = replyName;
        return this;
    }

    public void setReplyName(String replyName) {
        this.replyName = replyName;
    }

    public ValidationStatus getStatus() {
        return this.status;
    }

    public Signature status(ValidationStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    public SignatureValidation getSignatureValidation() {
        return this.signatureValidation;
    }

    public Signature signatureValidation(SignatureValidation signatureValidation) {
        this.setSignatureValidation(signatureValidation);
        return this;
    }

    public void setSignatureValidation(SignatureValidation signatureValidation) {
        this.signatureValidation = signatureValidation;
    }

    public User getOwner() {
        return this.owner;
    }

    public Signature owner(User user) {
        this.setOwner(user);
        return this;
    }

    public void setOwner(User user) {
        this.owner = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Signature)) {
            return false;
        }
        return id != null && id.equals(((Signature) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Signature{" +
            "id=" + getId() +
            ", email='" + getEmail() + "'" +
            ", name='" + getName() + "'" +
            ", replyEmail='" + getReplyEmail() + "'" +
            ", replyName='" + getReplyName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
