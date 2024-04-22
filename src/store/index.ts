import { createStore } from 'vuex';

interface Error {
  property: string;
  constraints: { [key: string]: string };
}

interface ErrorsState {
  errors: Error[];
}

const errorsModule = {
  namespaced: true,
  state: (): ErrorsState => ({
    errors: [],
  }),
  mutations: {
    setErrors(state: ErrorsState, errors: Error[]) {
      state.errors = errors;
    },
    removeError(state: ErrorsState, propertyName: string) {
      state.errors = state.errors.filter(error => error.property !== propertyName);
    },
  },
  actions: {
    setErrors({ commit }: { commit: Function }, errors: Error[]) {
      commit('setErrors', errors);
    },
    removeError({ commit }: { commit: Function }, propertyName: string) {
      commit('removeError', propertyName);
    },
  },
  getters: {
    errors: (state: ErrorsState) => state.errors,
  },
};

export const store = createStore({
  modules: {
    errors: errorsModule,
  },
});
