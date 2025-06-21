import React, { createContext, useContext, useState } from 'react';

const RtlContext = createContext();

export const ContextProvider = ({ children }) => {
  const [rtl, setRtl] = useState(false);

  return (
    <RtlContext.Provider value={{ rtl, setRtl }}>
      {children}
    </RtlContext.Provider>
  );
};

export const useRlt = () => {
  const { rtl } = useContext(RtlContext);
  return rtl;
};

export default ContextProvider;