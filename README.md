# scheduling-algorithm

[![Build Status](https://travis-ci.com/MatheusChene/scheduling-algorithm.svg?branch=master)](https://travis-ci.com/MatheusChene/scheduling-algorithm)
[![Coverage Status](https://coveralls.io/repos/github/MatheusChene/scheduling-algorithm/badge.svg?branch=master)](https://coveralls.io/github/MatheusChene/scheduling-algorithm?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Esta é uma aplicação feita para ordenar e dividir jobs a serem executados de forma cadenciada e otimizada.

![hippo](https://media.giphy.com/media/SvdgIwwMkqFZERSmC9/giphy.gif)


## Regras

-  Os jobs dentro de cada lista devem ser executados na sequência.
-  O tempo de execução máximo de cada lista não pode ultrapassar 8 horas.
-  O tempo de conclusão máximo de cada job individual deve ser respeitado.
-  Todos os jobs tem que ser executados dentro da janela de execução

## Instalação

Versão do node utilizada: v14.9.0.
Execute o seguinte comando na pasta raiz:

```
$ npm install
```

## Uso

#### Execução de testes + aplicação

```
$ npm start
```

#### Execução da aplicação

```
$ node index
```

#### Features

1. Escolha de arquivo
   -  Adicione arquivos ".json" dentro da pasta "jobs" para utilizar o mesmo na aplicação
2. Geração do arquivo de jobs de forma dinâmica, com datas e valores aleatórios
3. Verificação do arquivo selecionado.
4. Execução do algoritmo de sequenciamento de jobs.

## Testes

Foi utilizado a biblioteca Jest para realizar os testes unitários

#### Instalação do jest(global)

```
$ npm install jest -g
```

#### Execução do teste

```
$ jest
```

## License

MIT: <https://rem.mit-license.org>
