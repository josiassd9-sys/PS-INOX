import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Company_Key {
  id: UUIDString;
  __typename?: 'Company_Key';
}

export interface CreateWeighingSessionData {
  weighingSession_insert: WeighingSession_Key;
}

export interface CreateWeighingSessionVariables {
  userId?: UUIDString | null;
  vehicleId?: UUIDString | null;
  cargoDescription?: string | null;
  destination?: string | null;
  grossWeight: number;
  netWeight?: number | null;
  notes?: string | null;
  origin?: string | null;
  status: string;
  tareWeight?: number | null;
  timestamp: TimestampString;
}

export interface GetWeighingSessionData {
  weighingSession?: {
    id: UUIDString;
    userId?: UUIDString | null;
    vehicleId?: UUIDString | null;
    cargoDescription?: string | null;
    destination?: string | null;
    grossWeight: number;
    netWeight?: number | null;
    notes?: string | null;
    origin?: string | null;
    status: string;
    tareWeight?: number | null;
    timestamp: TimestampString;
  } & WeighingSession_Key;
}

export interface GetWeighingSessionVariables {
  id: UUIDString;
}

export interface ListVehiclesData {
  vehicles: ({
    id: UUIDString;
    licensePlate: string;
    make?: string | null;
    model?: string | null;
    ownerCompanyName?: string | null;
    vehicleType: string;
    year?: number | null;
  } & Vehicle_Key)[];
}

export interface UpdateVehicleData {
  vehicle_update?: Vehicle_Key | null;
}

export interface UpdateVehicleVariables {
  id: UUIDString;
  make?: string | null;
  model?: string | null;
  ownerCompanyName?: string | null;
  vehicleType?: string | null;
  year?: number | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Vehicle_Key {
  id: UUIDString;
  __typename?: 'Vehicle_Key';
}

export interface WeighingSession_Key {
  id: UUIDString;
  __typename?: 'WeighingSession_Key';
}

interface CreateWeighingSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWeighingSessionVariables): MutationRef<CreateWeighingSessionData, CreateWeighingSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWeighingSessionVariables): MutationRef<CreateWeighingSessionData, CreateWeighingSessionVariables>;
  operationName: string;
}
export const createWeighingSessionRef: CreateWeighingSessionRef;

export function createWeighingSession(vars: CreateWeighingSessionVariables): MutationPromise<CreateWeighingSessionData, CreateWeighingSessionVariables>;
export function createWeighingSession(dc: DataConnect, vars: CreateWeighingSessionVariables): MutationPromise<CreateWeighingSessionData, CreateWeighingSessionVariables>;

interface GetWeighingSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWeighingSessionVariables): QueryRef<GetWeighingSessionData, GetWeighingSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWeighingSessionVariables): QueryRef<GetWeighingSessionData, GetWeighingSessionVariables>;
  operationName: string;
}
export const getWeighingSessionRef: GetWeighingSessionRef;

export function getWeighingSession(vars: GetWeighingSessionVariables): QueryPromise<GetWeighingSessionData, GetWeighingSessionVariables>;
export function getWeighingSession(dc: DataConnect, vars: GetWeighingSessionVariables): QueryPromise<GetWeighingSessionData, GetWeighingSessionVariables>;

interface ListVehiclesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVehiclesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListVehiclesData, undefined>;
  operationName: string;
}
export const listVehiclesRef: ListVehiclesRef;

export function listVehicles(): QueryPromise<ListVehiclesData, undefined>;
export function listVehicles(dc: DataConnect): QueryPromise<ListVehiclesData, undefined>;

interface UpdateVehicleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVehicleVariables): MutationRef<UpdateVehicleData, UpdateVehicleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateVehicleVariables): MutationRef<UpdateVehicleData, UpdateVehicleVariables>;
  operationName: string;
}
export const updateVehicleRef: UpdateVehicleRef;

export function updateVehicle(vars: UpdateVehicleVariables): MutationPromise<UpdateVehicleData, UpdateVehicleVariables>;
export function updateVehicle(dc: DataConnect, vars: UpdateVehicleVariables): MutationPromise<UpdateVehicleData, UpdateVehicleVariables>;

