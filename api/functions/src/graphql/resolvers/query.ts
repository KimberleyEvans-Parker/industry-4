import { QueryResolvers } from '../../generated/graphql';
import { MachineStore } from '../MachineStore';

// Resolvers to handle the queries when a user attempts to retrieve something from the database
export const queryResolvers: QueryResolvers = {
  user: async (parent, args) => {
    const userData = await MachineStore.getUserByID(args.id);

    if (!userData) {
      return undefined;
    }

    return {
      ...userData,
    };
  },

  user_email: async (parent, args) => {
    const userData = await MachineStore.getUserByEmail(args.email);

    if (!userData) {
      return undefined;
    }

    return {
      ...userData,
    };
  },

  machine: async (parent, args) => {
    // handles query to retrieve one machine, given an ID
    const machineData = await MachineStore.getMachine(args.id);

    if (!machineData) {
      return undefined;
    }

    return {
      ...machineData,
    };
  },

  machines: async (parent, args, context) => {
    // handles query to retrieve all machines in the database
    const machineDocs = await MachineStore.getMachines();

    return machineDocs;
  },

  sensor: async (parent, args) => {
    // Handles query to retrieve a sensor in the database
    const sensorData = await MachineStore.getSensor(args.machineId, args.id);

    if (!sensorData) {
      return undefined;
    }

    return {
      ...sensorData,
      machineId: args.machineId,
    };
  },
};
