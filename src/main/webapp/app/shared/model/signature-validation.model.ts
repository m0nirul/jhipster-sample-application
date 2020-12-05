import { Moment } from 'moment';
import { ValidationStatus } from 'app/shared/model/enumerations/validation-status.model';

export interface ISignatureValidation {
  id?: number;
  otp?: string;
  createdtime?: Moment;
  validTill?: Moment;
  status?: ValidationStatus;
  signatureId?: number;
}

export class SignatureValidation implements ISignatureValidation {
  constructor(
    public id?: number,
    public otp?: string,
    public createdtime?: Moment,
    public validTill?: Moment,
    public status?: ValidationStatus,
    public signatureId?: number
  ) {}
}
