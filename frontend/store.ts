import actions from './actions';
import { Growl } from 'primereact/growl';

const initialState: {
	growl: Growl | null,
} = {
	growl: null,
};

export type IStore = typeof initialState;

export const setGrowl = (growl: Growl | null) => ({
	growl,
	type: actions.SET_GROWL,
});

export function reducer(
	state = initialState,
	action: ReturnType<typeof setGrowl>) {
	switch (action.type) {
		case actions.SET_GROWL:
			return { ...state, growl: action.growl };
		default:
			return state;
	}
}
