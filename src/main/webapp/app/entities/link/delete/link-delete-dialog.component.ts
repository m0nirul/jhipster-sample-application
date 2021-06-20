import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILink } from '../link.model';
import { LinkService } from '../service/link.service';

@Component({
  templateUrl: './link-delete-dialog.component.html',
})
export class LinkDeleteDialogComponent {
  link?: ILink;

  constructor(protected linkService: LinkService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.linkService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
