import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILink } from '../link.model';

@Component({
  selector: 'jhi-link-detail',
  templateUrl: './link-detail.component.html',
})
export class LinkDetailComponent implements OnInit {
  link: ILink | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ link }) => {
      this.link = link;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
