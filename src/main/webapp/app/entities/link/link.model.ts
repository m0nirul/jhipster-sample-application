import * as dayjs from 'dayjs';

export interface ILink {
  id?: number;
  zonedStartTime?: dayjs.Dayjs | null;
  zonedDateTime?: dayjs.Dayjs | null;
}

export class Link implements ILink {
  constructor(public id?: number, public zonedStartTime?: dayjs.Dayjs | null, public zonedDateTime?: dayjs.Dayjs | null) {}
}

export function getLinkIdentifier(link: ILink): number | undefined {
  return link.id;
}
