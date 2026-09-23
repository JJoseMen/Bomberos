const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient();
p.usuarios_internos.findMany({ select: { ci: true, email: true, rol: true } })
  .then(r => { console.log(JSON.stringify(r, null, 2)); return p.$disconnect(); })
  .catch(e => { console.error(e); p.$disconnect(); });
