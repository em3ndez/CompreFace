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
import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

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
  loadSubjects,
  loadSubjectsFail,
  loadSubjectsSuccess,
  resetSubjects,
  setSelectedSubject,
} from './action';

export interface CollectionEntityState {
  isPending: boolean;
  subjects: string[];
  subject: string;
}

const initialState: CollectionEntityState = {
  isPending: false,
  subjects: null,
  subject: null,
};

const reducer: ActionReducer<CollectionEntityState> = createReducer(
  initialState,
  on(loadSubjects, addSubject, editSubject, deleteSubject, state => ({ ...state, isPending: true })),
  on(addSubjectSuccess, addSubjectSuccess, editSubjectSuccess, (state, { subject }) => ({
    ...state,
    isPending: false,
    subject,
  })),
  on(deleteSubjectSuccess, state => ({ ...state, isPending: false, subject: null })),
  on(loadSubjectsFail, addSubjectFail, editSubjectFail, deleteSubjectFail, deleteSubjectSuccess, state => ({ ...state, isPending: false })),
  on(loadSubjectsSuccess, (state, { subjects }) => ({ ...state, isPending: false, subjects })),
  on(setSelectedSubject, (state, { subject }) => ({ ...state, subject })),
  on(resetSubjects, () => ({ ...initialState }))
);

export const collectionReducer = (modelState: CollectionEntityState, action: Action) => reducer(modelState, action);
