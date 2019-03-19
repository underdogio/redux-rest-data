import { Action } from 'redux'

import {
  ItemId,
  RequestStatusMetadata,
  Item,
  RequestMethod,
  StoreName,
  RequestOptions,
  RequestStatus
} from '.'

interface BaseAction extends Action {
  storeName: string
}

export interface AddItemAction<DataType extends Item> extends BaseAction {
  type: '@underdogio/redux-rest-data/add_item'
  id: ItemId
  data: DataType
  meta: RequestStatusMetadata
}

export interface AddItemsAction<DataType extends Item> extends BaseAction {
  type: '@underdogio/redux-rest-data/add_items'
  data: DataType[]
}

export interface UpdateItemAction<DataType extends Item> extends BaseAction {
  type: '@underdogio/redux-rest-data/update_item'
  id: ItemId
  data?: Partial<DataType>
  meta?: Partial<RequestStatusMetadata>
}

export interface RemoveItemAction extends BaseAction {
  type: '@underdogio/redux-rest-data/remove_item'
  id: ItemId
}

export interface UpdateRequestStatusAction<DataType extends Item>
  extends BaseAction {
  type: '@underdogio/redux-rest-data/update_request_status'
  id?: ItemId
  method: RequestMethod
  status: RequestStatus
  data?: DataType | DataType[] | Partial<DataType>
  error?: any
}

export interface RequestAction<DataType extends Item> extends BaseAction {
  type: '@underdogio/redux-rest-data/request'
  requestOptions: RequestOptions<DataType>
  id?: ItemId
}

/**
 * The types of actions that a data store can receive.
 */
export type DataStoreAction<DataType extends Item> =
  | UpdateRequestStatusAction<DataType>
  | AddItemAction<DataType>
  | AddItemsAction<DataType>
  | UpdateItemAction<DataType>
  | RemoveItemAction

export function addItem<DataType extends Item>(params: {
  storeName: StoreName
  id: ItemId
  data?: DataType
  meta?: RequestStatusMetadata
}): AddItemAction<DataType> {
  return {
    type: '@underdogio/redux-rest-data/add_item',
    storeName: params.storeName,
    id: params.id,
    data: params.data,
    meta: params.meta
  }
}

export function addItems<DataType extends Item>(params: {
  storeName: StoreName
  data?: DataType[]
}): AddItemsAction<DataType> {
  return {
    type: '@underdogio/redux-rest-data/add_items',
    storeName: params.storeName,
    data: params.data
  }
}

export function updateItem<DataType extends Item>(params: {
  storeName: StoreName
  id: ItemId
  data?: Partial<DataType>
  meta?: Partial<RequestStatusMetadata>
}): UpdateItemAction<DataType> {
  return {
    type: '@underdogio/redux-rest-data/update_item',
    storeName: params.storeName,
    id: params.id,
    data: params.data,
    meta: params.meta
  }
}

export function deleteItem(params: {
  storeName: StoreName
  id: ItemId
}): RemoveItemAction {
  return {
    type: '@underdogio/redux-rest-data/remove_item',
    storeName: params.storeName,
    id: params.id
  }
}

export function updateRequestStatus<DataType extends Item>(params: {
  storeName: StoreName
  id?: ItemId
  method: RequestMethod
  status: RequestStatus
  data?: DataType | DataType[] | Partial<DataType>
  error?: any
}): UpdateRequestStatusAction<DataType> {
  type ReturnType = UpdateRequestStatusAction<DataType>

  const action: Partial<ReturnType> = {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: params.storeName,
    method: params.method,
    status: params.status
  }

  if (params.id) {
    action.id = params.id
  }

  if (params.status === 'success') {
    action.data = params.data
  } else if (params.status === 'failure') {
    action.error = params.error
  }

  return action as ReturnType
}
