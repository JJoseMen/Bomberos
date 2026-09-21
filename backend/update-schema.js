const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let content = fs.readFileSync(filePath, 'utf8');

// Add renovacion fields to solicitudes
const oldFields = `  fechaVigencia      DateTime?
  createdAt          DateTime          @default(now())`;

const newFields = `  fechaVigencia      DateTime?
  esRenovacion       Boolean           @default(false)
  solicitudAnteriorId Int?
  solicitudAnterior  solicitudes?      @relation("Renovaciones", fields: [solicitudAnteriorId], references: [id])
  renovaciones       solicitudes[]     @relation("Renovaciones")
  createdAt          DateTime          @default(now())`;

content = content.replace(oldFields, newFields);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Schema updated with renovacion fields');
