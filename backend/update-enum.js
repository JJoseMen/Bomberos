const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let content = fs.readFileSync(filePath, 'utf8');

const oldEnum = `enum EstadoSolicitud {
  BORRADOR
  ENVIADA
  EN_REVISION
  OBSERVADA
  APROBADA
  RECHAZADA
  ANULADA
}`;

const newEnum = `enum EstadoSolicitud {
  BORRADOR
  ENVIADA
  EN_REVISION
  REVISADO
  OBSERVADA
  APROBADA
  RECHAZADA
  CERTIFICADO_EMITIDO
  VENCIDO
  RENOVADO
  ANULADA
}`;

content = content.replace(oldEnum, newEnum);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Enum updated');
