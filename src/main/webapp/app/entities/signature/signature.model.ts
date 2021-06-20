import { ISignatureValidation } from 'app/entities/signature-validation/signature-validation.model';
import { IUser } from 'app/entities/user/user.model';
import { ValidationStatus } from 'app/entities/enumerations/validation-status.model';

export interface ISignature {
  id?: number;
  email?: string;
  name?: string;
  replyEmail?: string | null;
  replyName?: string | null;
  status?: ValidationStatus | null;
  signatureValidation?: ISignatureValidation | null;
  owner?: IUser | null;
}

export class Signature implements ISignature {
  constructor(
    public id?: number,
    public email?: string,
    public name?: string,
    public replyEmail?: string | null,
    public replyName?: string | null,
    public status?: ValidationStatus | null,
    public signatureValidation?: ISignatureValidation | null,
    public owner?: IUser | null
  ) {}
}

export function getSignatureIdentifier(signature: ISignature): number | undefined {
  return signature.id;
}
