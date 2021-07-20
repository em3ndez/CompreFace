/*
 * Copyright (c) 2020 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { SnackBarService } from '../../features/snackbar/snackbar.service';
import { CollectionService } from '../../core/collection/collection.service';
import {
  addSubject,
  addSubjectFail,
  addSubjectSuccess,
  deleteSubject,
  deleteSubjectFail,
  deleteSubjectSuccess,
  editSubject,
  editSubjectFail,
  editSubjectSuccess,
  initSelectedSubject,
  loadSubjects,
  loadSubjectsFail,
  loadSubjectsSuccess,
  setSelectedSubject,
} from './action';
import { CollectionEntityState } from './reducers';
import { selectCollectionSubject, selectCollectionSubjects } from './selectors';

@Injectable()
export class CollectionEffects {
  constructor(
    private actions: Actions,
    private collectionService: CollectionService,
    private snackBarService: SnackBarService,
    private store: Store<CollectionEntityState>
  ) {}

  @Effect()
  loadSubjects$ = this.actions.pipe(
    ofType(loadSubjects),
    switchMap(({ apiKey }) =>
      this.collectionService.getSubjectsList(apiKey).pipe(
        switchMap(({ subjects }) => [loadSubjectsSuccess({ subjects }), initSelectedSubject()]),
        catchError(error => of(loadSubjectsFail({ error })))
      )
    )
  );

  @Effect()
  addSubject$ = this.actions.pipe(
    ofType(addSubject),
    switchMap(({ name, apiKey }) =>
      this.collectionService.addSubject(name, apiKey).pipe(
        switchMap(({ subject }) => [addSubjectSuccess({ subject }), loadSubjects({ apiKey })]),
        catchError(error => of(addSubjectFail({ error })))
      )
    )
  );

  @Effect()
  editSubject$ = this.actions.pipe(
    ofType(editSubject),
    switchMap(({ editName, apiKey, subject }) =>
      this.collectionService.editSubject(editName, apiKey, subject).pipe(
        switchMap(() => [editSubjectSuccess({ subject: editName }), loadSubjects({ apiKey })]),
        catchError(error => of(editSubjectFail({ error })))
      )
    )
  );

  @Effect()
  deleteSubject$ = this.actions.pipe(
    ofType(deleteSubject),
    switchMap(({ name, apiKey }) =>
      this.collectionService.deleteSubject(name, apiKey).pipe(
        switchMap(() => [deleteSubjectSuccess(), loadSubjects({ apiKey })]),
        catchError(error => of(deleteSubjectFail({ error })))
      )
    )
  );

  @Effect()
  initSelectedSubject$ = this.actions.pipe(
    ofType(initSelectedSubject),
    withLatestFrom(this.store.select(selectCollectionSubject), this.store.select(selectCollectionSubjects)),
    switchMap(([, subject, subjects]) => (!subject ? [setSelectedSubject({ subject: subjects[0] })] : []))
  );

  @Effect({ dispatch: false })
  showError$ = this.actions.pipe(
    ofType(loadSubjectsFail, addSubjectFail, editSubjectFail, deleteSubjectFail),
    tap(action => {
      this.snackBarService.openHttpError(action.error);
    })
  );
}
