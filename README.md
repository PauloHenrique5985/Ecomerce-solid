# E-commerce — Refatoração SOLID

Simulação de Backend de e-commerce

## Instalação e execução

```bash
npm install
npm run prisma:migrate   # cria o banco SQLite e as tabelas
npm run prisma:seed      # cria o Livro Físico (id 1) e o E-book (id 2)
npm run dev              # sobe a API em http://localhost:3000
```

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
