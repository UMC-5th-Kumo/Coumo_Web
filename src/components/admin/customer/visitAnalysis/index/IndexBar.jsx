import React from 'react';
import styled from 'styled-components';
import Index from './Index';

const IndexBar = ({ tabs, selected, setSelected }) => {
  const handleTabClick = (key) => {
    setSelected(key);
  };

  return (
    <Bar>
      <Span>기준</Span>
      <StyledTab>
        {tabs.map((tab) => (
          <Index
            key={tab.key}
            text={tab.text}
            onClickTab={() => handleTabClick(tab.key)}
            isSelected={selected === tab.key}
          />
        ))}
      </StyledTab>
    </Bar>
  );
};

export default IndexBar;

const Bar = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 43px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.colors.text_darkgray};
  padding-left: 48px;
  box-sizing: border-box;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 0.48px;
`;

const StyledTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
