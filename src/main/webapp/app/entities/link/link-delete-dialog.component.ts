import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILink } from 'app/shared/model/link.model';
import { LinkService } from './link.service';

@Component({
  templateUrl: './link-delete-dialog.component.html',
})
export class LinkDeleteDialogComponent {
  link?: ILink;

  constructor(protected linkService: LinkService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.linkService.delete(id).subscribe(() => {
      this.eventManager.broadcast('linkListModification');
      this.activeModal.close();
    });
  }
}
