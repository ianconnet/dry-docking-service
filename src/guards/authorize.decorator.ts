import { SetMetadata } from '@nestjs/common';
import { GroupPolicy } from 'src/proto-interfaces/authorize';

export const AUTHORIZE_MENU_KEY = 'authorize_menu';

export const Authorize = (menu: GroupPolicy) =>
  SetMetadata(AUTHORIZE_MENU_KEY, menu);
