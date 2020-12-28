import { mount } from 'marketing/MarketingApp';
import React, { useRef, useEffect } from 'react';

export default () => {
  const ref = useRef(null);


  // only run once after the component is displayed
  useEffect(() => {
    mount(ref.current);
  });

  return <div ref={ref} />;
};