/** Shows text normally, or as a dashed placeholder when it starts with "[". */
export function Txt({ children }: { children: string }) {
  return children.startsWith("[") ? <span className="todo">{children}</span> : <>{children}</>;
}
