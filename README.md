# graphql-compose-leveler

> Lets GraphQL servers allow client queries to mutate the shape of response objects.

A [`graphql-leveler`][graphql-leveler] inspired util for use with [`graphql-compose`][graphql-leveler].
 
 It allows GraphQL servers built with `graphql-compose` to let clients modify the output format by flattenning deeper structures or, to the contrary, adding depth where GraphQL objects would normally return flat fields.
 
 
 
## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Background](#background)
- [Install](#install)
- [Development](#development)
- [Usage](#usage)
- [Contribute](#contribute)
  - [Maintainers](#maintainers)
  - [Thanks](#thanks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
 
## Background
 
 A developer once asked for a feature that [graphql-leveler][graphql-leveler] provides, but our API was built using the awesome library called [graphql-compose][graphql-compose].  
 
 
## Install

`npm install --save graphql-compose-leveler`

## Development

## Usage


## Contribute

PRs accepted. 

### Maintainers

* **Core developer**: [Cezar Pokorski](https://www.linkedin.com/in/ikari)

### Thanks

* **@nodkz** 🍻 for the awesome [graphql-compose][graphql-compose] library that is gold when building JS/TS services exposing a GraphQL API.
* **@chasingmaxwell** 🍺 for [graphql-leveler][graphql-leveler] that was the original implementation for pure GraphQL projects.



[graphql-leveler]: https://github.com/chasingmaxwell/graphql-leveler
[graphql-compose]: https://github.com/nodkz/graphql-compose