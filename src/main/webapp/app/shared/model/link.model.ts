import { Moment } from 'moment';

export interface ILink {
  id?: number;
  zonedStartTime?: Moment;
  zonedDateTime?: Moment;
}

export class Link implements ILink {
  constructor(public id?: number, public zonedStartTime?: Moment, public zonedDateTime?: Moment) {}
}
