/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum Status {
  Critical = "Critical",
  Moderate = "Moderate",
  Nominal = "Nominal",
}

export interface MachineUpdateInput {
  name?: string | null;
  healthStatus?: Status | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
