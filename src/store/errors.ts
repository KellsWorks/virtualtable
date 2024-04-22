import { GetterTree, ActionTree, MutationTree } from 'vuex';

interface Error {
  property: string;
}

interface State {
  errors: Error[];
}

export const state = (): State => ({
  errors: [],
});

export const actions: ActionTree<State, State> = {
  setErrors({ commit }, errors: Error[]) {
    commit('setErrors', errors);
  },
  removeError({ commit, getters }, propertyName: string) {
    const errors = getters.errors;
    const index = errors.findIndex((err: Error) => err.property === propertyName);
    if (index !== -1) {
      commit('removeError', index);
    }
  },
};

export const mutations: MutationTree<State> = {
  setErrors(state, errors: Error[]) {
    state.errors = errors;
  },
  removeError(state, index: number) {
    state.errors.splice(index, 1);
  },
};

export const getters: GetterTree<State, State> = {
  errors: (state) => state.errors,
};
