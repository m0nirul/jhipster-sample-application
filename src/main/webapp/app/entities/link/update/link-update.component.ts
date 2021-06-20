import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ILink, Link } from '../link.model';
import { LinkService } from '../service/link.service';

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

  constructor(protected linkService: LinkService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ link }) => {
      if (link.id === undefined) {
        const today = dayjs().startOf('day');
        link.zonedStartTime = today;
        link.zonedDateTime = today;
      }

      this.updateForm(link);
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILink>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(link: ILink): void {
    this.editForm.patchValue({
      id: link.id,
      zonedStartTime: link.zonedStartTime ? link.zonedStartTime.format(DATE_TIME_FORMAT) : null,
      zonedDateTime: link.zonedDateTime ? link.zonedDateTime.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): ILink {
    return {
      ...new Link(),
      id: this.editForm.get(['id'])!.value,
      zonedStartTime: this.editForm.get(['zonedStartTime'])!.value
        ? dayjs(this.editForm.get(['zonedStartTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      zonedDateTime: this.editForm.get(['zonedDateTime'])!.value
        ? dayjs(this.editForm.get(['zonedDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
