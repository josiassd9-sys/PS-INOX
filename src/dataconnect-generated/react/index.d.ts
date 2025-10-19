import { CreateWeighingSessionData, CreateWeighingSessionVariables, GetWeighingSessionData, GetWeighingSessionVariables, ListVehiclesData, UpdateVehicleData, UpdateVehicleVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateWeighingSession(options?: useDataConnectMutationOptions<CreateWeighingSessionData, FirebaseError, CreateWeighingSessionVariables>): UseDataConnectMutationResult<CreateWeighingSessionData, CreateWeighingSessionVariables>;
export function useCreateWeighingSession(dc: DataConnect, options?: useDataConnectMutationOptions<CreateWeighingSessionData, FirebaseError, CreateWeighingSessionVariables>): UseDataConnectMutationResult<CreateWeighingSessionData, CreateWeighingSessionVariables>;

export function useGetWeighingSession(vars: GetWeighingSessionVariables, options?: useDataConnectQueryOptions<GetWeighingSessionData>): UseDataConnectQueryResult<GetWeighingSessionData, GetWeighingSessionVariables>;
export function useGetWeighingSession(dc: DataConnect, vars: GetWeighingSessionVariables, options?: useDataConnectQueryOptions<GetWeighingSessionData>): UseDataConnectQueryResult<GetWeighingSessionData, GetWeighingSessionVariables>;

export function useListVehicles(options?: useDataConnectQueryOptions<ListVehiclesData>): UseDataConnectQueryResult<ListVehiclesData, undefined>;
export function useListVehicles(dc: DataConnect, options?: useDataConnectQueryOptions<ListVehiclesData>): UseDataConnectQueryResult<ListVehiclesData, undefined>;

export function useUpdateVehicle(options?: useDataConnectMutationOptions<UpdateVehicleData, FirebaseError, UpdateVehicleVariables>): UseDataConnectMutationResult<UpdateVehicleData, UpdateVehicleVariables>;
export function useUpdateVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateVehicleData, FirebaseError, UpdateVehicleVariables>): UseDataConnectMutationResult<UpdateVehicleData, UpdateVehicleVariables>;
