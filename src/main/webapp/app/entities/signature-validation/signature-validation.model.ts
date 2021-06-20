import * as dayjs from 'dayjs';
import { ISignature } from 'app/entities/signature/signature.model';
import { ValidationStatus } from 'app/entities/enumerations/validation-status.model';

export interface ISignatureValidation {
  id?: number;
  otp?: string | null;
  createdtime?: dayjs.Dayjs | null;
  validTill?: dayjs.Dayjs | null;
  status?: ValidationStatus | null;
  signature?: ISignature | null;
}

export class SignatureValidation implements ISignatureValidation {
  constructor(
    public id?: number,
    public otp?: string | null,
    public createdtime?: dayjs.Dayjs | null,
    public validTill?: dayjs.Dayjs | null,
    public status?: ValidationStatus | null,
    public signature?: ISignature | null
  ) {}
}

export function getSignatureValidationIdentifier(signatureValidation: ISignatureValidation): number | undefined {
  return signatureValidation.id;
}
