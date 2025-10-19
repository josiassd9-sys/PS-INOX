# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetWeighingSession*](#getweighingsession)
  - [*ListVehicles*](#listvehicles)
- [**Mutations**](#mutations)
  - [*CreateWeighingSession*](#createweighingsession)
  - [*UpdateVehicle*](#updatevehicle)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetWeighingSession
You can execute the `GetWeighingSession` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getWeighingSession(vars: GetWeighingSessionVariables): QueryPromise<GetWeighingSessionData, GetWeighingSessionVariables>;

interface GetWeighingSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWeighingSessionVariables): QueryRef<GetWeighingSessionData, GetWeighingSessionVariables>;
}
export const getWeighingSessionRef: GetWeighingSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWeighingSession(dc: DataConnect, vars: GetWeighingSessionVariables): QueryPromise<GetWeighingSessionData, GetWeighingSessionVariables>;

interface GetWeighingSessionRef {
  ...
  (dc: DataConnect, vars: GetWeighingSessionVariables): QueryRef<GetWeighingSessionData, GetWeighingSessionVariables>;
}
export const getWeighingSessionRef: GetWeighingSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWeighingSessionRef:
```typescript
const name = getWeighingSessionRef.operationName;
console.log(name);
```

### Variables
The `GetWeighingSession` query requires an argument of type `GetWeighingSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWeighingSessionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetWeighingSession` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWeighingSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetWeighingSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWeighingSession, GetWeighingSessionVariables } from '@dataconnect/generated';

// The `GetWeighingSession` query requires an argument of type `GetWeighingSessionVariables`:
const getWeighingSessionVars: GetWeighingSessionVariables = {
  id: ..., 
};

// Call the `getWeighingSession()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWeighingSession(getWeighingSessionVars);
// Variables can be defined inline as well.
const { data } = await getWeighingSession({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWeighingSession(dataConnect, getWeighingSessionVars);

console.log(data.weighingSession);

// Or, you can use the `Promise` API.
getWeighingSession(getWeighingSessionVars).then((response) => {
  const data = response.data;
  console.log(data.weighingSession);
});
```

### Using `GetWeighingSession`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWeighingSessionRef, GetWeighingSessionVariables } from '@dataconnect/generated';

// The `GetWeighingSession` query requires an argument of type `GetWeighingSessionVariables`:
const getWeighingSessionVars: GetWeighingSessionVariables = {
  id: ..., 
};

// Call the `getWeighingSessionRef()` function to get a reference to the query.
const ref = getWeighingSessionRef(getWeighingSessionVars);
// Variables can be defined inline as well.
const ref = getWeighingSessionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWeighingSessionRef(dataConnect, getWeighingSessionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.weighingSession);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.weighingSession);
});
```

## ListVehicles
You can execute the `ListVehicles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listVehicles(): QueryPromise<ListVehiclesData, undefined>;

interface ListVehiclesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVehiclesData, undefined>;
}
export const listVehiclesRef: ListVehiclesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVehicles(dc: DataConnect): QueryPromise<ListVehiclesData, undefined>;

interface ListVehiclesRef {
  ...
  (dc: DataConnect): QueryRef<ListVehiclesData, undefined>;
}
export const listVehiclesRef: ListVehiclesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVehiclesRef:
```typescript
const name = listVehiclesRef.operationName;
console.log(name);
```

### Variables
The `ListVehicles` query has no variables.
### Return Type
Recall that executing the `ListVehicles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListVehicles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVehicles } from '@dataconnect/generated';


// Call the `listVehicles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVehicles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVehicles(dataConnect);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
listVehicles().then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

### Using `ListVehicles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVehiclesRef } from '@dataconnect/generated';


// Call the `listVehiclesRef()` function to get a reference to the query.
const ref = listVehiclesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVehiclesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateWeighingSession
You can execute the `CreateWeighingSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createWeighingSession(vars: CreateWeighingSessionVariables): MutationPromise<CreateWeighingSessionData, CreateWeighingSessionVariables>;

interface CreateWeighingSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWeighingSessionVariables): MutationRef<CreateWeighingSessionData, CreateWeighingSessionVariables>;
}
export const createWeighingSessionRef: CreateWeighingSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWeighingSession(dc: DataConnect, vars: CreateWeighingSessionVariables): MutationPromise<CreateWeighingSessionData, CreateWeighingSessionVariables>;

interface CreateWeighingSessionRef {
  ...
  (dc: DataConnect, vars: CreateWeighingSessionVariables): MutationRef<CreateWeighingSessionData, CreateWeighingSessionVariables>;
}
export const createWeighingSessionRef: CreateWeighingSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWeighingSessionRef:
```typescript
const name = createWeighingSessionRef.operationName;
console.log(name);
```

### Variables
The `CreateWeighingSession` mutation requires an argument of type `CreateWeighingSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateWeighingSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWeighingSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWeighingSessionData {
  weighingSession_insert: WeighingSession_Key;
}
```
### Using `CreateWeighingSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWeighingSession, CreateWeighingSessionVariables } from '@dataconnect/generated';

// The `CreateWeighingSession` mutation requires an argument of type `CreateWeighingSessionVariables`:
const createWeighingSessionVars: CreateWeighingSessionVariables = {
  userId: ..., // optional
  vehicleId: ..., // optional
  cargoDescription: ..., // optional
  destination: ..., // optional
  grossWeight: ..., 
  netWeight: ..., // optional
  notes: ..., // optional
  origin: ..., // optional
  status: ..., 
  tareWeight: ..., // optional
  timestamp: ..., 
};

// Call the `createWeighingSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWeighingSession(createWeighingSessionVars);
// Variables can be defined inline as well.
const { data } = await createWeighingSession({ userId: ..., vehicleId: ..., cargoDescription: ..., destination: ..., grossWeight: ..., netWeight: ..., notes: ..., origin: ..., status: ..., tareWeight: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWeighingSession(dataConnect, createWeighingSessionVars);

console.log(data.weighingSession_insert);

// Or, you can use the `Promise` API.
createWeighingSession(createWeighingSessionVars).then((response) => {
  const data = response.data;
  console.log(data.weighingSession_insert);
});
```

### Using `CreateWeighingSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWeighingSessionRef, CreateWeighingSessionVariables } from '@dataconnect/generated';

// The `CreateWeighingSession` mutation requires an argument of type `CreateWeighingSessionVariables`:
const createWeighingSessionVars: CreateWeighingSessionVariables = {
  userId: ..., // optional
  vehicleId: ..., // optional
  cargoDescription: ..., // optional
  destination: ..., // optional
  grossWeight: ..., 
  netWeight: ..., // optional
  notes: ..., // optional
  origin: ..., // optional
  status: ..., 
  tareWeight: ..., // optional
  timestamp: ..., 
};

// Call the `createWeighingSessionRef()` function to get a reference to the mutation.
const ref = createWeighingSessionRef(createWeighingSessionVars);
// Variables can be defined inline as well.
const ref = createWeighingSessionRef({ userId: ..., vehicleId: ..., cargoDescription: ..., destination: ..., grossWeight: ..., netWeight: ..., notes: ..., origin: ..., status: ..., tareWeight: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWeighingSessionRef(dataConnect, createWeighingSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.weighingSession_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.weighingSession_insert);
});
```

## UpdateVehicle
You can execute the `UpdateVehicle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateVehicle(vars: UpdateVehicleVariables): MutationPromise<UpdateVehicleData, UpdateVehicleVariables>;

interface UpdateVehicleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVehicleVariables): MutationRef<UpdateVehicleData, UpdateVehicleVariables>;
}
export const updateVehicleRef: UpdateVehicleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateVehicle(dc: DataConnect, vars: UpdateVehicleVariables): MutationPromise<UpdateVehicleData, UpdateVehicleVariables>;

