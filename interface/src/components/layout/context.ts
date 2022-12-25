import React, { useRef, useEffect, useContext } from 'react';
import { RemoteUtils } from '../../project/automation/utils/remoteUtils';

export interface LayoutContextValue {
  title: string;
  setTitle: (title: string) => void;
}

const LayoutContextDefaultValue = {} as LayoutContextValue;
export const LayoutContext = React.createContext(
  LayoutContextDefaultValue
);

export const useLayoutTitle = (myTitle: string) => {
  let massagedTitle: string = myTitle;
  const { isProxy, remote } = RemoteUtils.getDeviceHost();
  if(isProxy){
    massagedTitle = `${massagedTitle} [Host: ${remote}]`;
  }
  const { title, setTitle } = useContext(LayoutContext);

  const previousTitle = useRef(title);

  useEffect(() => {
    setTitle(massagedTitle);
  }, [setTitle, massagedTitle]);

  useEffect(() => () => {
    setTitle(previousTitle.current);
  }, [setTitle]);

};
