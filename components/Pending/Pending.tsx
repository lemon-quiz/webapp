import React, {ReactElement, ReactNode} from "react";

export interface PendingInterface {
  loading: boolean;
  children: ReactNode
}

export default function Pending({loading, children}: PendingInterface): ReactElement {

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <>{children}</>
  );
}
