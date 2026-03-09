import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east1'
};

export const createWeighingSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWeighingSession', inputVars);
}
createWeighingSessionRef.operationName = 'CreateWeighingSession';

export function createWeighingSession(dcOrVars, vars) {
  return executeMutation(createWeighingSessionRef(dcOrVars, vars));
}

export const getWeighingSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWeighingSession', inputVars);
}
getWeighingSessionRef.operationName = 'GetWeighingSession';

export function getWeighingSession(dcOrVars, vars) {
  return executeQuery(getWeighingSessionRef(dcOrVars, vars));
}

export const listVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVehicles');
}
listVehiclesRef.operationName = 'ListVehicles';

export function listVehicles(dc) {
  return executeQuery(listVehiclesRef(dc));
}

export const updateVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVehicle', inputVars);
}
updateVehicleRef.operationName = 'UpdateVehicle';

export function updateVehicle(dcOrVars, vars) {
  return executeMutation(updateVehicleRef(dcOrVars, vars));
}

