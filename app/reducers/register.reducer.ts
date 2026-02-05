import { ClientForm, GPForm } from "../(auth)/register/types";

type State = {
  client: ClientForm;
  gp: GPForm;
  loading: {
    client: boolean;
    gp: boolean;
  };
};

type Action =
  | { type: "SET_CLIENT_FIELD"; field: keyof ClientForm; value: string }
  | { type: "SET_GP_FIELD"; field: keyof GPForm; value: string }
  | { type: "SET_LOADING"; role: "client" | "gp"; value: boolean };

export const initialState: State = {
  client: {
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
  },
  gp: {
    name: "",
    email: "",
    password: "",
    city: "",
    destination: "",
    departureDate: "",
    availableKg: "",
    description: "",
  },
  loading: {
    client: false,
    gp: false,
  },
};

export function registerReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CLIENT_FIELD":
      return {
        ...state,
        client: { ...state.client, [action.field]: action.value },
      };

    case "SET_GP_FIELD":
      return {
        ...state,
        gp: { ...state.gp, [action.field]: action.value },
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: { ...state.loading, [action.role]: action.value },
      };

    default:
      return state;
  }
}
