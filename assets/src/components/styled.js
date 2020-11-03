import styled from '@emotion/styled';

export const AppWrapper = styled.div`
  background: #fcfcfc;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;


export const InterfaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 360px;
  text-align: center;
  align-items: center;
`;

export const StartButton = styled.button`
  font-size: 2rem;
  padding: 20px;
  cursor: pointer;
  margin-top: 60px;
  background: #e6fff0;
  border-color: #eee;
  font-family: 'Roboto Mono', monospace;
  user-select: none;
  width: 224px;
`;

export const ClockWrapper = styled.div`
  text-align: center;
  font-size: 4rem;
  padding: 40px;
  box-sizing: border-box;

  font-family: 'Roboto Mono', monospace;
  font-display: optional;
  font-weight: 100;
  background: #e6f1ff;
  user-select: none;
  width: 100%;
`;

export const BpmWrapper = styled.div`
  padding: 40px;
  font-family: 'Roboto Mono', monospace;
  font-size: 4rem;
  background: #fff0f4;
  user-select: none;
  display: flex;
  width: 100%;
  box-sizing: border-box;
`;

export const BpmInput = styled.input`
  border: none;
  font-family: 'Roboto Mono', monospace;
  font-size: 4rem;
  background: transparent;
  width: 140px;
  margin-right: 10px;

  &:disabled {
    color: black;
  }
`;