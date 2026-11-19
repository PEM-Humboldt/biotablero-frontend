import { SvgIcon } from "@material-ui/core";
import type { ReactElement, SVGProps } from "react";

export function IconBase(svgPath: ReactElement<SVGProps<SVGPathElement>>) {
  return ({ color = "#fff", fontSize = 20 }) => (
    <SvgIcon
      style={{ color, fontSize }}
      width="29"
      height="29"
      viewBox="0 0 22 22"
    >
      {svgPath}
    </SvgIcon>
  );
}

const closeSvg = (
  <path
    className="cls-close"
    d="M37.77,22.23a11,11,0,1,0,0,15.54A11,11,0,0,0,37.77,22.23Zm-.71,14.83a10,10,0,1,1,0-14.12A10,10,0,0,1,37.06,37.06ZM34.51,26.55,31.06,30l3.45,3.45a.75.75,0,0,1,0,1.06.79.79,0,0,1-.53.22.75.75,0,0,1-.53-.22L30,31.06l-3.45,3.45a.75.75,0,0,1-.53.22.79.79,0,0,1-.53-.22.75.75,0,0,1,0-1.06L28.94,30l-3.45-3.45a.75.75,0,0,1,1.06-1.06L30,28.94l3.45-3.45a.75.75,0,1,1,1.06,1.06Z"
    transform="translate(-19.02 -19.02)"
  />
);

const minusSvg = (
  <path
    className="cls-minus"
    d="M30.64,41.22a11,11,0,1,1,11-11A11,11,0,0,1,30.64,41.22Zm0-21a10,10,0,1,0,10,10A10,10,0,0,0,30.64,20.25Zm6.37,10a.76.76,0,0,0-.75-.75H25A.75.75,0,0,0,25,31H36.26A.75.75,0,0,0,37,30.23Z"
    transform="translate(-19.65 -19.25)"
  />
);

const openSvg = (
  <path
    className="cls-add"
    d="M30,41A11,11,0,1,1,41,30,11,11,0,0,1,30,41Zm0-21A10,10,0,1,0,40,30,10,10,0,0,0,30,20Zm5.62,9.24H30.75V24.38a.75.75,0,1,0-1.5,0v4.87H24.38a.75.75,0,1,0,0,1.5h4.87v4.87a.75.75,0,1,0,1.5,0V30.75h4.87a.75.75,0,1,0,0-1.5Z"
    transform="translate(-19.01 -19.01)"
  />
);

const urlSvg = (
  <path
    className="cls-link"
    d="M31.33,32.58a.5.5,0,0,1,0,.71L28.9,35.72a3,3,0,0,1-4.23,0,3,3,0,0,1,0-4.22l2.44-2.43a3,3,0,0,1,4.22,0,2.83,2.83,0,0,1,.66,1,.51.51,0,0,1-.28.66.5.5,0,0,1-.65-.28,2,2,0,0,0-.44-.66,2,2,0,0,0-2.8,0l-2.44,2.44A2,2,0,0,0,28.19,35l2.43-2.44A.51.51,0,0,1,31.33,32.58Zm1.05-7.84-2.44,2.43a.51.51,0,0,0,0,.71.5.5,0,0,0,.71,0l2.44-2.43a2,2,0,0,1,2.8,2.81l-2.43,2.43a2,2,0,0,1-2.81,0,1.93,1.93,0,0,1-.43-.66.5.5,0,0,0-.93.38,3.09,3.09,0,0,0,.65,1,3,3,0,0,0,4.23,0L36.6,29a3,3,0,0,0-4.22-4.22Zm9.24,5.49a11,11,0,1,1-11-11A11,11,0,0,1,41.62,30.23Zm-1,0a10,10,0,1,0-10,10A10,10,0,0,0,40.62,30.23Z"
    transform="translate(-19.65 -19.25)"
  />
);

export const CloseIcon = IconBase(closeSvg);
export const MinusIcon = IconBase(minusSvg);
export const PlusIcon = IconBase(openSvg);
export const URLIcon = IconBase(urlSvg);
