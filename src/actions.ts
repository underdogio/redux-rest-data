import {Action} from 'redux'

import { ItemId, RequestStatusMetadata } from ".";

/**
 * Generates an action type with a unique-enough prefix.
 */
const generateActionType = (type: string) => `@underdogio/redux-rest-data/${type}`

export const requestType = generateActionType('request')
export const addItemType = generateActionType('add_item')
export const addItemsType = generateActionType('add_items')
export const updateItemType = generateActionType('update_item')
export const removeItemType = generateActionType('remove_item')

export interface AddItemAction extends Action {
  type: typeof addItemType
  id: ItemId
  data: any
  meta: RequestStatusMetadata
}

export interface AddItemsAction extends Action {
  type: typeof addItemsType
  data: any[]
}

export interface UpdateItemAction extends Action {
  type: typeof updateItemType
  id: ItemId
  data: any
  meta: RequestStatusMetadata
}

export interface RemoveItemAction extends Action {
  type: typeof removeItemType
  id: ItemId
}

export interface RequestAction extends Action {
  type: typeof requestType
  id?: ItemId
  method: 'get' | 'put' | 'delete'
  status: 'started' | 'success' | 'failure'
  data?: any
  error?: any
}

/**
 * The types of actions that a data store can receive.
 */
export type DataStoreAction = AddItemAction | AddItemsAction | UpdateItemAction | RemoveItemAction | RequestAction
