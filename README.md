# Ethereum workshop 2 : Adoção de animais para um Pet Shop 

#### NOTE: Swapy Network together with Ethereum-BH Meetup Group is hosting the second Ethereum-BH Workshop in Belo Horizonte, Brazil. This repository is based on [Pet Shop tutorial](http://truffleframework.com/tutorials/pet-shop) and aims to clarify all the process of creating a decentralized application. 

## Conteúdo

* [Introdução](#introducao)
* [Ambiente](#ambiente)
* [Desenvolvimento](#desenvolvimento)
  * [Estrutura de pastas](#estrutura-de-pastas)
  * [Escrevendo os Smart Contracts](#escrevendo-os-smart-contracts)
  
## Introdução

Nossa aplicação consiste em um sistema para o controle de adoções de animais em um Pet Shop e, para isso, esse tutorial aborda o processo de:

* Configurar o ambiente de desenvolvimento
* Escrever os smart contracts
* Compilar e publicar os contratos
* Testar os contratos 
* Criar uma interface web para o usuário
* Interagir com o aplicativo descentralizado através do browser

## Ambiente

Antes de começarmos a desenvolver nossa aplicação existem alguns requisistos técnicos. Instale o que segue:

* [Node.js v6+ LTS e npm](https://nodejs.org/en/) e npm (é instalado junto com o Node)
* [Git](https://git-scm.com/)

Após isso, nós precisamos somente instalar o Truffle, o framework que auxiliará no desenvolvimento do nosso DApp:

```
npm install -g truffle
```
Para verificar se o Truffle está instalado corretamente, digite ``` truffle version ``` no seu terminal. Caso veja algum erro, certifique-se que seus módulos npm estão visíveis nas variáveis de ambiente 

Utilizaremos também a Ganache, uma blockchain privada que permite a publicação dos nossos contratos em ambiente de desenvolvimento e dará suporte para o uso e teste da nossa aplicação. Faça o download da mesma em http://truffleframework.com/ganache.

## Desenvolvimento

### Estrutura de pastas

A estrutura inicial de pastas fornecida pelo Truffle possui:

* ```contracts/```: Contém o código fonte dos nossos contratos na linguagem [Solidity](https://solidity.readthedocs.io/en/develop/)
* ```migrations/```: Responsável por migrar nossos contratos para o ambiente desejado. O Truffle possui um sistema de controle de alterações.
* ```test/```: Contém os testes em Javascript e Solidity
* ```truffle.js```: Arquivo de configuração onde é descrito, por exemplo, o host dos contratos. Utilizaremos a rede local fornecida pela Ganache 

Esse repositório possui outras pastas que não importam no momento e serão descritas no decorrer do tutorial.

### Escrevendo os Smart Contracts

Nós começaremos nosso aplicativo descentralizado escrevendo os contratos, que atuam como o "back-end" e criam a interface para o armazenamento na blockchain.

Crie um novo arquivo de Adoption.sol na pasta contracts/ .

Adicione esse conteúdo ao arquivo:

```
pragma solidity ^0.4.17;

contract Adoption {

}
```
Observações:

* A versão mínima requerida do Solidity é descrita no ínicio do contrato: ```pragma solidity ^0.4.17;```. A palavra-chave ```pragma``` signfifica "informação adicional que importa somente ao compilador", enquanto o símbolo ```^``` significa "A versão indicada ou superior".
* Assim como em outras linguagens, a sintaxe exige ```;``` ao final de cada comando.
