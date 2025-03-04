import { Command, Option } from 'commander';
// eslint-disable-next-line no-unused-vars
import * as colors from '@colors/colors';
import * as common from '../cmd_common.js';
import { getTokens } from '../../api/AuthApi.js';
import {
  listRealms,
  getRealmByName,
  addCustomDomain,
  removeCustomDomain,
} from '../../api/RealmApi.js';
import storage from '../../storage/SessionStorage.js';
import {
  printMessage,
  createTable,
  createKeyValueTable,
} from '../../ops/utils/Console.js';

export default function setup() {
  const journey = new Command('realm')
    .helpOption('-h, --help', 'Help')
    .description('Manage realms.');

  journey
    .command('list')
    .addArgument(common.hostArgumentM)
    .addArgument(common.realmArgument)
    .addArgument(common.userArgument)
    .addArgument(common.passwordArgument)
    .helpOption('-h, --help', 'Help')
    .addOption(common.deploymentOption)
    .addOption(common.insecureOption)
    .addOption(
      new Option('-l, --long', 'Long with all fields.').default(false, 'false')
    )
    .description('List all realms.')
    .action(async (host, realm, user, password, options) => {
      storage.session.setTenant(host);
      storage.session.setRealm(realm);
      storage.session.setUsername(user);
      storage.session.setPassword(password);
      storage.session.setDeploymentType(options.type);
      storage.session.setAllowInsecureConnection(options.insecure);
      if (await getTokens()) {
        printMessage('Listing all realms...');
        const realms = await listRealms();
        if (options.long) {
          const table = createTable([
            'Name'.brightCyan,
            'Status'.brightCyan,
            'Custom Domains'.brightCyan,
            'Parent'.brightCyan,
          ]);
          realms.forEach((realmConfig) => {
            table.push([
              realmConfig.name,
              realmConfig.active ? 'active'.brightGreen : 'inactive'.brightRed,
              realmConfig.aliases.join('\n'),
              realmConfig.parentPath,
            ]);
          });
          printMessage(table.toString());
        } else {
          realms.forEach((realmConfig) => {
            printMessage(realmConfig.name, 'info');
          });
        }
      }
    });

  journey
    .command('details')
    .addArgument(common.hostArgumentM)
    .addArgument(common.realmArgument)
    .addArgument(common.userArgument)
    .addArgument(common.passwordArgument)
    .helpOption('-h, --help', 'Help')
    .addOption(common.deploymentOption)
    .addOption(common.insecureOption)
    .description('Show details of a realm.')
    .action(async (host, realm, user, password, options) => {
      storage.session.setTenant(host);
      storage.session.setRealm(realm);
      storage.session.setUsername(user);
      storage.session.setPassword(password);
      storage.session.setDeploymentType(options.type);
      storage.session.setAllowInsecureConnection(options.insecure);
      if (await getTokens()) {
        printMessage(
          `Retrieving details of realm ${storage.session.getRealm()}...`
        );
        const realmConfig = await getRealmByName(storage.session.getRealm());
        if (realmConfig != null) {
          const table = createKeyValueTable();
          table.push(['Name'.brightCyan, realmConfig.name]);
          table.push([
            'Status'.brightCyan,
            realmConfig.active ? 'active'.brightGreen : 'inactive'.brightRed,
          ]);
          table.push([
            'Custom Domains'.brightCyan,
            realmConfig.aliases.join('\n'),
          ]);
          table.push(['Parent'.brightCyan, realmConfig.parentPath]);
          table.push(['Id'.brightCyan, realmConfig._id]);
          printMessage(table.toString());
        } else {
          printMessage(`No realm found with name ${options.target}`, 'warn');
        }
      }
    });

  journey
    .command('add-custom-domain')
    .addArgument(common.hostArgumentM)
    .addArgument(common.realmArgument)
    .addArgument(common.userArgument)
    .addArgument(common.passwordArgument)
    .helpOption('-h, --help', 'Help')
    .addOption(common.deploymentOption)
    .addOption(common.insecureOption)
    .addOption(
      new Option(
        '-d, --domain <name>',
        'Custom DNS domain name.'
      ).makeOptionMandatory()
    )
    .description('Add custom DNS domain to a realm.')
    .action(async (host, realm, user, password, options) => {
      storage.session.setTenant(host);
      storage.session.setRealm(realm);
      storage.session.setUsername(user);
      storage.session.setPassword(password);
      storage.session.setDeploymentType(options.type);
      storage.session.setAllowInsecureConnection(options.insecure);
      if (await getTokens()) {
        printMessage(
          `Adding custom DNS domain ${
            options.domain
          } to realm ${storage.session.getRealm()}...`
        );
        const realmConfig = await addCustomDomain(
          storage.session.getRealm(),
          options.domain
        );
        if (realmConfig != null) {
          const table = createKeyValueTable();
          table.push(['Name'.brightCyan, realmConfig.name]);
          table.push([
            'Status'.brightCyan,
            realmConfig.active ? 'active'.brightGreen : 'inactive'.brightRed,
          ]);
          table.push([
            'Custom Domains'.brightCyan,
            realmConfig.aliases.join('\n'),
          ]);
          table.push(['Parent'.brightCyan, realmConfig.parentPath]);
          table.push(['Id'.brightCyan, realmConfig._id]);
          printMessage(table.toString());
        } else {
          printMessage(`No realm found with name ${options.target}`, 'warn');
        }
      }
    });

  journey
    .command('remove-custom-domain')
    .addArgument(common.hostArgumentM)
    .addArgument(common.realmArgument)
    .addArgument(common.userArgument)
    .addArgument(common.passwordArgument)
    .helpOption('-h, --help', 'Help')
    .addOption(common.deploymentOption)
    .addOption(common.insecureOption)
    .addOption(
      new Option(
        '-d, --domain <name>',
        'Custom DNS domain name.'
      ).makeOptionMandatory()
    )
    .description('Remove custom DNS domain from a realm.')
    .action(async (host, realm, user, password, options) => {
      storage.session.setTenant(host);
      storage.session.setRealm(realm);
      storage.session.setUsername(user);
      storage.session.setPassword(password);
      storage.session.setDeploymentType(options.type);
      storage.session.setAllowInsecureConnection(options.insecure);
      if (await getTokens()) {
        printMessage(
          `Removing custom DNS domain ${
            options.domain
          } from realm ${storage.session.getRealm()}...`
        );
        const realmConfig = await removeCustomDomain(
          storage.session.getRealm(),
          options.domain
        );
        if (realmConfig != null) {
          const table = createKeyValueTable();
          table.push(['Name'.brightCyan, realmConfig.name]);
          table.push([
            'Status'.brightCyan,
            realmConfig.active ? 'active'.brightGreen : 'inactive'.brightRed,
          ]);
          table.push([
            'Custom Domains'.brightCyan,
            realmConfig.aliases.join('\n'),
          ]);
          table.push(['Parent'.brightCyan, realmConfig.parentPath]);
          table.push(['Id'.brightCyan, realmConfig._id]);
          printMessage(table.toString());
        } else {
          printMessage(`No realm found with name ${options.target}`, 'warn');
        }
      }
    });

  journey.showHelpAfterError();
  return journey;
}
