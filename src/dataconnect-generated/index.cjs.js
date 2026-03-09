const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east1'
};
exports.connectorConfig = connectorConfig;

const createWeighingSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWeighingSession', inputVars);
}
createWeighingSessionRef.operationName = 'CreateWeighingSession';
exports.createWeighingSessionRef = createWeighingSessionRef;

exports.createWeighingSession = function createWeighingSession(dcOrVars, vars) {
  return executeMutation(createWeighingSessionRef(dcOrVars, vars));
};

const getWeighingSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWeighingSession', inputVars);
}
getWeighingSessionRef.operationName = 'GetWeighingSession';
exports.getWeighingSessionRef = getWeighingSessionRef;

exports.getWeighingSession = function getWeighingSession(dcOrVars, vars) {
  return executeQuery(getWeighingSessionRef(dcOrVars, vars));
};

const listVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVehicles');
}
listVehiclesRef.operationName = 'ListVehicles';
exports.listVehiclesRef = listVehiclesRef;

exports.listVehicles = function listVehicles(dc) {
  return executeQuery(listVehiclesRef(dc));
};

const updateVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVehicle', inputVars);
}
updateVehicleRef.operationName = 'UpdateVehicle';
exports.updateVehicleRef = updateVehicleRef;

exports.updateVehicle = function updateVehicle(dcOrVars, vars) {
  return executeMutation(updateVehicleRef(dcOrVars, vars));
};
