import classnames from 'classnames';
import React, { HTMLAttributes } from 'react';

import classes from './Sample.module.scss';

export interface SampleProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export function Sample({
  text = 'this is a sample component',
  className,
  ...props
}: SampleProps): JSX.Element {
  return (
    <div
      {...props}
      className={classnames(classes.main, classes.root, className)}
    >
      {text}
    </div>
  );
}
