import { cloneElement, Children, ReactChild, ReactElement } from 'react';

export function isReactText(child: ReactChild): boolean {
  const type = typeof child;

  return type === 'string' || type === 'number';
}

export function transform<P>(
  children: ReactChild | ReactChild[] | undefined,
  getProps: (props: P) => object,
  validator?: (element: ReactElement) => boolean,
): ReactChild[] | null {
  if (!children) return null;
  /* tslint:disable no-shadowed-variable */
  function getResult(children: ReactChild | ReactChild[]): ReactChild[] {
    return Children.map(children, (child) => {
      if (isReactText(child)) return child;
      const element = child as ReactElement;
      let nextProps = element.props;

      if ((validator && validator(element)) || !validator) {
        nextProps = {
          ...element.props,
          ...getProps(element.props),
        };
      }

      return cloneElement(element, nextProps, getResult(element.props.children));
    });
  }

  return getResult(children);
}
