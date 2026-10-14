# E-commerce — Refatoração SOLID

Backend de e-commerce (Node.js, Express, TypeScript, Prisma/SQLite, Nodemailer e Winston) que originalmente concentrava toda a lógica no `OrderController` (God Class). Esta versão refatora o código aplicando os princípios SOLID, **sem alterar o contrato da API** (`POST /orders`).

## Instalação e execução

```bash
npm install
npm run prisma:migrate   # cria o banco SQLite e as tabelas
npm run prisma:seed      # cria o Livro Físico (id 1) e o E-book (id 2)
npm run dev              # sobe a API em http://localhost:3000
```

> A primeira execução pode demorar alguns segundos: o Nodemailer cria uma conta de teste no Ethereal automaticamente. O link para visualizar o e-mail enviado aparece na resposta (`emailPreview`) e no log.

## Como testar

**Livro físico (preço + R$ 10,00 de frete = R$ 110,00):**

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacaxi123@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

**E-book (digital, sem frete = R$ 50,00):**

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacate123@ethereal.email",
  "items": [{ "productId": 2, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

**Pagamento com Pix (novo meio de pagamento):** use `"paymentMethod": "pix"` (não precisa de `paymentDetails`).

**Cartão recusado:** use `"cvv": "000"` → resposta `402` com `Cartão recusado`.

Meios de pagamento aceitos: `credit_card`, `debit_card` e `pix`.

## Arquitetura

```text
src/
├── controllers/
│   └── OrderController.ts          # HTTP: recebe a request, chama o service, devolve a response
├── services/
│   ├── OrderService.ts             # Fluxo do pedido: valida → calcula → paga → salva → notifica
│   └── NotificationService.ts      # Define O QUE enviar (assunto e corpo do e-mail)
├── domain/
│   ├── IProduct.ts                 # Interface Product (calculateFreight)
│   ├── PhysicalProduct.ts          # Frete fixo de R$ 10,00
│   ├── DigitalProduct.ts           # Frete zero
│   └── ProductFactory.ts           # Converte o dado do banco no produto correto
├── payments/
│   ├── IPaymentMethod.ts           # Contrato de pagamento
│   ├── CreditCardPayment.ts
│   ├── DebitCardPayment.ts
│   ├── PixPayment.ts
│   └── PaymentMethodRegistry.ts    # Entrega o meio de pagamento pelo nome
├── providers/
│   ├── IMailProvider.ts            # Contrato de envio de e-mail
│   └── EtherealMailProvider.ts     # Implementação com Nodemailer
├── repositories/
│   ├── IProductRepository.ts
│   ├── IOrderRepository.ts
│   ├── PrismaProductRepository.ts
│   └── PrismaOrderRepository.ts
├── errors/
│   └── AppError.ts                 # Erro esperado, com status HTTP
├── lib/
│   ├── logger.ts                   # Winston
│   ├── mail.ts                     # Configuração do Nodemailer/Ethereal
│   └── prisma.ts                   # Instância única do PrismaClient
├── app.ts                          # Composition Root (monta as dependências) + Express
└── server.ts
```

## Princípios SOLID aplicados

| Princípio | Problema no código legado | Como foi resolvido |
|-----------|---------------------------|--------------------|
| **SRP** | O controller validava, calculava, cobrava, gravava no banco e enviava e-mail | Cada responsabilidade ficou em uma classe: `OrderController` (HTTP), `OrderService` (fluxo), repositórios (banco), `NotificationService` + `IMailProvider` (e-mail) |
| **OCP** | Adicionar Pix exigia alterar um `if/else` dentro do código principal | `IPaymentMethod` com uma classe por meio de pagamento. O Pix foi adicionado criando `PixPayment` e registrando no `app.ts`, sem tocar no `OrderService` |
| **LSP** | `if (product.type === 'physical')` para decidir o frete | `PhysicalProduct` e `DigitalProduct` implementam `Product` e podem ser usados de forma intercambiável; cada um sabe calcular o próprio frete |
| **ISP** | — | Interfaces pequenas e específicas: `IMailProvider` (1 método), `IOrderRepository`, `IProductRepository`, `IPaymentMethod` |
| **DIP** | O controller dependia diretamente de Prisma e Nodemailer | O `OrderService` depende apenas de interfaces. As implementações concretas são escolhidas em um único lugar, o `app.ts` (injeção de dependência manual) |

### Como adicionar um novo meio de pagamento

1. Criar `src/payments/BoletoPayment.ts` implementando `IPaymentMethod` (com `name = 'boleto'`).
2. Incluir `new BoletoPayment()` na lista do `PaymentMethodRegistry` em `src/app.ts`.

Nenhuma outra classe precisa ser alterada.

## Decisões de projeto

- **Frete:** continua sendo cobrado uma vez por item do pedido (e não por unidade), como no código legado.
- **Erros:** erros esperados usam `AppError` (ex.: `400` carrinho vazio, `402` cartão recusado) e qualquer outro erro vira `500`.
- **E-mail:** se o envio falhar depois do pagamento e da gravação, o pedido continua confirmado e a falha é apenas registrada no log.
- **Validações:** e-mail do cliente, `productId` e `quantity` (inteiro maior que zero) e dados do cartão são validados antes de cobrar.
