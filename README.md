# GraphQL Boilerplate repo
This is a graph ql server boilerplate code built on top the following technologies.

- Typescript
- Type ORM
- Type Graphql
- Inversify
- Apollo server

The server implements authentication via an email based jwt strategy without the use of passwords. 

The sample entities here represents a soccer team/player management system and a role based authorization strategy.

# Configuration
Configuration is broken down into secret and non-secret configuration variables. These files are stored in `src/config/`.

## Secrets

Secrets are set in secrets.{env}.ts files, which are ignored by git, and encoded with gclouds kms tools. There is a shell script to encrypt and decrypt the secrets in the `src/scripts` directory. The encoded files are committed and decrypted at deploy time. 

The primary advantage of this over using environment variables that was in mind was that the secrets and config objects can be strongly typed, and after decryption and build, missing values will be caught at deploy time, not run time.

## Database

The database config values are prefixed by `DATABASE_` Locally a sqlite db is used for convenience.

## App structure

### Models
The db models and graphql entities are defined in `src/datalayer/models` this is where the objects fields and types and relations are defined, and should be as free of any logic as possible.

### Repositories
The repositories are where the business should go, how to find upcoming matches for users, a users roles etc. they belong there.

### Resolvers
Where the logic of how to resolve entities and fields lives. Resolvers are injected with repositories, so the resolvers should stay free of business logic and just defer to the repositories. 

### Container
An inversify container is configured as the first part of the app. Repositories are bound as factories, this is due to the hard reliance they have on an active data connection. Resolvers are bound to a singleton scope, this is required due to the way typegraphql bootstraps them with the decorators. The crypto service is bound as a singleton instance so that it only needs to be instantiated with the secret once, in the container initialization. Likewise the logger is a singleton so that metadata is shared across logger calls.

#### Mailtrap
In the local environment mailtrap is used to send mail, this is a service that will not actually send mail, but will show you the mail as it would have looked had it been sent, it is configured in the secrets and requires manual setup. 

## Dev server
`npm run watch:local` will spin up a dev server with auto reloading.

## DB Seed
`npm run seed:local` will seed the db with a bunch of players, teams and roles. The seeding is pretty random, you may end up with players on no teams and players on tons of teams etc. 

You are guaranteed to only have 1 keeper and 1 team captain per team. Teams will have 6-12 players. These values can all be tweaked.

## External services
The auth and the signup flows send an email with a link to the expected url of a gcp function to exist that handles the token and sets a jwt.

You can get the jwt from the mutations those functions would call:

```graphql
    authenticateSignInToken(emailAddress: $emailAddress, secret: $secret) {
      wasAuthenticationSuccessful
      jwt
      authenticationError
    }
```
Or
```graphql
    verifyToken(emailAddress: $emailAddress, secret: $secret) {
        wasVerificationSuccessful
        jwt
        verificationError
    }
```
The secret can be found by looking up the tokens in the db.
