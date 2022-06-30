import { logger, stripIndents } from '@nxext/devkit';

export default async function update() {
  logger.info(stripIndents`
     Ionic 6 has been released and it is recommended that you upgrade your application if you have not already.
     https://ionicframework.com/docs/intro/upgrading-to-ionic-6#react
     `);
}
