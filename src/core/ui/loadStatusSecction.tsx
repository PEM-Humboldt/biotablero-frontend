export type LoadStatusMsgBarProp = {
  message: string | null;
  type: "normal" | "error";
};

export function LoadStatusMsgBar({ message, type }: LoadStatusMsgBarProp) {
  const backgroundColor = type === "normal" ? "grey" : "red";

  return !message ? null : (
    <div
      style={{
        backgroundColor,
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "0.25rem",
        color: "white",
        maxWidth: "80%",
        fontSize: "1.5rem",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}