interface UpdateVehicleRef {
  ...
  (dc: DataConnect, vars: UpdateVehicleVariables): MutationRef<UpdateVehicleData, UpdateVehicleVariables>;
}
export const updateVehicleRef: UpdateVehicleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateVehicleRef:
```typescript
const name = updateVehicleRef.operationName;
console.log(name);
```

### Variables
The `UpdateVehicle` mutation requires an argument of type `UpdateVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateVehicleVariables {
  id: UUIDString;
  make?: string | null;
  model?: string | null;
  ownerCompanyName?: string | null;
  vehicleType?: string | null;
  year?: number | null;
}
```
### Return Type
Recall that executing the `UpdateVehicle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateVehicleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateVehicleData {
  vehicle_update?: Vehicle_Key | null;
}
```
### Using `UpdateVehicle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateVehicle, UpdateVehicleVariables } from '@dataconnect/generated';

// The `UpdateVehicle` mutation requires an argument of type `UpdateVehicleVariables`:
const updateVehicleVars: UpdateVehicleVariables = {
  id: ..., 
  make: ..., // optional
  model: ..., // optional
  ownerCompanyName: ..., // optional
  vehicleType: ..., // optional
  year: ..., // optional
};

// Call the `updateVehicle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateVehicle(updateVehicleVars);
// Variables can be defined inline as well.
const { data } = await updateVehicle({ id: ..., make: ..., model: ..., ownerCompanyName: ..., vehicleType: ..., year: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateVehicle(dataConnect, updateVehicleVars);

console.log(data.vehicle_update);

// Or, you can use the `Promise` API.
updateVehicle(updateVehicleVars).then((response) => {
  const data = response.data;
  console.log(data.vehicle_update);
});
```

### Using `UpdateVehicle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateVehicleRef, UpdateVehicleVariables } from '@dataconnect/generated';

// The `UpdateVehicle` mutation requires an argument of type `UpdateVehicleVariables`:
const updateVehicleVars: UpdateVehicleVariables = {
  id: ..., 
  make: ..., // optional
  model: ..., // optional
  ownerCompanyName: ..., // optional
  vehicleType: ..., // optional
  year: ..., // optional
};

// Call the `updateVehicleRef()` function to get a reference to the mutation.
const ref = updateVehicleRef(updateVehicleVars);
// Variables can be defined inline as well.
const ref = updateVehicleRef({ id: ..., make: ..., model: ..., ownerCompanyName: ..., vehicleType: ..., year: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateVehicleRef(dataConnect, updateVehicleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehicle_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle_update);
});
```

