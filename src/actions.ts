import { Action } from 'redux'

import {
  ItemId,
  RequestStatusMetadata,
  Item,
  RequestMethod,
  StoreName,
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

export interface RequestAction<DataType extends Item> extends BaseAction {
  type: '@underdogio/redux-rest-data/request'
  id?: ItemId
  method: RequestMethod
  status: RequestStatus
  data?: DataType | DataType[] | Partial<DataType>
  error?: any
}

/**
 * The types of actions that a data store can receive.
 */
export type DataStoreAction<DataType extends Item> =
  | RequestAction<DataType>
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

export function request<DataType extends Item>(params: {
  storeName: StoreName
  id?: ItemId
  method: RequestMethod
  status: RequestStatus
}): RequestAction<DataType> {
  return {
    type: '@underdogio/redux-rest-data/request',
    storeName: params.storeName,
    id: params.id,
    method: params.method,
    status: params.status
  }
}
