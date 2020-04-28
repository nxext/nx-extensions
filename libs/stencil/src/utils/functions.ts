import { SupportedStyles } from './typings';

export function calculateStyle(style: SupportedStyles | undefined): SupportedStyles {
  const styleDefault = 'css';

  if(style == undefined) {
    return styleDefault;
  }

  return /^(css|scss|less|styl|pcss)$/.test(style)
    ? style
    : styleDefault;
}
