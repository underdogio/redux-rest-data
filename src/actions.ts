import { Action } from 'redux'

import { ItemId, RequestStatusMetadata, Item } from '.'

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
  method: 'get' | 'put' | 'delete'
  status: 'started' | 'success' | 'failure'
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
