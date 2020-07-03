import { createSelector } from 'reselect';


export const uiLoaderProjector = (feature) => createSelector(
  state => state.ui,
  ui => {
      if(ui && ui[feature]){
          console.log('feature', feature);
          console.log('ui',ui[feature]);
          return ui[feature];
      }
      else{
          return undefined;
      }
  },
);

export default uiLoaderProjector;