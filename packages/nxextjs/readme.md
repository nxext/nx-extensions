# Sudo code for the usage

```
import { denoConnect } from '../src/packages/http/deno/deno.connect.ts';
import { LibertyServerRouter, LibertyServer } from '../src/framework/mod.ts';

const app = new LibertyServer({
    http: denoConnect, // expressConnect, Fastily, nodeConnect
    router: new LibertyServerRouter([
        {
            path: '/name/:name',
            httpMethod: "Get",
            method: () => {}
        }
    ]),
    middleware: {
			before: [],
			after: []
		},
		IOC: {
			bind: [{ type: 'service', value: ServiceClass, mode: mode.Singleton }],
			container: Inversify
		}
});
app.addRoute('/settings', (req, res) => {
	res.send('Hello World!');
})
app.addController(HomeController);
app.bind<Warrior>(TYPES.Warrior).to(Ninja).inSingletonScope();
app.bind<Warrior>(TYPES.Warrior).to(Ninja).inTransientScope();
app.bind<Warrior>(TYPES.Warrior).to(Ninja).inRequestScope();
console.log(app.listen());


bootstrap(expressConnecct, app => {
	app.addRoute('/settings', (req, res) => {
		res.send('Hello World!');
	})
	app.addController(HomeController);
	app.bind<Warrior>(TYPES.Warrior).to(Ninja).inSingletonScope();
	app.bind<Warrior>(TYPES.Warrior).to(Ninja).inTransientScope();
	app.bind<Warrior>(TYPES.Warrior).to(Ninja).inRequestScope();
	app.port(3000)
	return app;
})


```

```
@Controller("/account")
export class AccountController {

  constructor(private service: AuthService) {}

  @Get("/login")
  getLogin(@Ctx() context: SecurityContext) {
    if (context.security.auth.identity()) {
      return Redirect("/protected");
    }
		return  401()
  }
}

@Injectable({
	mode: 'RequestScope',
})
export class AuthService {
	constructor(
		@Container() ioc: IOCContainer) {
		this logger = ioc.get<type>('Logger');

	}
}

```
