import { policies } from '#policies/main'
import * as abilities from '#abilities/main'

import { Bouncer } from '@adonisjs/bouncer'
import { HttpContext } from '@adonisjs/core/http'

export type AppBouncer = Bouncer<
  Exclude<HttpContext['auth']['user'], undefined>,
  typeof abilities,
  typeof policies
>