import { ValidationStatus } from 'app/shared/model/enumerations/validation-status.model';

export interface ISignature {
  id?: number;
  email?: string;
  name?: string;
  replyEmail?: string;
  replyName?: string;
  status?: ValidationStatus;
  signatureValidationId?: number;
  ownerId?: number;
}

export class Signature implements ISignature {
  constructor(
    public id?: number,
    public email?: string,
    public name?: string,
    public replyEmail?: string,
    public replyName?: string,
    public status?: ValidationStatus,
    public signatureValidationId?: number,
    public ownerId?: number
  ) {}
}
