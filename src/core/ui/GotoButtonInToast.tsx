import { useNavigate } from "react-router";
import { Button, type ButtonProps } from "@ui/shadCN/component/button";

interface GotoButonInToastProps extends ButtonProps {
  baseUrl: string;
  urlParams?: string;
  label: string;
}

export function GotoButonInToast({
  baseUrl,
  urlParams,
  label,
  ...props
}: GotoButonInToastProps) {
  const navigate = useNavigate();
  const url = `${baseUrl}${urlParams ?? ""}`;

  return (
    <Button
      variant="outline"
      size="sm"
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        void navigate(url);
      }}
    >
      {label}
    </Button>
  );
}
