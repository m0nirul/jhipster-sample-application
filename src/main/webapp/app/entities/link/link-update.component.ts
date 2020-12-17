import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ILink, Link } from 'app/shared/model/link.model';
import { LinkService } from './link.service';

@Component({
  selector: 'jhi-link-update',
  templateUrl: './link-update.component.html',
})
export class LinkUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    zonedStartTime: [],
    zonedDateTime: [],
  });

  constructor(protected linkService: LinkService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ link }) => {
      if (!link.id) {
        const today = moment().startOf('day');
        link.zonedStartTime = today;
        link.zonedDateTime = today;
      }

      this.updateForm(link);
    });
  }

  updateForm(link: ILink): void {
    this.editForm.patchValue({
      id: link.id,
      zonedStartTime: link.zonedStartTime ? link.zonedStartTime.format(DATE_TIME_FORMAT) : null,
      zonedDateTime: link.zonedDateTime ? link.zonedDateTime.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const link = this.createFromForm();
    if (link.id !== undefined) {
      this.subscribeToSaveResponse(this.linkService.update(link));
    } else {
      this.subscribeToSaveResponse(this.linkService.create(link));
    }
  }

  private createFromForm(): ILink {
    return {
      ...new Link(),
      id: this.editForm.get(['id'])!.value,
      zonedStartTime: this.editForm.get(['zonedStartTime'])!.value
        ? moment(this.editForm.get(['zonedStartTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      zonedDateTime: this.editForm.get(['zonedDateTime'])!.value
        ? moment(this.editForm.get(['zonedDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILink>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
