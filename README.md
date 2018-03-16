## This is CLI project related with GAPI graphQL api with typescript Decorators

#### [GAPI](https://github.com/Stradivario/gapi)

#### [Gapi project starter](https://github.com/Stradivario/gapi-starter)
#### [Gapi project starter-advanced](https://github.com/Stradivario/gapi-starter-postgres-sequelize-rabbitmq)

#### To install gapi utility type following command:

```bash
npm i -g gapi-cli
```

#### To create new basic project from scratch via CLI type:

```bash
gapi new my-project
```

#### To create new advanced project from scratch via CLI type:

```bash
gapi new my-project --advanced
```


### Available commands

##### Create new project
```bash
gapi new project-name
```

##### Start created project.

```bash
gapi start
```

###### (Uses internally on every restart to introspect api schema check "gapi schema introspect" command)
###### Can be disabled inside package.json > nodemonConfig > events > restart
###### With this configuration it will make request to localhost:9000 and will take current API schema then will generate graphql.d.ts based on introspection

```json
  "nodemonConfig": {
    "events": {
      "restart": "sleep 1 && gapi schema introspect"
    }
  },
```

##### Start production (it will start pm2 and will use process.yml file inside working directory)
```bash
gapi start --prod
```


##### Start production inside Docker(it will start pm2-docker and will use process.yml file inside working directory)
```bash
gapi start --prod --docker
```



#### Start testing
##### Run single test iteration
```bash
gapi test
```

##### Run tests in watch mode

```bash
gapi test --watch
```

##### Run tests with different environment
###### It will take configuration from gapi-cli.conf.yml 
```yml
config:
  test:
    my-environment:
      API_PORT: 9000
      API_CERT: ./cert.key
      NODE_ENV: development
      AMQP_HOST: 182.10.0.5
      AMQP_PORT: 5672
      ENDPOINT_TESTING: http://localhost:9000/graphql
      TOKEN_TESTING: ''
    local:
      API_PORT: 9000
      API_CERT: ./cert.key
      NODE_ENV: development
      AMQP_HOST: 182.10.0.5
      AMQP_PORT: 5672
      ENDPOINT_TESTING: http://localhost:9000/graphql
      TOKEN_TESTING: ''
    worker:
      API_PORT: 9000
      API_CERT: ./cert.key
      NODE_ENV: production
      AMQP_HOST: 182.10.0.5
      AMQP_PORT: 5672
      ENDPOINT_TESTING: http://182.10.0.101:9000/graphql
      TOKEN_TESTING: ''
```
##### Running with Testing worker environment
```bash
gapi test --worker
```
#### Running with Production environment

```bash
gapi test --prod
```

##### Running with custome enviroment
```bash
gapi test --my-enviroment
```

##### Running tests in watch mode locally
```bash
gapi test --watch
```


#### Schema

##### Schema introspection
###### It will generate graphql.d.ts file based on given address and output folder
###### Uses gapi-cli.conf.yml file
```yml
config:
  schema:
    introspectionEndpoint: http://localhost:9000/graphql
    introspectionOutputFolder: ./src/app/core/api-introspection
```

```bash
gapi schema introspect
```


##### Available shared commands are: 
###### --verbose - Show better logging
