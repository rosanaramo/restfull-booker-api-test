# Restful Booker API Test

Projeto de automacao de testes de API para a aplicacao publica [Restful Booker](https://restful-booker.herokuapp.com), utilizando JavaScript, Mocha, Chai, Supertest, Faker e Mochawesome.

## Objetivo

Validar os principais fluxos da API de reservas, cobrindo autenticacao, consulta e criacao de bookings. A suite tambem inclui cenarios negativos, regras de negocio e alguns testes de seguranca simples para observar o comportamento da API diante de dados invalidos.

## Tecnologias

- Node.js
- Mocha
- Chai
- Supertest
- Mochawesome
- Faker
- date-fns
- dotenv

## Pre-requisitos

- Node.js instalado
- npm instalado

## Instalacao

Instale as dependencias do projeto:

```bash
npm install
```

## Configuracao

Crie um arquivo `.env` na raiz do projeto com a URL base da API:

```env
BASE_URL=https://restful-booker.herokuapp.com
```

As credenciais usadas no fluxo de autenticacao estao em:

```text
fixtures/credentials.json
```

## Execucao dos testes

Execute toda a suite:

```bash
npm test
```

O projeto usa o reporter Mochawesome. Apos a execucao, o relatorio e gerado em:

```text
mochawesome-report/
```

## Estrutura do projeto

```text
.
├── factories/
│   └── bookingFactory
├── fixtures/
│   ├── booking.json
│   └── credentials.json
├── helpers/
│   ├── addBooking.js
│   ├── authentication.js
│   └── datesHelper.js
├── test/
│   ├── login.test.js
│   └── booking/
│       ├── get-bookings.test.js
│       └── post-booking.test.js
├── package.json
└── README.md
```

## Cenarios automatizados

### Autenticacao

- Criacao de token no endpoint `POST /auth`
- Uso das credenciais padrao da API publica:
  - `admin`
  - `password123`

### Booking

- Listagem de reservas com `GET /booking`
- Consulta de uma reserva por ID com `GET /booking/{id}`
- Criacao de reserva com `POST /booking`
- Validacao do retorno com `bookingid`
- Validacao do corpo da reserva criada
- Validacao de `Content-Type`

### Cenarios negativos e regras de negocio

- `firstname` com valor nulo
- Datas em formato invalido
- `depositpaid` com tipo invalido
- `checkout` anterior ao `checkin`
- `totalprice` igual a zero
- Campos com caracteres especiais
- Tentativa de envio de script HTML no campo `firstname`

## Fixtures e helpers

- `fixtures/booking.json`: massa fixa para criacao de reservas.
- `fixtures/credentials.json`: credenciais usadas no login.
- `helpers/authentication.js`: helper para gerar token.
- `helpers/addBooking.js`: helper para criar booking antes de testes de consulta.
- `helpers/datesHelper.js`: funcoes para gerar datas dinamicas.
- `factories/bookingFactory`: factory para gerar massa dinamica com Faker.

## Observacoes

Alguns testes documentam comportamentos considerados bugs ou inconsistencias da API publica, como aceitar datas invalidas, aceitar scripts HTML ou retornar status diferente do esperado para dados invalidos. Esses pontos estao comentados nos proprios testes para facilitar a analise.

Como a API testada e publica, os resultados podem variar caso o servico esteja indisponivel, lento ou tenha mudancas de comportamento.
