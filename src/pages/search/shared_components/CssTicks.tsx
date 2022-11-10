import styled from "styled-components";

interface PropsTick {
  side?: string;
  selected?: boolean;
}

const Tick = styled.div<PropsTick>`
  font-family: sans-serif;
  white-space: initial;
  overflow: hidden;
  font-size: ${(props) => (props.side === "left" ? "11px" : "10px")};
  color: ${(props) => (props.selected ? "#ec432e" : "#333")};
  text-align: ${(props) => (props.side === "left" ? "right" : "left")};
  line-height: ${(props) => (props.side === "left" ? "1" : "normal")};
  border-left: ${(props) =>
    props.side === "left" ? "0px" : "2px solid black"};
  padding-top: ${(props) => (props.side === "left" ? "5px" : "0px")};
  padding-left: ${(props) => (props.side === "left" ? "0px" : "3px")};
  padding-bottom: ${(props) => (props.side === "left" ? "5px" : "0px")};
  font-weight: ${(props) => (props.selected ? "800" : "400")};
`;

export { Tick };
