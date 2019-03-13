import {Action} from 'redux'

import { ItemId, RequestStatusMetadata } from ".";

export interface AddItemAction extends Action {
  type: '@underdogio/redux-rest-data/add_item'
  id: ItemId
  data: any
  meta: RequestStatusMetadata
}

export interface AddItemsAction extends Action {
  type: '@underdogio/redux-rest-data/add_items'
  data: any[]
}

export interface UpdateItemAction extends Action {
  type: '@underdogio/redux-rest-data/update_item'
  id: ItemId
  data: any
  meta: RequestStatusMetadata
}

export interface RemoveItemAction extends Action {
  type: '@underdogio/redux-rest-data/remove_item'
  id: ItemId
}

export interface RequestAction extends Action {
  type: '@underdogio/redux-rest-data/request_item'
  id?: ItemId
  method: 'get' | 'put' | 'delete'
  status: 'started' | 'success' | 'failure'
  data?: any
  error?: any
}

/**
 * The types of actions that a data store can receive.
 */
export type DataStoreAction = RequestAction | AddItemAction | AddItemsAction | UpdateItemAction | RemoveItemAction
