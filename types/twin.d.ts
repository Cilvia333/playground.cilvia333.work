import 'twin.macro';
import { CSSInterpolation } from '@emotion/serialize';

declare module 'react' {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSInterpolation;
    tw?: string;
  }
  // The inline svg css prop
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSInterpolation;
    tw?: string;
  }
}
