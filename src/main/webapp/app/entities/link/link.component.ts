import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILink } from 'app/shared/model/link.model';
import { LinkService } from './link.service';
import { LinkDeleteDialogComponent } from './link-delete-dialog.component';

@Component({
  selector: 'jhi-link',
  templateUrl: './link.component.html',
})
export class LinkComponent implements OnInit, OnDestroy {
  links?: ILink[];
  eventSubscriber?: Subscription;

  constructor(protected linkService: LinkService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.linkService.query().subscribe((res: HttpResponse<ILink[]>) => (this.links = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInLinks();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ILink): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInLinks(): void {
    this.eventSubscriber = this.eventManager.subscribe('linkListModification', () => this.loadAll());
  }

  delete(link: ILink): void {
    const modalRef = this.modalService.open(LinkDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.link = link;
  }
}
